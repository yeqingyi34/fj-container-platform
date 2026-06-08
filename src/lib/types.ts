export type BusinessType = 'rent' | 'sale' | 'both';

export interface City {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
}

export interface District {
  id: number;
  city_id: number;
  name: string;
  slug: string;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  city_id: number;
  district_id: number;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  wechat: string;
  description: string;
  logo_url: string;
  photos: string[];
  business_type: BusinessType;
  verified: boolean;
  is_premium: boolean;
  premium_expires: string | null;
  view_count: number;
  created_at: string;
  city?: City;
  district?: District;
  products?: Product[];
  reviews?: Review[];
}

export interface Product {
  id: number;
  company_id: number;
  name: string;
  type: string;
  size: string;
  material: string;
  price_type: 'daily' | 'monthly' | 'sale';
  price: number;
  unit: string;
  stock: number;
  photos: string[];
  description: string;
  is_available: boolean;
}

export interface Review {
  id: number;
  company_id: number;
  user_id: string;
  rating: number;
  content: string;
  created_at: string;
}

export interface Ad {
  id: number;
  company_id: number;
  position: 'home_top' | 'sidebar' | 'list_top';
  start_date: string;
  end_date: string;
  is_active: boolean;
  company?: Company;
}
