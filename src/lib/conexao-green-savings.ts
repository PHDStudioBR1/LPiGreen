/** Poupança anual ilustrativa: 12 × fatura mensal × 15% */
export function projectedAnnualSavingsFromMonthly(monthly: number): number {
  return monthly * 12 * 0.15;
}

export function monthlyDiscountFromBill(monthly: number): number {
  return monthly * 0.15;
}
