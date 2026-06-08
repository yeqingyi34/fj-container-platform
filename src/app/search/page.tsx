'use client';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, CheckCircle, SearchIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

const typeLabels: Record<string, string> = { rent: '出租', sale: '出售', both: '出租+出售' };
const typeColors: Record<string, string> = { rent: 'bg-blue-50 text-blue-600', sale: 'bg-green-50 text-green-600', both: 'bg-purple-50 text-purple-600' };
const citySlugToName: Record<string, string> = {
  fuzhou:'福州市',xiamen:'厦门市',quanzhou:'泉州市',zhangzhou:'漳州市',
  putian:'莆田市',longyan:'龙岩市',sanming:'三明市',nanping:'南平市',ningde:'宁德市'
};

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<any[]>([]);
  const [citiesLoaded, setCitiesLoaded] = useState(false);

  useEffect(() => {
    supabase.from('cities').select('*').order('sort_order').then(({ data }) => {
      setCities(data || []);
      setCitiesLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!citiesLoaded) return;
    setLoading(true);
    let q = supabase.from('companies').select('*, city:cities(*), district:districts(*)');

    if (query) q = q.ilike('name', `%${query}%`);
    if (city) {
      const cityId = cities.find(c => c.slug === city)?.id;
      if (cityId) q = q.eq('city_id', cityId);
    }
    if (type !== 'all') q = q.or(`business_type.eq.${type},business_type.eq.both`);

    q = q.order('is_premium', { ascending: false }).limit(50);
    q.then(({ data }) => { setResults(data || []); setLoading(false); });
  }, [query, city, type, citiesLoaded]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🔍 搜索公司</h1>
      
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-3">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="公司名称..."
          className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg text-sm" />
        <select value={city} onChange={e => setCity(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm">
          <option value="">全部城市</option>
          {cities.map((c: any) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm">
          <option value="all">全部类型</option>
          <option value="rent">出租</option>
          <option value="sale">出售</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-12">加载中...</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">找到 {results.length} 家公司</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((c: any) => (
              <Link key={c.id} href={`/company/${c.slug}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md p-5 border">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {c.name}
                    {c.verified && <CheckCircle className="w-3 h-3 inline ml-1 text-blue-500" />}
                    {c.is_premium && <span className="ml-1 text-orange-500 text-xs bg-orange-50 px-1.5 py-0.5 rounded">推荐</span>}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${typeColors[c.business_type] || 'bg-gray-50'}`}>
                    {typeLabels[c.business_type] || c.business_type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1"><MapPin className="w-3 h-3 inline" /> {c.city?.name}{c.district?.name}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{c.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400"><Phone className="w-3 h-3 inline" /> {c.phone}</span>
                </div>
              </Link>
            ))}
          </div>
          {results.length === 0 && <p className="text-center text-gray-400 py-12">没有找到匹配的公司</p>}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return <Suspense><SearchContent /></Suspense>;
}
