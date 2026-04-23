import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseAdzunaLocation } from "./location-parser.js";

describe("parseAdzunaLocation", () => {
  it("parses Sydney from area array", () => {
    const result = parseAdzunaLocation(
      ["Australia", "New South Wales", "Sydney"],
      "Sydney"
    );
    assert.equal(result.city, "Sydney");
    assert.equal(result.state, "NSW");
    assert.equal(result.isRemote, false);
    assert.ok(result.displayName.includes("Sydney"));
  });

  it("parses Melbourne from area array", () => {
    const result = parseAdzunaLocation(
      ["Australia", "Victoria", "Melbourne"],
      "Melbourne"
    );
    assert.equal(result.city, "Melbourne");
    assert.equal(result.state, "VIC");
    assert.equal(result.isRemote, false);
  });

  it("parses Brisbane from area array", () => {
    const result = parseAdzunaLocation(
      ["Australia", "Queensland", "Brisbane"],
      "Brisbane"
    );
    assert.equal(result.state, "QLD");
    assert.equal(result.isRemote, false);
  });

  it("detects remote from display name", () => {
    const result = parseAdzunaLocation(
      ["Australia"],
      "Remote"
    );
    assert.equal(result.isRemote, true);
    assert.equal(result.displayName, "Remote (Australia)");
  });

  it("detects work from home as remote", () => {
    const result = parseAdzunaLocation(
      ["Australia"],
      "Work From Home"
    );
    assert.equal(result.isRemote, true);
  });

  it("handles state-only area", () => {
    const result = parseAdzunaLocation(
      ["Australia", "New South Wales"],
      "New South Wales"
    );
    assert.equal(result.state, "NSW");
    assert.equal(result.isRemote, false);
  });

  it("handles unknown city but known state", () => {
    const result = parseAdzunaLocation(
      ["Australia", "Victoria", "Ballarat"],
      "Ballarat"
    );
    assert.equal(result.state, "VIC");
    assert.equal(result.city, "Ballarat");
    assert.equal(result.isRemote, false);
  });

  it("falls back to display name matching for known cities", () => {
    const result = parseAdzunaLocation(
      [],
      "Newcastle area"
    );
    assert.equal(result.state, "NSW");
    assert.equal(result.isRemote, false);
  });

  it("resolves state from abbreviation in display name", () => {
    const result = parseAdzunaLocation(
      ["Australia"],
      "Somewhere in NSW"
    );
    assert.equal(result.state, "NSW");
  });

  it("resolves state from full name in display name", () => {
    const result = parseAdzunaLocation(
      ["Australia"],
      "Rural Western Australia"
    );
    assert.equal(result.state, "WA");
  });

  it("resolves city alias for Sunshine Coast", () => {
    const result = parseAdzunaLocation(
      [],
      "Sunshine Coast"
    );
    assert.equal(result.state, "QLD");
  });

  it("resolves city alias for Broome", () => {
    const result = parseAdzunaLocation(
      [],
      "Broome, WA"
    );
    assert.equal(result.state, "WA");
  });

  it("handles ACT correctly", () => {
    const result = parseAdzunaLocation(
      ["Australia", "Australian Capital Territory", "Canberra"],
      "Canberra"
    );
    assert.equal(result.state, "ACT");
    assert.equal(result.city, "Canberra");
  });

  it("handles empty area gracefully", () => {
    const result = parseAdzunaLocation([], "Unknown Location");
    assert.equal(result.isRemote, false);
  });
});
