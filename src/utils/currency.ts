export const parseCurrency = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;

  // Remove currency symbols and spaces, normalize decimal separators
  const cleaned = value
    .replace(/[€$£]/g, "")
    .replace(/\s/g, "")
    // If comma is decimal sep in some locales, keep 1st comma as decimal and remove others would be complex.
    // Generic parser: prefer dot as decimal, convert single comma-only numbers to decimal.
    .replace(/,(?=\d{1,2}$)/, ".")
    .replace(/,/g, "");

  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
};

export const usdToEur = (usd: number): number => usd * 0.91;

export const formatEuro = (amount: number): string => {
  // Format with French locale then place symbol after without space
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted}€`;
};

export const toEuroStringFromUsdLike = (value: string | number | null | undefined): string => {
  const num = parseUsdCurrency(value);
  if (num === null) return "N/A";
  return formatEuro(usdToEur(num));
};

export const toEuroString = (value: string | number | null | undefined): string => {
  const num = parseCurrency(value);
  if (num === null) return "N/A";
  return formatEuro(num);
};

// Specialized USD-like parser where comma is thousands separator (e.g., "$1,068/month")
export const parseUsdCurrency = (
  value: string | number | null | undefined
): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;

  const cleaned = value
    .replace(/[€$£]/g, "")
    .replace(/\s/g, "")
    // remove thousand separators
    .replace(/,/g, "")
    // strip trailing words like /month
    .replace(/[^0-9.\-]/g, (m) => (m === "." ? "." : ""));

  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
};


