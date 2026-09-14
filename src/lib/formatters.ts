/**
 * Localized Indonesian Number and Currency Formatters
 */

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const strictTwoDecimalFormatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  return idrFormatter.format(Math.round(amount));
}

export function formatNumber(value: number, strictTwoDecimals: boolean = false): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0';
  }
  return strictTwoDecimals 
    ? strictTwoDecimalFormatter.format(value)
    : decimalFormatter.format(value);
}

/**
 * Parses user input string (handling comma/dots for Indonesian localized typing) into float/int
 */
export function parseLocalizedNumber(input: string): number {
  if (!input) return 0;
  // Strip currency prefixes and whitespace
  let clean = input.replace(/Rp\s?|[^\d.,-]/gi, '').trim();
  
  // If string has both '.' and ',', determine thousands vs decimal separator
  if (clean.includes('.') && clean.includes(',')) {
    clean = clean.replace(/\./g, '').replace(',', '.');
  } else if (clean.includes(',')) {
    clean = clean.replace(',', '.');
  }
  
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatTripDate(timestamp: number | string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
