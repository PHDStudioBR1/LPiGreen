import {
  getMetaPageContext,
  trackMetaCustom,
  trackMetaStandard,
  type MetaEventParams,
} from "@/lib/analytics/meta-pixel";
import { isGtmContainerConfigured } from "@/lib/analytics/gtm-mode";

export type MetaFunnel = "seguros" | "seguro-auto" | "telecom";

function withContext(funnel: MetaFunnel, params?: MetaEventParams) {
  return { funnel, ...getMetaPageContext(), ...params };
}

export function trackMetaQuoteStarted(funnel: MetaFunnel) {
  trackMetaCustom("QuoteStarted", withContext(funnel));
}

export function trackMetaFormStarted(funnel: MetaFunnel, field?: string) {
  trackMetaCustom("FormStarted", withContext(funnel, { first_field: field || "" }), {
    onceKey: `FormStarted:${funnel}:${getMetaPageContext().page_path}`,
  });
}

export function trackMetaFormProgress(
  funnel: MetaFunnel,
  step: number,
  label?: string
) {
  trackMetaCustom(
    "FormProgress",
    withContext(funnel, { step, step_label: label || `step_${step}` })
  );
}

export function trackMetaFieldCompleted(
  funnel: MetaFunnel,
  field: string,
  fieldType?: string
) {
  trackMetaCustom(
    "FieldCompleted",
    withContext(funnel, { field, field_type: fieldType || "input" }),
    { onceKey: `FieldCompleted:${funnel}:${field}` }
  );
}

export function trackMetaFormError(
  funnel: MetaFunnel,
  params: { step: number; fields: string; message?: string }
) {
  trackMetaCustom(
    "FormError",
    withContext(funnel, {
      step: params.step,
      error_fields: params.fields,
      error_message: (params.message || "").slice(0, 160),
    })
  );
}

export function trackMetaFormAbandoned(
  funnel: MetaFunnel,
  params: { step: number; filled_fields: number }
) {
  trackMetaCustom(
    "FormAbandoned",
    withContext(funnel, {
      step: params.step,
      filled_fields: params.filled_fields,
    })
  );
}

export function trackMetaFormSubmitted(
  funnel: MetaFunnel,
  params?: MetaEventParams
) {
  trackMetaCustom("FormSubmitted", withContext(funnel, params));
}

export function trackMetaQuoteCompleted(
  funnel: MetaFunnel,
  params?: MetaEventParams
) {
  trackMetaCustom("QuoteCompleted", withContext(funnel, params));
}

/** Standard conversions after successful quote submit */
export function trackMetaLeadConversion(
  funnel: MetaFunnel,
  params?: MetaEventParams & { event_id?: string }
) {
  const contentByFunnel: Record<MetaFunnel, { name: string; category: string }> = {
    seguros: { name: "Seguros Quote", category: "insurance_quote" },
    "seguro-auto": { name: "Seguro Auto Quote", category: "insurance_quote" },
    telecom: { name: "Telecom Quote", category: "telecom_quote" },
  };
  const content = contentByFunnel[funnel];
  const eventID =
    typeof params?.event_id === "string" && params.event_id
      ? params.event_id
      : undefined;

  const { event_id: _eventId, ...rest } = params || {};
  const payload = withContext(funnel, {
    content_name: content.name,
    content_category: content.category,
    currency: "BRL",
    value: 1,
    ...rest,
  });

  // Com GTM ativo, Lead/CompleteRegistration vêm das tags do container (evita triplicar).
  // Sem GTM, dispara Pixel com eventID para dedupe com CAPI server-side.
  if (!isGtmContainerConfigured()) {
    trackMetaStandard("Lead", payload, { eventID });
    trackMetaStandard("CompleteRegistration", payload, {
      eventID: eventID ? eventID.replace(/-Lead$/, "-CompleteRegistration") : undefined,
    });
  }

  trackMetaFormSubmitted(funnel, rest);
  trackMetaQuoteCompleted(funnel, rest);
}
