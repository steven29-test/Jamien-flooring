export type FloorSubSubcategory = {
  id: string;
  name: string;
  description?: string;
};

export type FloorSubcategory = {
  id: string;
  name: string;
  description?: string;
  subsubcategories?: FloorSubSubcategory[];
};

export type FloorCategory = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  subcategories?: FloorSubcategory[];
};

export type FloorItem = {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  subsubcategoryId?: string;
  name: string;
  subtitle?: string;
  description?: string;
  priceHint?: string;
  specs?: string[];
  imageUrl?: string;
  images?: string[];
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
