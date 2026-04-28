export interface ProductData {
  id: string;
  category: string;
  title: string;
  brand?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  hoverImage?: string;
  purchases: number; // e.g., 1286
  tag?: "NEW" | "HOT" | "SALE";
  colors?: string[];
  description?: string;
}

export interface TabData {
  id: string;
  label: string;
  value: string;
}
