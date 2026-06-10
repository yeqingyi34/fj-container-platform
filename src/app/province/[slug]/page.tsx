'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Phone, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const typeLabels: Record<string, string> = { rent: '出租', sale: '出售', both: '出租+出售' };

export default function ProvincePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [province, setProvince] = useState<any>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const decodedSlug = decodeURIComponent(slug);
    supabase.from('provinces').select('*').eq('slug', decodedSlug).single().then(({ data: p }) => {
      if (!p) { setLoading(false); return; }
      setProvince(p);
      Promise.all([
        supabase.from('cities').select('*').eq('province_id', p.id).order('sort_order'),
        supabase.from('companies').select('*, city:cities(*)').eq('province_id', p.id).order('is_premium', { ascending: false }).limit(30),
      ]).then(([cRes, coRes]) => {
        setCities(cRes.data || []);
        setCompanies(coRes.data || []);
        setLoading(false);
      });
    });
  }, [slug]);

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>;
  if (!province) return <div className="text-center py-20 text-gray-400">省份不存在</div>;

  return (
    <div>
      <div className="bg-gradient-to-r from-orange-500 to-red-500 -mx-4 -mt-6 px-4 py-8 text-white mb-6">
        <h1 className="text-2xl font-bold">{province.name}</h1>
        <p className="text-orange-100 mt-1">{cities.length}个城市 · {companies.length}家公司</p>
      </div>
      
      {/* Cities */}
      {cities.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-3">📌 {province.name}各市</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-8">
            {cities.map((c: any) => (
              <Link key={c.id} href={`/search?province=${province.slug}&city=${c.name}`}
                className="bg-white rounded-lg p-3 text-center hover:shadow-md border text-sm">
                📍 {c.name}
              </Link>
            ))}
          </div>
        </>
      )}
      
      {/* Companies */}
      <h2 className="text-lg font-bold text-gray-900 mb-3">🏢 {province.name}公司 ({companies.length}家)</h2>
      {companies.length === 0 ? (
        <p className="text-center text-gray-400 py-8">暂无公司数据</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {companies.map((c: any) => (
            <Link key={c.id} href={`/company/${c.slug}`}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md p-5 border">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{c.name}
                  {c.verified && <CheckCircle className="w-3 h-3 inline ml-1 text-blue-500" />}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${c.business_type === 'rent' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                  {typeLabels[c.business_type] || c.business_type}
                </span>
              </div>
              <p className="text-sm text-gray-500"><MapPin className="w-3 h-3 inline" /> {c.city?.name} {c.address}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.description}</p>
              <p className="text-sm text-gray-400 mt-2"><Phone className="w-3 h-3 inline" /> {c.phone}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
