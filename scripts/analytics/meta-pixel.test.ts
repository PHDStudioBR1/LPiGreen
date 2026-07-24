import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  META_PIXEL_IDS,
  resolveMetaPixelId,
} from "../../src/lib/analytics/meta-pixel";

describe("resolveMetaPixelId", () => {
  it("resolves hardcoded seguros and seguro-auto pixels", () => {
    assert.equal(resolveMetaPixelId("seguros"), "1051522610657600");
    assert.equal(resolveMetaPixelId("seguro-auto"), "2456316114837467");
  });

  it("includes telecom funnel key for env-based pixel", () => {
    assert.ok("telecom" in META_PIXEL_IDS);
    assert.equal(typeof META_PIXEL_IDS.telecom, "string");
  });

  it("returns null when telecom pixel env is empty", () => {
    // Without NEXT_PUBLIC_META_PIXEL_ID_TELECOM in test env, resolve is null.
    assert.equal(resolveMetaPixelId("telecom"), null);
  });
});
