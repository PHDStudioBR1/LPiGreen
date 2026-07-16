import {
  assignLeadResponsavel,
  findCrmUserIdByRepresentative,
  type CrmConfig,
} from "@/lib/crm/phd-crm-client";
import {
  assignRepresentativeToLead,
  type RandomServiceRepresentative,
  type RandomServiceSegment,
} from "@/lib/random-service/client";
import {
  notifyRepresentativeOfNewLead,
  type NotificationSegment,
} from "@/lib/email/representative-lead-notification";

export type AssignCrmLeadRepresentativeResult = {
  representative: RandomServiceRepresentative;
  responsavelId: number | null;
  rotationApproved: boolean;
};

export async function assignCrmLeadRepresentative(params: {
  config: CrmConfig;
  leadId: number;
  segmento: RandomServiceSegment;
  leadName: string;
  leadPhone: string;
  logPrefix: string;
  notify?: {
    segmento: NotificationSegment;
    formValues?: Record<string, unknown>;
  };
}): Promise<AssignCrmLeadRepresentativeResult> {
  const assignment = await assignRepresentativeToLead({
    segmento: params.segmento,
    leadName: params.leadName,
    leadPhone: params.leadPhone,
    assignResponsavel: async (representative) => {
      const userId = await findCrmUserIdByRepresentative(
        params.config,
        representative,
        params.logPrefix
      );
      if (userId != null) {
        await assignLeadResponsavel(params.config, params.leadId, userId);
      }
      return userId;
    },
  });

  if (params.notify) {
    if (!assignment.representative.email) {
      console.warn(
        `${params.logPrefix} rep email: representante sem e-mail (${assignment.representative.name})`
      );
    } else {
      try {
        await notifyRepresentativeOfNewLead({
          segmento: params.notify.segmento,
          representative: assignment.representative,
          leadId: params.leadId,
          crmEnv: params.config.env,
          formValues: params.notify.formValues,
        });
      } catch (err) {
        console.error(
          `${params.logPrefix} rep email:`,
          err instanceof Error ? err.message : err
        );
      }
    }
  }

  return {
    representative: assignment.representative,
    responsavelId: assignment.responsavelId,
    rotationApproved: assignment.rotationApproved,
  };
}
