import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { shouldNoindex } from "./noindex.js";

const base = { listingsCount: 3, historicalCount: 0, contentWordCount: 300, hasCustomMeta: true };

describe("shouldNoindex", () => {
  it("returns false when all thresholds met", () => {
    assert.equal(shouldNoindex(base), false);
  });

  it("returns true when active listings below threshold and historical also below", () => {
    assert.equal(shouldNoindex({ ...base, listingsCount: 2, historicalCount: 4 }), true);
  });

  it("returns false when historical count meets threshold (active below)", () => {
    assert.equal(shouldNoindex({ ...base, listingsCount: 0, historicalCount: 5 }), false);
  });

  it("returns true when word count is below threshold", () => {
    assert.equal(shouldNoindex({ ...base, contentWordCount: 299 }), true);
  });

  it("returns false when word count exactly meets threshold", () => {
    assert.equal(shouldNoindex({ ...base, contentWordCount: 300 }), false);
  });

  it("returns true when meta is boilerplate", () => {
    assert.equal(shouldNoindex({ ...base, hasCustomMeta: false }), true);
  });

  it("returns true when all values are zero (placeholder page)", () => {
    assert.equal(
      shouldNoindex({ listingsCount: 0, historicalCount: 0, contentWordCount: 0, hasCustomMeta: false }),
      true
    );
  });
});
