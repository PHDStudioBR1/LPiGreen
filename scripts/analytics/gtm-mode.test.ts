import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isGtmContainerConfigured } from "../../src/lib/analytics/gtm-mode";

describe("isGtmContainerConfigured", () => {
  it("returns true for a valid GTM public id", () => {
    assert.equal(isGtmContainerConfigured("GTM-K97WRGZK"), true);
  });

  it("returns false when unset, empty, or not a GTM id", () => {
    assert.equal(isGtmContainerConfigured(undefined), false);
    assert.equal(isGtmContainerConfigured(""), false);
    assert.equal(isGtmContainerConfigured("G-6S3NG2330K"), false);
    assert.equal(isGtmContainerConfigured("gtm-lowercase"), false);
  });
});
