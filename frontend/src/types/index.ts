export interface BrandSummary {
  name: string;
  slug: string;
  product_count: number;
  review_count: number;
  avg_price: number;
  avg_discount: number;
  avg_rating: number;
  sentiment_score: number;
  sentiment_label: string;
  top_pros: string[];
  top_cons: string[];
  price_band: string;
  aspect_scores: Record<string, number>;
}

export interface OverviewData {
  total_brands: number;
  total_products: number;
  total_reviews: number;
  avg_sentiment: number;
  avg_price: number;
  avg_discount: number;
  price_range: { min: number; max: number };
  brand_summaries: BrandSummary[];
}

export interface Product {
  asin: string;
  title: string;
  brand: string;
  price: number;
  list_price: number;
  discount_pct: number;
  rating: number;
  review_count: number;
  sentiment_score: number;
  review_synthesis: string;
  complaint_themes: string[];
  appreciation_themes: string[];
  trust_score: number;
  aspects: Record<string, number>;
  category: string;
  size: string;
}

export interface ProductsResponse {
  total: number;
  page: number;
  limit: number;
  products: Product[];
}

export interface Review {
  id: string;
  product_asin: string;
  brand: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful_votes: number;
  sentiment_score: number;
  sentiment_label: string;
  aspects_mentioned: string[];
}

export interface InsightItem {
  title: string;
  description: string;
  supporting_data: string[];
  affected_brands: string[];
  insight_type: string;
}

export interface AnomalyItem {
  type: string;
  severity: string;
  brand: string;
  product_title: string;
  description: string;
}

export interface AspectData {
  brand: string;
  wheels: number;
  handle: number;
  material: number;
  zipper: number;
  size_space: number;
  durability: number;
}

export interface ValueForMoney {
  brand: string;
  price_band: string;
  avg_price: number;
  sentiment_score: number;
  value_score: number;
}

export interface TrustSignal {
  asin: string;
  brand: string;
  product_title: string;
  trust_score: number;
  verified_ratio: number;
  five_star_ratio: number;
  avg_review_length: number;
  total_reviews: number;
  flags: string[];
}

export interface FilterOptions {
  brands: string[];
  price_range: { min: number; max: number };
  rating_range: { min: number; max: number };
  categories: string[];
  sizes: string[];
  sentiment_range: { min: number; max: number };
}
