export type CategoryLike = { name: string };

const ORDER_PATTERNS: Array<{ key: string; patterns: RegExp[] }> = [
  { key: "engineered", patterns: [/engineered/i] },
  { key: "hybrid", patterns: [/hybrid/i, /hybrid\s*vinyl/i] },
  { key: "laminate", patterns: [/laminate/i] },
  { key: "solid", patterns: [/solid/i, /hardwood/i] },
  { key: "herringbone", patterns: [/herringbone/i, /chevron/i] },
  { key: "vinyl", patterns: [/\bvinyl\b/i, /lvp/i] },
];

const KEY_RANK: Record<string, number> = {
  engineered: 0,
  hybrid: 1,
  laminate: 2,
  solid: 3,
  herringbone: 4,
  vinyl: 5,
};

function classify(name: string): string | null {
  for (const g of ORDER_PATTERNS) {
    if (g.patterns.some((p) => p.test(name))) return g.key;
  }
  return null;
}

export function sortCategories<T extends CategoryLike>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ka = classify(a.name) ?? "zz";
    const kb = classify(b.name) ?? "zz";
    const ra = KEY_RANK[ka] ?? 999;
    const rb = KEY_RANK[kb] ?? 999;
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  });
}
