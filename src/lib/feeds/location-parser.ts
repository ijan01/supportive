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

// Additional aliases for Adzuna feed variations not covered by AU_LOCATIONS names
const CITY_ALIASES: Record<string, AUState> = {
  // NSW
  "gosford": "NSW",
  "wyong": "NSW",
  "central coast": "NSW",
  "albury-wodonga": "NSW",
  "albury wodonga": "NSW",
  "wagga": "NSW",
  "armidale": "NSW",
  "lismore": "NSW",
  "ballina": "NSW",
  "grafton": "NSW",
  "kempsey": "NSW",
  "inverell": "NSW",
  "moree": "NSW",
  "broken hill": "NSW",
  "griffith": "NSW",
  "leeton": "NSW",
  "deniliquin": "NSW",
  "queanbeyan": "NSW",
  "goulburn": "NSW",
  "yass": "NSW",
  "cooma": "NSW",
  "batemans bay": "NSW",
  "nowra": "NSW",
  "ulladulla": "NSW",
  "milton": "NSW",
  // VIC
  "wodonga": "VIC",
  "horsham": "VIC",
  "hamilton": "VIC",
  "portland": "VIC",
  "colac": "VIC",
  "sale": "VIC",
  "bairnsdale": "VIC",
  "swan hill": "VIC",
  "echuca": "VIC",
  "cobram": "VIC",
  "seymour": "VIC",
  "wangaratta": "VIC",
  "benalla": "VIC",
  "ararat": "VIC",
  "stawell": "VIC",
  // QLD
  "sunshine coast": "QLD",
  "maroochydore": "QLD",
  "caloundra": "QLD",
  "noosa": "QLD",
  "hervey bay": "QLD",
  "maryborough": "QLD",
  "gympie": "QLD",
  "emerald": "QLD",
  "longreach": "QLD",
  "mount isa": "QLD",
  "charters towers": "QLD",
  "bowen": "QLD",
  "whitsundays": "QLD",
  "airlie beach": "QLD",
  "gladstone": "QLD",
  "biloela": "QLD",
  "dalby": "QLD",
  "kingaroy": "QLD",
  "roma": "QLD",
  "charleville": "QLD",
  // SA
  "port augusta": "SA",
  "port pirie": "SA",
  "whyalla": "SA",
  "port lincoln": "SA",
  "murray bridge": "SA",
  "victor harbor": "SA",
  "naracoorte": "SA",
  "bordertown": "SA",
  // WA
  "mandurah": "WA",
  "busselton": "WA",
  "margaret river": "WA",
  "albany": "WA",
  "esperance": "WA",
  "broome": "WA",
  "port hedland": "WA",
  "karratha": "WA",
  "newman": "WA",
  "carnarvon": "WA",
  "exmouth": "WA",
  // TAS
  "burnie": "TAS",
  "devonport": "TAS",
  "ulverstone": "TAS",
  "queenstown": "TAS",
  // NT
  "katherine": "NT",
  "nhulunbuy": "NT",
  "tennant creek": "NT",
  "palmerston": "NT",
};

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

  // Fallback: try to match display_name against known cities and aliases
  if (!state && !city) {
    const combinedMap = { ...CITY_TO_STATE, ...CITY_ALIASES };
    for (const [knownCity, knownState] of Object.entries(combinedMap)) {
      if (lowerDisplay.includes(knownCity)) {
        city = knownCity.charAt(0).toUpperCase() + knownCity.slice(1);
        state = knownState;
        break;
      }
    }
  }

  // Try to infer state from city using both maps
  if (city && !state) {
    state = CITY_TO_STATE[city.toLowerCase()] ?? CITY_ALIASES[city.toLowerCase()] ?? null;
  }

  // Last resort: check if display_name contains a state abbreviation or full name
  if (!state) {
    for (const abbr of AU_STATES) {
      if (lowerDisplay.includes(` ${abbr.toLowerCase()}`) || lowerDisplay.endsWith(abbr.toLowerCase())) {
        state = abbr;
        break;
      }
    }
    if (!state) {
      for (const [fullName, abbr] of Object.entries(STATE_NAME_MAP)) {
        if (lowerDisplay.includes(fullName)) {
          state = abbr;
          break;
        }
      }
    }
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
