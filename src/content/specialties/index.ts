import { SpecialtyContent } from "./types";
import aodAddiction from "./aod-addiction";
import youthMentalHealth from "./youth-mental-health";
import perinatalMentalHealth from "./perinatal-mental-health";
import eatingDisorders from "./eating-disorders";
import suicidePrevention from "./suicide-prevention";
import trauma from "./trauma";
import forensicMentalHealth from "./forensic-mental-health";
import atsiMentalHealth from "./atsi-mental-health";
import lgbtqiaMentalHealth from "./lgbtqia-mental-health";
import ruralRemote from "./rural-remote";

export const SPECIALTY_CONTENT: Record<string, SpecialtyContent> = {
  "aod-addiction": aodAddiction,
  "youth-mental-health": youthMentalHealth,
  "perinatal-mental-health": perinatalMentalHealth,
  "eating-disorders": eatingDisorders,
  "suicide-prevention": suicidePrevention,
  "trauma": trauma,
  "forensic-mental-health": forensicMentalHealth,
  "atsi-mental-health": atsiMentalHealth,
  "lgbtqia-mental-health": lgbtqiaMentalHealth,
  "rural-remote": ruralRemote,
};
