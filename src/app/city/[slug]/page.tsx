'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Phone, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

const typeLabels: Record<string, string> = { rent: '出租', sale: '出售', both: '出租+出售' };

export default function CityPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [city, setCity] = useState<any>(null);
  const [districts, setDistricts] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const decodedSlug = decodeURIComponent(slug);
    supabase.from('cities').select('*').eq('slug', decodedSlug).single().then(({ data }) => {
      if (!data) { setLoading(false); return; }
      setCity(data);
      Promise.all([
        supabase.from('districts').select('*').eq('city_id', data.id),
        supabase.from('companies').select('*, district:districts(*)').eq('city_id', data.id).order('is_premium', { ascending: false }).limit(20),
      ]).then(([dRes, cRes]) => {
        setDistricts(dRes.data || []);
        setCompanies(cRes.data || []);
        setLoading(false);
      });
    });
  }, [slug]);

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>;
  if (!city) return <div className="text-center py-20 text-gray-400">城市不存在</div>;

  return (
    <div>
      <div className="bg-gradient-to-r from-orange-500 to-red-500 -mx-4 -mt-6 px-4 py-8 text-white mb-6">
        <h1 className="text-2xl font-bold">{city.name}</h1>
        <p className="text-orange-100 mt-1">住人集装箱出租出售信息 · {districts.length}个区域</p>
      </div>
      {districts.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-3">📌 选择区域</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {districts.map((d: any) => (
              <Link key={d.id} href={`/search?city=${slug}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md border text-sm font-medium text-gray-700">
                📍 {d.name}
              </Link>
            ))}
          </div>
        </>
      )}
      <h2 className="text-lg font-bold text-gray-900 mb-3">🏢 {city.name}公司 ({companies.length}家)</h2>
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
                <span className={`text-xs px-2 py-1 rounded-full ${
                  c.business_type === 'rent' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>{typeLabels[c.business_type] || c.business_type}</span>
              </div>
              <p className="text-sm text-gray-500"><MapPin className="w-3 h-3 inline" /> {c.district?.name} {c.address}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.description}</p>
              <p className="text-sm text-gray-400 mt-2"><Phone className="w-3 h-3 inline" /> {c.phone}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
