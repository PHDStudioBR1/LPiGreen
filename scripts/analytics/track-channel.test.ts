import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

/**
 * Testa o espelho PostHog de trackChannelEvent via injeção
 * (sem carregar posthog-js no Node).
 */
describe("trackChannelEvent posthog mirror", () => {
  it("captures channel event on posthog when capture fn provided", async () => {
    const calls: Array<{ event: string; props: Record<string, unknown> }> = [];
    const capture = (event: string, props?: Record<string, string | number | boolean | undefined>) => {
      calls.push({ event, props: props ?? {} });
    };

    // Dynamic import after we stub module — use the pure helper instead
    const { buildChannelEvent } = await import("../../src/lib/analytics/channels");
    const { mirrorChannelEventToPostHog } = await import(
      "../../src/lib/analytics/posthog-mirror"
    );

    const payload = buildChannelEvent("seguros", "seguros_form_submit", {
      step: "form_submit",
      page_path: "/seguros",
    });
    mirrorChannelEventToPostHog(payload, capture);

    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.event, "seguros_form_submit");
    assert.equal(calls[0]?.props.channel, "seguros");
    assert.equal(calls[0]?.props.crm_source, "site_seguros");
    assert.equal(calls[0]?.props.step, "form_submit");
  });

  it("no-ops when capture is missing", async () => {
    const { buildChannelEvent } = await import("../../src/lib/analytics/channels");
    const { mirrorChannelEventToPostHog } = await import(
      "../../src/lib/analytics/posthog-mirror"
    );
    const payload = buildChannelEvent("telecom", "telecom_cta_click", {
      step: "cta_click",
    });
    assert.doesNotThrow(() => mirrorChannelEventToPostHog(payload, undefined));
  });
});
