import { LocationContent } from "./types";
import sydneyNSW from "./sydney-nsw";
import melbourneVIC from "./melbourne-vic";
import brisbaneQLD from "./brisbane-qld";
import perthWA from "./perth-wa";
import adelaideSA from "./adelaide-sa";
import canberraACT from "./canberra-act";
import hobartTAS from "./hobart-tas";
import darwinNT from "./darwin-nt";
import newcastleNSW from "./newcastle-nsw";
import wollongongNSW from "./wollongong-nsw";
import goldCoastQLD from "./gold-coast-qld";
import geelongVIC from "./geelong-vic";

const ALL_LOCATION_CONTENT: LocationContent[] = [
  sydneyNSW,
  melbourneVIC,
  brisbaneQLD,
  perthWA,
  adelaideSA,
  canberraACT,
  hobartTAS,
  darwinNT,
  newcastleNSW,
  wollongongNSW,
  goldCoastQLD,
  geelongVIC,
];

export const LOCATION_CONTENT: Record<string, LocationContent> = Object.fromEntries(
  ALL_LOCATION_CONTENT.map((l) => [l.slug, l])
);

export type { LocationContent };
