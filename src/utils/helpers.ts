export function formatBytes(bytes: number, fullName?: boolean): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const sizeFullNames = ["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "Terabytes", "Petabytes"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${fullName ? sizeFullNames[i] : sizes[i]}`;
};

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);
}

// adds zerowidth breaking spaces after underscores so text can split onto the next line at them
export function addSpacesToUnderscores(text: string): string {
  return text.replace(/_/g, '_\u200B');
};

export function numberWithCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function thatsOverText(decimalHours: number): string {
  const hoursInYear = 24 * 365;
  const hoursInDay = 24;

  let remaining = decimalHours;

  const years = Math.floor(remaining / hoursInYear);
  remaining %= hoursInYear;

  const days = Math.floor(remaining / hoursInDay);
  remaining %= hoursInDay;

  return `${years > 0 ? numberWithCommas(years) : days > 0 ? days : 0} ${years > 0 ? "year" + (years >= 2 ? "s" : 0) : days > 0 ? "day"  + (days >= 2 ? "s" : 0) : 0}`;
}

export function generateHash(string: string) {
  let hash = 0;
  for (const char of string) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0; // Constrain to 32bit integer
  }
  return hash;
}

export const BACKUP_DIRECTORY = './public/fallbacks'; // filesystem path for script
export const BACKUP_URL_PATH = '/fallbacks'; // HTTP path for runtime

export function getBackupPath(fetcher: Function, args: any[]): string {
  const hash = generateHash(`${fetcher.name}:${JSON.stringify(args)}`);
  return `${hash}.json`;
}

export const US_STATES: string[] = [
  "AL", // Alabama
  "AK", // Alaska
  "AZ", // Arizona
  "AR", // Arkansas
  "CA", // California
  "CO", // Colorado
  "CT", // Connecticut
  "DE", // Delaware
  "FL", // Florida
  "GA", // Georgia
  "HI", // Hawaii
  "ID", // Idaho
  "IL", // Illinois
  "IN", // Indiana
  "IA", // Iowa
  "KS", // Kansas
  "KY", // Kentucky
  "LA", // Louisiana
  "ME", // Maine
  "MD", // Maryland
  "MA", // Massachusetts
  "MI", // Michigan
  "MN", // Minnesota
  "MS", // Mississippi
  "MO", // Missouri
  "MT", // Montana
  "NE", // Nebraska
  "NV", // Nevada
  "NH", // New Hampshire
  "NJ", // New Jersey
  "NM", // New Mexico
  "NY", // New York
  "NC", // North Carolina
  "ND", // North Dakota
  "OH", // Ohio
  "OK", // Oklahoma
  "OR", // Oregon
  "PA", // Pennsylvania
  "RI", // Rhode Island
  "SC", // South Carolina
  "SD", // South Dakota
  "TN", // Tennessee
  "TX", // Texas
  "UT", // Utah
  "VT", // Vermont
  "VA", // Virginia
  "WA", // Washington
  "WV", // West Virginia
  "WI", // Wisconsin
  "WY", // Wyoming
]