import { LocationContent } from "./types";
import sydneyNSW from "./sydney-nsw";
import melbourneVIC from "./melbourne-vic";
import brisbaneQLD from "./brisbane-qld";
import perthWA from "./perth-wa";
import adelaideSA from "./adelaide-sa";
import canberraACT from "./canberra-act";
import hobartTAS from "./hobart-tas";
import darwinNT from "./darwin-nt";
// NSW regional
import newcastleNSW from "./newcastle-nsw";
import wollongongNSW from "./wollongong-nsw";
import centralCoastNSW from "./central-coast-nsw";
import alburyNSW from "./albury-nsw";
import waggaWaggaNSW from "./wagga-wagga-nsw";
import tamworthNSW from "./tamworth-nsw";
import portMacquarieNSW from "./port-macquarie-nsw";
import coffsHarbourNSW from "./coffs-harbour-nsw";
import lismoreNSW from "./lismore-nsw";
import dubboNSW from "./dubbo-nsw";
import orangeNSW from "./orange-nsw";
import bathurstNSW from "./bathurst-nsw";
import goulburnNSW from "./goulburn-nsw";
// VIC regional
import geelongVIC from "./geelong-vic";
import ballaratVIC from "./ballarat-vic";
import bendigoVIC from "./bendigo-vic";
import sheppartonVIC from "./shepparton-vic";
import warrnamboolVIC from "./warrnambool-vic";
import milduraVIC from "./mildura-vic";
// QLD regional
import goldCoastQLD from "./gold-coast-qld";
import sunshineCoastQLD from "./sunshine-coast-qld";
import townsvilleQLD from "./townsville-qld";
import cairnsQLD from "./cairns-qld";
import toowoombsQLD from "./toowoomba-qld";
import rockhamptonQLD from "./rockhampton-qld";
import bundabergQLD from "./bundaberg-qld";
import mackayQLD from "./mackay-qld";
// SA regional
import mountGambierSA from "./mount-gambier-sa";
// WA regional
import bunburyWA from "./bunbury-wa";
import geraldtonWA from "./geraldton-wa";
import kalgoorlieWA from "./kalgoorlie-wa";
// TAS regional
import launcestonTAS from "./launceston-tas";
// NT regional
import aliceSpringsNT from "./alice-springs-nt";
// Work arrangements
import remoteAustralia from "./remote-australia";
import hybrid from "./hybrid";

const ALL_LOCATION_CONTENT: LocationContent[] = [
  sydneyNSW,
  melbourneVIC,
  brisbaneQLD,
  perthWA,
  adelaideSA,
  canberraACT,
  hobartTAS,
  darwinNT,
  // NSW regional
  newcastleNSW,
  wollongongNSW,
  centralCoastNSW,
  alburyNSW,
  waggaWaggaNSW,
  tamworthNSW,
  portMacquarieNSW,
  coffsHarbourNSW,
  lismoreNSW,
  dubboNSW,
  orangeNSW,
  bathurstNSW,
  goulburnNSW,
  // VIC regional
  geelongVIC,
  ballaratVIC,
  bendigoVIC,
  sheppartonVIC,
  warrnamboolVIC,
  milduraVIC,
  // QLD regional
  goldCoastQLD,
  sunshineCoastQLD,
  townsvilleQLD,
  cairnsQLD,
  toowoombsQLD,
  rockhamptonQLD,
  bundabergQLD,
  mackayQLD,
  // SA regional
  mountGambierSA,
  // WA regional
  bunburyWA,
  geraldtonWA,
  kalgoorlieWA,
  // TAS regional
  launcestonTAS,
  // NT regional
  aliceSpringsNT,
  // Work arrangements
  remoteAustralia,
  hybrid,
];

export const LOCATION_CONTENT: Record<string, LocationContent> = Object.fromEntries(
  ALL_LOCATION_CONTENT.map((l) => [l.slug, l])
);

export type { LocationContent };
