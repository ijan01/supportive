export interface NoindexData {
  listingsCount: number;
  historicalCount: number;
  contentWordCount: number;
  hasCustomMeta: boolean;
}

const ACTIVE_THRESHOLD = 3;
const HISTORICAL_THRESHOLD = 5;
const WORD_THRESHOLD = 300;

export function shouldNoindex(data: NoindexData): boolean {
  const hasListings =
    data.listingsCount >= ACTIVE_THRESHOLD ||
    data.historicalCount >= HISTORICAL_THRESHOLD;
  return !(hasListings && data.contentWordCount >= WORD_THRESHOLD && data.hasCustomMeta);
}
