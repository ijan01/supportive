import { AdzunaSearchParams } from "./adzuna.js";

const DEFAULT_MAX_DAYS_OLD = 7;

export const ADZUNA_QUERIES: AdzunaSearchParams[] = [
  { what: "mental health", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "peer support worker", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "peer worker", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "psychologist", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "clinical psychologist", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "psychiatrist", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "mental health nurse", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "mental health social worker", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "counsellor", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "psychotherapist", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "AOD worker", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "alcohol other drugs", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "NDIS mental health", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "youth mental health", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "eating disorder", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "lived experience", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "mental health occupational therapist", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "case manager mental health", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "clinical lead mental health", max_days_old: DEFAULT_MAX_DAYS_OLD },
  { what: "mental health educator", max_days_old: DEFAULT_MAX_DAYS_OLD },
];
