export interface AdzunaJobLocation {
  area: string[];
  display_name: string;
}

export interface AdzunaJobCompany {
  display_name: string;
}

export interface AdzunaJobCategory {
  tag: string;
  label: string;
}

export interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  company: AdzunaJobCompany;
  location: AdzunaJobLocation;
  salary_min: number | null;
  salary_max: number | null;
  salary_is_predicted: "1" | "0";
  contract_time: "full_time" | "part_time" | null;
  contract_type: "permanent" | "contract" | null;
  created: string;
  redirect_url: string;
  category: AdzunaJobCategory;
  latitude: number | null;
  longitude: number | null;
}

export interface AdzunaResponse {
  count: number;
  mean: number;
  results: AdzunaJob[];
}

export interface AdzunaSearchParams {
  what: string;
  where?: string;
  results_per_page?: number;
  page?: number;
  sort_by?: "date" | "relevance" | "salary";
  max_days_old?: number;
}

// In-memory quota tracker — resets at process restart (sufficient for daily cron)
const quotaTracker = {
  callsThisMonth: 0,
  monthKey: "",
  MONTHLY_LIMIT: 1000,
  WARN_THRESHOLD: 0.8,

  record() {
    const key = new Date().toISOString().slice(0, 7); // "2026-04"
    if (key !== this.monthKey) {
      this.callsThisMonth = 0;
      this.monthKey = key;
    }
    this.callsThisMonth++;
    const usage = this.callsThisMonth / this.MONTHLY_LIMIT;
    if (usage >= this.WARN_THRESHOLD) {
      console.warn(
        `[adzuna] quota warning: ${this.callsThisMonth}/${this.MONTHLY_LIMIT} calls used this month (${Math.round(usage * 100)}%)`
      );
    }
  },

  get remaining() {
    return Math.max(0, this.MONTHLY_LIMIT - this.callsThisMonth);
  },
};

const BASE_URL = "https://api.adzuna.com/v1/api/jobs/au/search";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, attempt = 1): Promise<Response> {
  const res = await fetch(url);

  if (res.status === 429) {
    if (attempt >= 3) throw new Error("[adzuna] rate limited after 3 retries (429)");
    const delay = 1000 * Math.pow(2, attempt); // 2s, 4s
    console.warn(`[adzuna] 429 rate limited, retrying in ${delay}ms (attempt ${attempt})`);
    await sleep(delay);
    return fetchWithRetry(url, attempt + 1);
  }

  if (res.status >= 500) {
    if (attempt >= 2) throw new Error(`[adzuna] server error after 2 retries (${res.status})`);
    const delay = attempt * 1000; // 1s, 2s
    console.warn(`[adzuna] ${res.status} server error, retrying in ${delay}ms (attempt ${attempt})`);
    await sleep(delay);
    return fetchWithRetry(url, attempt + 1);
  }

  if (res.status >= 400) {
    // 4xx other than 429: misconfiguration, fail fast
    const body = await res.text().catch(() => "");
    throw new Error(`[adzuna] client error ${res.status}: ${body}`);
  }

  return res;
}

export async function searchAdzuna(params: AdzunaSearchParams): Promise<AdzunaResponse> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error("[adzuna] ADZUNA_APP_ID and ADZUNA_APP_KEY env vars are required");
  }

  if (quotaTracker.remaining === 0) {
    throw new Error("[adzuna] monthly quota exhausted");
  }

  const page = params.page ?? 1;
  const query = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: String(params.results_per_page ?? 50),
    what: params.what,
    sort_by: params.sort_by ?? "date",
    max_days_old: String(params.max_days_old ?? 30),
    ...(params.where ? { where: params.where } : {}),
  });

  const url = `${BASE_URL}/${page}?${query.toString()}`;

  console.log(`[adzuna] fetching: what="${params.what}" page=${page}`);
  quotaTracker.record();

  const res = await fetchWithRetry(url);
  const data = (await res.json()) as AdzunaResponse;

  console.log(`[adzuna] got ${data.results?.length ?? 0} results (total count: ${data.count})`);
  return data;
}

export { quotaTracker };
