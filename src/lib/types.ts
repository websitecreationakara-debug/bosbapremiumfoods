export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  category_id: string | null;
  stock: number;
  status: string;
  image_url: string | null;
  badge: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  created_at: string;
};

export type Media = {
  id: string;
  key: string;
  url: string;
  filename: string;
  content_type: string | null;
  size: number;
  created_at: string;
};

export type CartItem = {
  product: Product;
  qty: number;
};

export type StoreSettings = {
  id: string;
  banner_text: string | null;
  global_discount_pct: number | null;
  free_shipping_threshold: number | null;
  updated_at: string;
};
