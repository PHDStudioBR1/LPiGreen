import type { LucideIcon } from "lucide-react";

export type SegurosBenefit = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type SegurosStep = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type SegurosPlanFeature = {
  icon: LucideIcon;
  label: string;
  description: string;
};

export type SegurosPlan = {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  description: string;
  features: SegurosPlanFeature[];
  highlighted?: boolean;
  badge?: string;
};

export type SegurosTestimonial = {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  image: string;
};

export type SegurosFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type SegurosAssistanceItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type SegurosComparisonRow = {
  characteristic: string;
  igreen: string;
  traditional: string;
};
