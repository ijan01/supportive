import { describe, it, before, after, mock } from "node:test";
import assert from "node:assert/strict";
import { searchAdzuna, quotaTracker } from "./adzuna.js";

// Env vars are read inside searchAdzuna(), not at module import time
process.env.ADZUNA_APP_ID = "test_app_id";
process.env.ADZUNA_APP_KEY = "test_app_key";

const MOCK_JOB = {
  id: "abc123",
  title: "Mental Health Nurse",
  description: "A great nursing role.",
  company: { display_name: "NSW Health" },
  location: { area: ["Australia", "New South Wales", "Sydney"], display_name: "Sydney" },
  salary_min: 90000,
  salary_max: 110000,
  salary_is_predicted: "0" as const,
  contract_time: "full_time" as const,
  contract_type: "permanent" as const,
  created: "2026-04-01T00:00:00Z",
  redirect_url: "https://adzuna.com.au/jobs/details/abc123",
  category: { tag: "healthcare-nursing-jobs", label: "Healthcare & Nursing" },
  latitude: -33.87,
  longitude: 151.21,
};

const MOCK_RESPONSE = { count: 1, mean: 100000, results: [MOCK_JOB] };

describe("searchAdzuna", () => {
  let originalFetch: typeof global.fetch;

  before(() => {
    originalFetch = global.fetch;
  });

  after(() => {
    global.fetch = originalFetch;
  });

  it("happy path — returns parsed response", async () => {
    global.fetch = mock.fn(async () =>
      new Response(JSON.stringify(MOCK_RESPONSE), { status: 200 })
    ) as typeof global.fetch;

    const result = await searchAdzuna({ what: "mental health nurse" });
    assert.equal(result.count, 1);
    assert.equal(result.results[0].id, "abc123");
    assert.equal(result.results[0].title, "Mental Health Nurse");
  });

  it("includes correct query params in URL", async () => {
    let capturedUrl = "";
    global.fetch = mock.fn(async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return new Response(JSON.stringify(MOCK_RESPONSE), { status: 200 });
    }) as typeof global.fetch;

    await searchAdzuna({ what: "psychologist", where: "Melbourne", max_days_old: 7, page: 2 });

    assert.ok(capturedUrl.includes("/au/search/2?"), "URL should include page 2");
    assert.ok(capturedUrl.includes("what=psychologist"), "URL should include what");
    assert.ok(capturedUrl.includes("where=Melbourne"), "URL should include where");
    assert.ok(capturedUrl.includes("max_days_old=7"), "URL should include max_days_old");
    assert.ok(capturedUrl.includes("app_id=test_app_id"), "URL should include app_id");
  });

  it("retries on 429 and succeeds on second attempt", async () => {
    let callCount = 0;
    global.fetch = mock.fn(async () => {
      callCount++;
      if (callCount === 1) return new Response("rate limited", { status: 429 });
      return new Response(JSON.stringify(MOCK_RESPONSE), { status: 200 });
    }) as typeof global.fetch;

    const result = await searchAdzuna({ what: "counsellor" });
    assert.equal(callCount, 2);
    assert.equal(result.results[0].id, "abc123");
  });

  it("throws after 3 consecutive 429s", async () => {
    global.fetch = mock.fn(async () =>
      new Response("rate limited", { status: 429 })
    ) as typeof global.fetch;

    await assert.rejects(
      () => searchAdzuna({ what: "peer worker" }),
      /rate limited after 3 retries/
    );
  });

  it("retries on 500 and succeeds on second attempt", async () => {
    let callCount = 0;
    global.fetch = mock.fn(async () => {
      callCount++;
      if (callCount === 1) return new Response("server error", { status: 500 });
      return new Response(JSON.stringify(MOCK_RESPONSE), { status: 200 });
    }) as typeof global.fetch;

    const result = await searchAdzuna({ what: "AOD worker" });
    assert.equal(callCount, 2);
    assert.equal(result.count, 1);
  });

  it("throws immediately on 401 without retrying", async () => {
    let callCount = 0;
    global.fetch = mock.fn(async () => {
      callCount++;
      return new Response("unauthorized", { status: 401 });
    }) as typeof global.fetch;

    await assert.rejects(
      () => searchAdzuna({ what: "psychologist" }),
      /client error 401/
    );
    assert.equal(callCount, 1, "should not retry on 401");
  });

  it("throws when env vars are missing", async () => {
    const savedId = process.env.ADZUNA_APP_ID;
    delete process.env.ADZUNA_APP_ID;

    await assert.rejects(
      () => searchAdzuna({ what: "nurse" }),
      /ADZUNA_APP_ID and ADZUNA_APP_KEY/
    );

    process.env.ADZUNA_APP_ID = savedId;
  });
});

describe("quotaTracker", () => {
  it("increments call count on each search", async () => {
    const before = quotaTracker.callsThisMonth;
    global.fetch = mock.fn(async () =>
      new Response(JSON.stringify(MOCK_RESPONSE), { status: 200 })
    ) as typeof global.fetch;
    await searchAdzuna({ what: "social worker" });
    assert.equal(quotaTracker.callsThisMonth, before + 1);
  });
});
