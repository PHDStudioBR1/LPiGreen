import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildHomeWhatsAppClickEvents } from "../../src/lib/home/analytics";

describe("home WhatsApp analytics", () => {
  it("emits home_whatsapp_click then generate_lead for Meta Contact + GA4", () => {
    const events = buildHomeWhatsAppClickEvents("float");

    assert.deepEqual(
      events.map((e) => e.event),
      ["home_whatsapp_click", "generate_lead"]
    );
    assert.equal(events[0]?.step, "whatsapp_click");
    assert.equal(events[0]?.cta_type, "whatsapp_float");
    assert.equal(events[1]?.step, "lead_created");
    assert.equal(events[1]?.lead_source, "home_whatsapp");
    assert.equal(events[1]?.value, 1);
  });
});
