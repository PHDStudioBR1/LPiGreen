import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CHANNEL_CRM_SOURCE,
  buildChannelEvent,
  crmSourcesForChannels,
  resolveChannelFromPath,
} from "../../src/lib/analytics/channels";

describe("channel taxonomy", () => {
  it("maps LP paths to channels", () => {
    assert.equal(resolveChannelFromPath("/"), "home");
    assert.equal(resolveChannelFromPath("/seguros"), "seguros");
    assert.equal(resolveChannelFromPath("/seguro-auto"), "seguro_auto");
    assert.equal(resolveChannelFromPath("/telecom"), "telecom");
    assert.equal(resolveChannelFromPath("/unknown"), null);
  });

  it("maps channels to CRM sources", () => {
    assert.equal(CHANNEL_CRM_SOURCE.bot, "whatsapp_evolution");
    assert.equal(CHANNEL_CRM_SOURCE.seguros, "site_seguros");
    assert.equal(CHANNEL_CRM_SOURCE.seguro_auto, "site_seguro_auto");
    assert.equal(CHANNEL_CRM_SOURCE.telecom, "site_telecom");
  });

  it("builds payload with crm_source", () => {
    const ev = buildChannelEvent("seguros", "seguros_form_submit", {
      step: "form_submit",
      page_path: "/seguros",
    });
    assert.equal(ev.channel, "seguros");
    assert.equal(ev.crm_source, "site_seguros");
    assert.equal(ev.event, "seguros_form_submit");
    assert.equal(ev.step, "form_submit");
  });

  it("lists CRM sources for selected channels", () => {
    const sources = crmSourcesForChannels(["bot", "seguros"]);
    assert.deepEqual(sources, ["whatsapp_evolution", "site_seguros"]);
  });
});
