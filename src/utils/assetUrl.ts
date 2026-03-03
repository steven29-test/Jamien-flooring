export function assetUrl(path: string): string {
  if (!path) return path;
  // Keep external URLs as-is
  if (/^https?:\/\//i.test(path)) return path;
  // Normalize leading slash
  const p = path.startsWith("/") ? path.slice(1) : path;
  // import.meta.env.BASE_URL already includes trailing slash
  return `${import.meta.env.BASE_URL}${p}`;
}
