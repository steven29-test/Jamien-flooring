export type FloorCategory = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
};

export type FloorItem = {
  id: string;
  categoryId: string;
  name: string;
  subtitle?: string;
  description?: string;
  priceHint?: string;
  specs?: string[];
  // Primary image (kept for backward compatibility)
  imageUrl?: string;
  // Gallery images (preferred). First image is used as card thumbnail.
  images?: string[];
  // Optional merchandising fields
  brand?: string;
  isDeal?: boolean;
  featured?: boolean;
};


export type Review = {
  id: string;
  name: string;
  suburb: string;
  rating: number;
  text: string;
  type: "premium" | "value";
  images?: string[];
};

export type CatalogData = {
  businessName: string;
  serviceArea: string;
  logoUrl?: string;
  hero: {
    headline: string;
    subheadline: string;
    heroImageUrl?: string;
  };
  about?: {
    title: string;
    bullets: string[];
    note?: string;
  };
  contact: {
    phone?: string;
    email?: string;
    address?: string;
    hours?: string;
  };
  categories: FloorCategory[];
  items: FloorItem[];
  reviews?: Review[];
};
