export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);
}

// adds zerowidth breaking spaces after underscores so text can split onto the next line at them
export function addSpacesToUnderscores(text: string): string {
  return text.replace(/_/g, '_\u200B');
};