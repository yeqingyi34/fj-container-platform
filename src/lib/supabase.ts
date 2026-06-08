import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ozweqrecqfcwxynhuobd.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZN3Gqf_7YXg9_64IoD8Pfg_w0QRtN3d';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side queries
export async function getCities() {
  const { data } = await supabase.from('cities').select('*').order('sort_order');
  return data || [];
}

export async function getCompanies(filters?: {
  city_id?: number;
  district_id?: number;
  business_type?: string;
  search?: string;
  limit?: number;
  premium?: boolean;
}) {
  let query = supabase.from('companies').select('*, city:cities(*), district:districts(*)');
  
  if (filters?.city_id) query = query.eq('city_id', filters.city_id);
  if (filters?.district_id) query = query.eq('district_id', filters.district_id);
  if (filters?.business_type && filters.business_type !== 'all')
    query = query.or(`business_type.eq.${filters.business_type},business_type.eq.both`);
  if (filters?.search) query = query.ilike('name', `%${filters.search}%`);
  if (filters?.premium) query = query.eq('is_premium', true);
  
  query = query.order('is_premium', { ascending: false })
    .order('view_count', { ascending: false })
    .limit(filters?.limit || 20);
  
  const { data } = await query;
  return data || [];
}

export async function getCompanyBySlug(slug: string) {
  const { data } = await supabase
    .from('companies')
    .select('*, city:cities(*), district:districts(*), products(*)')
    .eq('slug', slug)
    .single();
  
  if (data) {
    await supabase.rpc('increment_view', { company_id: data.id });
  }
  return data;
}

export async function getDistricts(cityId: number) {
  const { data } = await supabase.from('districts').select('*').eq('city_id', cityId);
  return data || [];
}
