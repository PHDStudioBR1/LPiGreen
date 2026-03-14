/**
 * Valida se a data de nascimento (dd/mm/aaaa) corresponde a uma pessoa com pelo menos 18 anos.
 * @param brDate - Data no formato dd/mm/aaaa
 * @returns true se válido e >= 18 anos; mensagem de erro caso contrário
 */
export function validateBirthDateMinAge(
  brDate: string,
  minAge: number = 18
): true | string {
  if (!brDate || typeof brDate !== "string") {
    return "Data de nascimento é obrigatória";
  }
  const match = brDate.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return "Data inválida. Use o formato dd/mm/aaaa";
  }
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const year = parseInt(match[3], 10);
  const birth = new Date(year, month, day);
  if (
    birth.getFullYear() !== year ||
    birth.getMonth() !== month ||
    birth.getDate() !== day
  ) {
    return "Data inválida";
  }
  const today = new Date();
  if (birth > today) {
    return "Data de nascimento não pode ser no futuro";
  }
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  if (age < minAge) {
    return `É necessário ter pelo menos ${minAge} anos`;
  }
  return true;
}
