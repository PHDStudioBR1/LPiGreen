import {
  buildChannelEvent,
  type ChannelEventPayload,
  type MarketingChannel,
} from "@/lib/analytics/channels";

type Extra = Record<string, string | number | boolean | undefined>;

export type FormSubmitEventsInput = {
  channel: MarketingChannel;
  formEvent: string;
  leadSource: string;
  pagePath: string;
  leadId?: string | number;
  extra?: Extra;
};

/**
 * Payload canônico: form_submit + generate_lead (com lead_id quando o CRM já respondeu).
 */
export function buildFormSubmitEvents(
  input: FormSubmitEventsInput
): ChannelEventPayload[] {
  const base = {
    page_path: input.pagePath,
    ...input.extra,
  };

  const formSubmit = buildChannelEvent(input.channel, input.formEvent, {
    ...base,
    step: "form_submit",
    ...(input.leadId !== undefined ? { lead_id: input.leadId } : {}),
  });

  const generateLead = buildChannelEvent(input.channel, "generate_lead", {
    ...base,
    step: "lead_created",
    lead_source: input.leadSource,
    currency: "BRL",
    value: 1,
    ...(input.leadId !== undefined ? { lead_id: input.leadId } : {}),
  });

  return [formSubmit, generateLead];
}
