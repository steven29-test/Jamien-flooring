import type { CatalogData } from "../types/catalog";

const KEY = "jamien-flooring.catalog.override.v1";

export function loadCatalogOverride(): CatalogData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CatalogData;
  } catch {
    return null;
  }
}

export function saveCatalogOverride(data: CatalogData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearCatalogOverride() {
  localStorage.removeItem(KEY);
}
