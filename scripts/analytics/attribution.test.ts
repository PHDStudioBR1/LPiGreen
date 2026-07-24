import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ATTRIBUTION_CUSTOM_KEYS,
  attributionToCustomValues,
  mergeAttribution,
  parseAttributionFromSearch,
  sanitizeAttribution,
} from "../../src/lib/attribution/utm";

describe("attribution / UTM", () => {
  it("parses utm and click ids from search string", () => {
    const parsed = parseAttributionFromSearch(
      "?utm_source=facebook&utm_medium=paid&utm_campaign=igreen-jul&utm_content=video-01&utm_term=seguro&fbclid=Fb.123&gclid=Aw.456&ignored=x"
    );
    assert.deepEqual(parsed, {
      utm_source: "facebook",
      utm_medium: "paid",
      utm_campaign: "igreen-jul",
      utm_content: "video-01",
      utm_term: "seguro",
      fbclid: "Fb.123",
      gclid: "Aw.456",
    });
  });

  it("accepts URLSearchParams and drops empty values", () => {
    const params = new URLSearchParams({
      utm_source: "meta",
      utm_medium: "",
      fbclid: "  abc  ",
    });
    assert.deepEqual(parseAttributionFromSearch(params), {
      utm_source: "meta",
      fbclid: "abc",
    });
  });

  it("merges first-touch wins for existing keys, fills missing", () => {
    const first = sanitizeAttribution({
      utm_source: "facebook",
      utm_campaign: "a",
    });
    const next = sanitizeAttribution({
      utm_source: "google",
      utm_medium: "cpc",
      gclid: "g1",
    });
    assert.deepEqual(mergeAttribution(first, next), {
      utm_source: "facebook",
      utm_campaign: "a",
      utm_medium: "cpc",
      gclid: "g1",
    });
  });

  it("maps attribution to CRM custom_values keys", () => {
    const custom = attributionToCustomValues({
      utm_source: "facebook",
      fbclid: "Fb.9",
    });
    assert.equal(custom.utm_source, "facebook");
    assert.equal(custom.fbclid, "Fb.9");
    for (const key of Object.keys(custom)) {
      assert.ok(ATTRIBUTION_CUSTOM_KEYS.includes(key as (typeof ATTRIBUTION_CUSTOM_KEYS)[number]));
    }
  });
});
