export function isAdminEnabled(): boolean {
  return (import.meta.env.VITE_ADMIN_ENABLED ?? "false") === "true";
}

export function isAdminAuthorized(): boolean {
  if (!isAdminEnabled()) return false;

  const key = (import.meta.env.VITE_ADMIN_KEY ?? "").toString();
  if (!key || key === "change-me-to-a-long-random-string") return false;

  const params = new URLSearchParams(window.location.search);
  const provided = params.get("adminKey") || params.get("key") || "";
  return provided === key;
}
