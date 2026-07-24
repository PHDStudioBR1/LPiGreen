import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const recipePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "gtm-container-recipe.json"
);

describe("gtm-container-recipe", () => {
  it("quotes Meta Custom HTML DLV placeholders and wires generate_lead", () => {
    const recipe = JSON.parse(readFileSync(recipePath, "utf8")) as {
      tags: Array<{
        name: string;
        event?: string;
        trigger?: string;
        html?: string;
        params?: Record<string, string>;
      }>;
      triggers: Array<{ name: string; event_name: string }>;
    };

    const lead = recipe.tags.find((t) => t.name.includes("Lead"));
    const contact = recipe.tags.find((t) => t.name.includes("Contact") || t.name.includes("whatsapp"));
    const generateLeadTag = recipe.tags.find(
      (t) => t.trigger === "CE - generate_lead" || t.name.includes("generate_lead")
    );

    assert.ok(lead, "Meta Lead tag required");
    assert.ok(contact, "Meta Contact tag required");
    assert.ok(generateLeadTag, "Meta/GA tag for generate_lead required");

    const htmlBlobs = [lead.html, contact.html, generateLeadTag.html]
      .filter(Boolean)
      .join("\n");

    if (htmlBlobs) {
      assert.match(htmlBlobs, /content_name:\s*'\{\{dlv - channel\}\}'/);
      assert.match(htmlBlobs, /content_category:\s*'\{\{dlv - crm_source\}\}'/);
    } else {
      // Template-style recipe params must still quote DLVs for Custom HTML guidance
      const paramValues = [lead, contact, generateLeadTag]
        .flatMap((t) => Object.values(t?.params ?? {}))
        .join(" ");
      assert.match(paramValues, /'\{\{dlv - channel\}\}'/);
    }

    const generateTrigger = recipe.triggers.find((t) => t.name === "CE - generate_lead");
    assert.ok(generateTrigger);
    assert.equal(generateTrigger?.event_name, "generate_lead");
  });
});
