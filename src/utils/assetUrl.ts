/**
 * Build-safe asset URLs for both local dev (/) and GitHub Pages (/<repo>/).
 * Use with files placed under /public (e.g. public/images/...).
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base : base + "/";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return cleanBase + cleanPath;
}
