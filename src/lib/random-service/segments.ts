import type { RandomServiceSegment } from "@/lib/random-service/client";

export const PAGE_SEGMENT_MAP = {
  captacao: "bot",
  conexao_green: "bot",
  lic: "bot",
  home: "bot",
  seguros: "seguros",
  seguro_auto: "seguros",
  telecom: "telecom",
} as const satisfies Record<string, RandomServiceSegment>;

export type PageFunnel = keyof typeof PAGE_SEGMENT_MAP;
