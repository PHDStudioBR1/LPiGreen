import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { describe, it } from "node:test";
import {
  buildMetaCapiLeadEvent,
  hashForCapi,
  normalizeEmailForCapi,
  normalizePhoneForCapi,
  resolveMetaCapiConfig,
  sendMetaCapiLead,
} from "../../src/lib/analytics/meta-capi";

describe("meta-capi hashing", () => {
  it("normalizes email to lowercase trimmed", () => {
    assert.equal(normalizeEmailForCapi("  Foo.Bar@Example.COM "), "foo.bar@example.com");
  });

  it("normalizes BR phone to digits with country code 55", () => {
    assert.equal(normalizePhoneForCapi("(11) 98888-7777"), "5511988887777");
    assert.equal(normalizePhoneForCapi("5511988887777"), "5511988887777");
  });

  it("hashes with sha256 hex", () => {
    const email = "lead@igreen.com";
    assert.equal(
      hashForCapi(email),
      createHash("sha256").update(email, "utf8").digest("hex")
    );
  });
});

describe("buildMetaCapiLeadEvent", () => {
  it("builds Lead with hashed user_data and stable event_id", () => {
    const event = buildMetaCapiLeadEvent({
      eventName: "Lead",
      leadId: 42,
      email: "Lead@Igreen.COM",
      phone: "11988887777",
      eventSourceUrl: "https://lpigreen.546digitalservices.com/seguros",
      funnel: "seguros",
      clientIp: "1.2.3.4",
      clientUserAgent: "Mozilla/5.0",
      eventTime: 1_700_000_000,
    });

    assert.equal(event.event_name, "Lead");
    assert.equal(event.event_id, "igreen-lead-42-Lead");
    assert.equal(event.action_source, "website");
    assert.equal(event.event_source_url, "https://lpigreen.546digitalservices.com/seguros");
    assert.equal(event.user_data.em?.[0], hashForCapi("lead@igreen.com"));
    assert.equal(event.user_data.ph?.[0], hashForCapi("5511988887777"));
    assert.equal(event.user_data.client_ip_address, "1.2.3.4");
    assert.equal(event.custom_data?.lead_id, "42");
    assert.equal(event.custom_data?.funnel, "seguros");
  });
});

describe("resolveMetaCapiConfig", () => {
  it("resolves seguros pixel and requires access token", () => {
    const cfg = resolveMetaCapiConfig("seguros", {
      META_CAPI_ACCESS_TOKEN: "token-abc",
    });
    assert.equal(cfg?.pixelId, "1051522610657600");
    assert.equal(cfg?.accessToken, "token-abc");
  });

  it("returns null when token missing", () => {
    assert.equal(resolveMetaCapiConfig("seguros", {}), null);
  });

  it("returns null for home when pixel env empty", () => {
    assert.equal(
      resolveMetaCapiConfig("home", { META_CAPI_ACCESS_TOKEN: "t" }),
      null
    );
  });
});

describe("sendMetaCapiLead", () => {
  it("skips when config missing", async () => {
    const result = await sendMetaCapiLead({
      funnel: "seguros",
      leadId: 1,
      email: "a@b.com",
      phone: "11999999999",
      env: {},
    });
    assert.equal(result.ok, true);
    assert.equal(result.skipped, true);
  });

  it("posts to Graph API with access_token query", async () => {
    const calls: Array<{ url: string; body: unknown }> = [];
    const result = await sendMetaCapiLead({
      funnel: "seguro-auto",
      leadId: 99,
      email: "auto@igreen.com",
      phone: "21977776666",
      eventSourceUrl: "https://example.com/seguro-auto",
      env: { META_CAPI_ACCESS_TOKEN: "secret" },
      fetchImpl: async (url, init) => {
        calls.push({ url: String(url), body: JSON.parse(String(init?.body)) });
        return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
      },
    });

    assert.equal(result.ok, true);
    assert.equal(result.skipped, false);
    assert.equal(result.eventId, "igreen-lead-99-Lead");
    assert.equal(calls.length, 1);
    assert.match(calls[0]!.url, /graph\.facebook\.com\/v21\.0\/2456316114837467\/events/);
    assert.match(calls[0]!.url, /access_token=secret/);
    const body = calls[0]!.body as { data: Array<{ event_name: string; event_id: string }> };
    assert.equal(body.data[0]?.event_name, "Lead");
    assert.equal(body.data[0]?.event_id, "igreen-lead-99-Lead");
  });
});
