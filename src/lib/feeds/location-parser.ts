import { AU_LOCATIONS, AU_STATES, AUState } from "@/constants";

export interface ParsedLocation {
  city: string | null;
  state: AUState | null;
  displayName: string;
  isRemote: boolean;
}

const STATE_NAME_MAP: Record<string, AUState> = {
  "new south wales": "NSW",
  "victoria": "VIC",
  "queensland": "QLD",
  "western australia": "WA",
  "south australia": "SA",
  "australian capital territory": "ACT",
  "tasmania": "TAS",
  "northern territory": "NT",
};

const CITY_TO_STATE: Record<string, AUState> = {};
for (const loc of AU_LOCATIONS) {
  if (loc.state) {
    const city = loc.name.split(", ")[0].toLowerCase();
    CITY_TO_STATE[city] = loc.state;
  }
}

export function parseAdzunaLocation(area: string[], displayName: string): ParsedLocation {
  const lowerDisplay = displayName.toLowerCase();

  if (lowerDisplay.includes("remote") || lowerDisplay.includes("work from home") || lowerDisplay.includes("anywhere")) {
    return { city: null, state: null, displayName: "Remote (Australia)", isRemote: true };
  }

  // Adzuna area is typically: ["Australia", "State Name", "City/Region"]
  let state: AUState | null = null;
  let city: string | null = null;

  for (const part of area) {
    const lower = part.toLowerCase();
    // Check state abbreviations
    if (AU_STATES.includes(part as AUState)) {
      state = part as AUState;
    }
    // Check full state names
    if (STATE_NAME_MAP[lower]) {
      state = STATE_NAME_MAP[lower];
    }
  }

  // Last element in area (after Australia and state) is typically the city/region
  if (area.length >= 3) {
    city = area[area.length - 1];
  } else if (area.length === 2 && !STATE_NAME_MAP[area[1].toLowerCase()]) {
    city = area[1];
  }

  // Fallback: try to match display_name against known cities
  if (!state && !city) {
    for (const [knownCity, knownState] of Object.entries(CITY_TO_STATE)) {
      if (lowerDisplay.includes(knownCity)) {
        city = knownCity.charAt(0).toUpperCase() + knownCity.slice(1);
        state = knownState;
        break;
      }
    }
  }

  // Try to infer state from city
  if (city && !state) {
    state = CITY_TO_STATE[city.toLowerCase()] ?? null;
  }

  // Build display name matching AU_LOCATIONS format
  let matchedDisplayName = displayName;
  if (city && state) {
    const match = AU_LOCATIONS.find(
      (l) => l.state === state && l.name.toLowerCase().startsWith(city!.toLowerCase())
    );
    matchedDisplayName = match?.name ?? `${city}, ${state}`;
  } else if (state) {
    matchedDisplayName = `${state}`;
  }

  return { city, state, displayName: matchedDisplayName, isRemote: false };
}
