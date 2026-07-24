import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildFormSubmitEvents,
} from "../../src/lib/analytics/lead-conversion";

describe("buildFormSubmitEvents", () => {
  it("includes lead_id on generate_lead when provided", () => {
    const events = buildFormSubmitEvents({
      channel: "telecom",
      formEvent: "telecom_form_submit",
      leadSource: "telecom_form",
      pagePath: "/telecom",
      leadId: 42,
      extra: { plan_type: "controle", portability: "yes" },
    });

    assert.equal(events[0]?.event, "telecom_form_submit");
    assert.equal(events[0]?.step, "form_submit");
    assert.equal(events[0]?.lead_id, 42);
    assert.equal(events[1]?.event, "generate_lead");
    assert.equal(events[1]?.lead_id, 42);
    assert.equal(events[1]?.lead_source, "telecom_form");
    assert.equal(events[1]?.value, 1);
  });

  it("omits lead_id when not provided", () => {
    const events = buildFormSubmitEvents({
      channel: "home",
      formEvent: "home_form_submit",
      leadSource: "home_form",
      pagePath: "/",
      extra: { valor_medio_fatura: 250 },
    });

    assert.equal(events[1]?.lead_id, undefined);
    assert.equal(events[1]?.valor_medio_fatura, 250);
  });
});
