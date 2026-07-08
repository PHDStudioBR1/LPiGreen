import {
  getMetaPageContext,
  trackMetaCustom,
  trackMetaStandard,
  type MetaEventParams,
} from "@/lib/analytics/meta-pixel";

export type MetaFunnel = "seguros" | "seguro-auto";

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
  params?: MetaEventParams
) {
  const payload = withContext(funnel, {
    content_name: funnel === "seguro-auto" ? "Seguro Auto Quote" : "Seguros Quote",
    content_category: "insurance_quote",
    currency: "BRL",
    value: 1,
    ...params,
  });

  trackMetaStandard("Lead", payload);
  trackMetaFormSubmitted(funnel, params);
  trackMetaQuoteCompleted(funnel, params);
  // Success UI is in-modal (no /sucesso route) — treat as registration complete
  trackMetaStandard("CompleteRegistration", payload);
}
