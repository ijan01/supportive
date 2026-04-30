export type TransportMode = "train" | "tram" | "bus" | "ferry";

export interface TransportOption {
  name: string;
  type: string;
  mode: TransportMode;
}

export interface AmenityCount {
  label: string;
  count: number;
}

export interface CityData {
  state: string;
  transport: TransportOption[];
  amenities: AmenityCount[];
  updatedMonth: string;
}

export const CITY_DATA: Record<string, CityData> = {
  Sydney: {
    state: "NSW",
    transport: [
      { name: "Central Station", type: "Train station", mode: "train" },
      { name: "Town Hall Station", type: "Train / Metro", mode: "train" },
      { name: "Wynyard Station", type: "Train / Metro", mode: "train" },
      { name: "Circular Quay", type: "Train / Ferry", mode: "ferry" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 2400 },
      { label: "Gyms & Fitness", count: 180 },
      { label: "Childcare", count: 28 },
      { label: "Banks & Post", count: 125 },
      { label: "Medical & Pharmacy", count: 95 },
      { label: "Supermarkets", count: 48 },
    ],
    updatedMonth: "April 2026",
  },
  Melbourne: {
    state: "VIC",
    transport: [
      { name: "Flinders Street Station", type: "Train station", mode: "train" },
      { name: "Southern Cross Station", type: "Train station", mode: "train" },
      { name: "Melbourne Central", type: "Train / Metro", mode: "train" },
      { name: "Collins Street Tram", type: "Tram / Light rail", mode: "tram" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 2100 },
      { label: "Gyms & Fitness", count: 155 },
      { label: "Childcare", count: 22 },
      { label: "Banks & Post", count: 105 },
      { label: "Medical & Pharmacy", count: 82 },
      { label: "Supermarkets", count: 40 },
    ],
    updatedMonth: "April 2026",
  },
  Brisbane: {
    state: "QLD",
    transport: [
      { name: "Central Station", type: "Train station", mode: "train" },
      { name: "Roma Street Station", type: "Train station", mode: "train" },
      { name: "South Bank Busway", type: "Bus interchange", mode: "bus" },
      { name: "Eagle Street Pier", type: "Ferry / CityCat", mode: "ferry" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 1200 },
      { label: "Gyms & Fitness", count: 95 },
      { label: "Childcare", count: 18 },
      { label: "Banks & Post", count: 72 },
      { label: "Medical & Pharmacy", count: 58 },
      { label: "Supermarkets", count: 28 },
    ],
    updatedMonth: "April 2026",
  },
  Perth: {
    state: "WA",
    transport: [
      { name: "Perth Station", type: "Train station", mode: "train" },
      { name: "Elizabeth Quay Station", type: "Train", mode: "train" },
      { name: "City West Station", type: "Train", mode: "train" },
      { name: "Perth Busport", type: "Bus interchange", mode: "bus" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 900 },
      { label: "Gyms & Fitness", count: 75 },
      { label: "Childcare", count: 14 },
      { label: "Banks & Post", count: 60 },
      { label: "Medical & Pharmacy", count: 48 },
      { label: "Supermarkets", count: 22 },
    ],
    updatedMonth: "April 2026",
  },
  Adelaide: {
    state: "SA",
    transport: [
      { name: "Adelaide Station", type: "Train station", mode: "train" },
      { name: "King William Street", type: "Bus interchange", mode: "bus" },
      { name: "Glenelg Tram", type: "Tram / Light rail", mode: "tram" },
      { name: "Adelaide Interchange", type: "Bus", mode: "bus" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 720 },
      { label: "Gyms & Fitness", count: 58 },
      { label: "Childcare", count: 12 },
      { label: "Banks & Post", count: 48 },
      { label: "Medical & Pharmacy", count: 38 },
      { label: "Supermarkets", count: 18 },
    ],
    updatedMonth: "April 2026",
  },
  Canberra: {
    state: "ACT",
    transport: [
      { name: "Canberra Metro", type: "Light rail", mode: "tram" },
      { name: "City Bus Station", type: "Bus interchange", mode: "bus" },
      { name: "Woden Bus Station", type: "Bus", mode: "bus" },
      { name: "Belconnen Bus Station", type: "Bus", mode: "bus" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 480 },
      { label: "Gyms & Fitness", count: 45 },
      { label: "Childcare", count: 16 },
      { label: "Banks & Post", count: 38 },
      { label: "Medical & Pharmacy", count: 32 },
      { label: "Supermarkets", count: 24 },
    ],
    updatedMonth: "April 2026",
  },
  "Gold Coast": {
    state: "QLD",
    transport: [
      { name: "Surfers Paradise Station", type: "Light rail – G:link", mode: "tram" },
      { name: "Broadbeach South", type: "Light rail – G:link", mode: "tram" },
      { name: "Robina Station", type: "Train", mode: "train" },
      { name: "Helensvale Station", type: "Train / Light rail", mode: "train" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 980 },
      { label: "Gyms & Fitness", count: 82 },
      { label: "Childcare", count: 20 },
      { label: "Banks & Post", count: 58 },
      { label: "Medical & Pharmacy", count: 52 },
      { label: "Supermarkets", count: 32 },
    ],
    updatedMonth: "April 2026",
  },
  Hobart: {
    state: "TAS",
    transport: [
      { name: "Hobart CBD", type: "Bus – Metro Tasmania", mode: "bus" },
      { name: "Elizabeth Street Mall", type: "Bus interchange", mode: "bus" },
      { name: "Hobart Waterfront", type: "MONA Ferry", mode: "ferry" },
      { name: "Sandy Bay Road", type: "Bus", mode: "bus" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 320 },
      { label: "Gyms & Fitness", count: 28 },
      { label: "Childcare", count: 8 },
      { label: "Banks & Post", count: 28 },
      { label: "Medical & Pharmacy", count: 22 },
      { label: "Supermarkets", count: 14 },
    ],
    updatedMonth: "April 2026",
  },
  Darwin: {
    state: "NT",
    transport: [
      { name: "Darwin CBD", type: "Bus", mode: "bus" },
      { name: "Mitchell Street", type: "Bus – City route", mode: "bus" },
      { name: "Casuarina Bus Interchange", type: "Bus", mode: "bus" },
      { name: "Palmerston Bus Interchange", type: "Bus", mode: "bus" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 240 },
      { label: "Gyms & Fitness", count: 22 },
      { label: "Childcare", count: 6 },
      { label: "Banks & Post", count: 20 },
      { label: "Medical & Pharmacy", count: 18 },
      { label: "Supermarkets", count: 10 },
    ],
    updatedMonth: "April 2026",
  },
  Newcastle: {
    state: "NSW",
    transport: [
      { name: "Newcastle Interchange", type: "Train / Bus", mode: "train" },
      { name: "Newcastle Light Rail", type: "Tram / Light rail", mode: "tram" },
      { name: "Wickham Station", type: "Train", mode: "train" },
      { name: "Hamilton Station", type: "Train", mode: "train" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 420 },
      { label: "Gyms & Fitness", count: 38 },
      { label: "Childcare", count: 10 },
      { label: "Banks & Post", count: 32 },
      { label: "Medical & Pharmacy", count: 26 },
      { label: "Supermarkets", count: 16 },
    ],
    updatedMonth: "April 2026",
  },
  Geelong: {
    state: "VIC",
    transport: [
      { name: "Geelong Station", type: "Train – V/Line", mode: "train" },
      { name: "Geelong Transit Centre", type: "Bus interchange", mode: "bus" },
      { name: "South Geelong Station", type: "Train", mode: "train" },
      { name: "Marshall Station", type: "Train", mode: "train" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 380 },
      { label: "Gyms & Fitness", count: 32 },
      { label: "Childcare", count: 9 },
      { label: "Banks & Post", count: 28 },
      { label: "Medical & Pharmacy", count: 24 },
      { label: "Supermarkets", count: 15 },
    ],
    updatedMonth: "April 2026",
  },
  Wollongong: {
    state: "NSW",
    transport: [
      { name: "Wollongong Station", type: "Train", mode: "train" },
      { name: "Wollongong City Bus", type: "Bus interchange", mode: "bus" },
      { name: "North Wollongong Station", type: "Train", mode: "train" },
      { name: "Coniston Station", type: "Train", mode: "train" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 360 },
      { label: "Gyms & Fitness", count: 30 },
      { label: "Childcare", count: 8 },
      { label: "Banks & Post", count: 26 },
      { label: "Medical & Pharmacy", count: 22 },
      { label: "Supermarkets", count: 14 },
    ],
    updatedMonth: "April 2026",
  },
  Townsville: {
    state: "QLD",
    transport: [
      { name: "Townsville CBD", type: "Bus – Sunbus", mode: "bus" },
      { name: "Flinders Street East", type: "Bus", mode: "bus" },
      { name: "Thuringowa Central", type: "Bus interchange", mode: "bus" },
      { name: "Willows interchange", type: "Bus", mode: "bus" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 290 },
      { label: "Gyms & Fitness", count: 25 },
      { label: "Childcare", count: 8 },
      { label: "Banks & Post", count: 22 },
      { label: "Medical & Pharmacy", count: 20 },
      { label: "Supermarkets", count: 12 },
    ],
    updatedMonth: "April 2026",
  },
  Cairns: {
    state: "QLD",
    transport: [
      { name: "Cairns CBD", type: "Bus – Sunbus", mode: "bus" },
      { name: "Cairns Central", type: "Bus interchange", mode: "bus" },
      { name: "Smithfield", type: "Bus", mode: "bus" },
      { name: "Cairns Airport", type: "Shuttle", mode: "bus" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 260 },
      { label: "Gyms & Fitness", count: 22 },
      { label: "Childcare", count: 7 },
      { label: "Banks & Post", count: 20 },
      { label: "Medical & Pharmacy", count: 18 },
      { label: "Supermarkets", count: 11 },
    ],
    updatedMonth: "April 2026",
  },
  Parramatta: {
    state: "NSW",
    transport: [
      { name: "Parramatta Station", type: "Train / Metro", mode: "train" },
      { name: "Parramatta Light Rail", type: "Light rail", mode: "tram" },
      { name: "Westmead Station", type: "Train", mode: "train" },
      { name: "Parramatta Ferry Wharf", type: "Ferry", mode: "ferry" },
    ],
    amenities: [
      { label: "Cafes & Restaurants", count: 580 },
      { label: "Gyms & Fitness", count: 48 },
      { label: "Childcare", count: 14 },
      { label: "Banks & Post", count: 42 },
      { label: "Medical & Pharmacy", count: 38 },
      { label: "Supermarkets", count: 20 },
    ],
    updatedMonth: "April 2026",
  },
};

export function getCityData(city: string | null): CityData | null {
  if (!city) return null;
  // Exact match
  if (CITY_DATA[city]) return CITY_DATA[city];
  // Case-insensitive match
  const key = Object.keys(CITY_DATA).find(
    (k) => k.toLowerCase() === city.toLowerCase()
  );
  return key ? CITY_DATA[key] : null;
}
