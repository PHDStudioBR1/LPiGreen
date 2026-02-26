export function maskCep(value: string): string {
  const v = value.replace(/\D/g, '').slice(0, 8);
  return v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
}

export function maskPhone(value: string): string {
  const v = value.replace(/\D/g, '').slice(0, 11);
  if (v.length <= 2) return v ? `(${v}` : '';
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}${v.length > 6 ? '-' + v.slice(6, 11) : ''}`;
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
