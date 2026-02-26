export function maskCep(value: string): string {
  const v = value.replace(/\D/g, '').slice(0, 8);
  return v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (!digits) return '';

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    // Até aqui só DDD + início do número, sem traço
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    // Formato fixo: (11) 2345-6789
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  // Celular com 9 dígitos: (11) 91234-5678
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskCpfCnpj(value: string): string {
  const v = value.replace(/\D/g, '');
  if (v.length <= 11) {
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) =>
      [a, b, c].filter(Boolean).join('.') + (d ? '-' + d : '')
    );
  }
  return v.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
    (_, a, b, c, d, e) => `${a}.${b}.${c}/${d}` + (e ? '-' + e : '')
  );
}

export function maskCurrency(value: string): string {
  const v = value.replace(/\D/g, '');
  if (!v) return '';
  const n = parseInt(v, 10) / 100;
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function unmaskCurrency(value: string): number {
  return parseFloat(value.replace(/\D/g, '').replace(/,/, '.') || '0') / 100 || 0;
}

export function maskBirthDate(value: string): string {
  const v = value.replace(/\D/g, '').slice(0, 8);
  if (v.length <= 2) return v;
  if (v.length <= 4) return `${v.slice(0, 2)}/${v.slice(2)}`;
  return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
}
