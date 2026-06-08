'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchIcon, MapPin, Phone, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const cityEmojis: Record<string, string> = {
  fuzhou: '🏠', xiamen: '🌊', quanzhou: '⛵', zhangzhou: '🌴',
  putian: '👟', longyan: '⛰️', sanming: '🌿', nanping: '🏔️', ningde: '⚡'
};
const typeLabels: Record<string, string> = { rent: '出租', sale: '出售', both: '出租+出售' };
const typeColors: Record<string, string> = {
  rent: 'bg-blue-50 text-blue-600', sale: 'bg-green-50 text-green-600', both: 'bg-purple-50 text-purple-600'
};

function CompanyCard({ c }: { c: any }) {
  return (
    <Link href={`/company/${c.slug}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            {c.name}
            {c.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
            {c.is_premium && <span className="text-orange-500 text-xs bg-orange-50 px-1.5 py-0.5 rounded">推荐</span>}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {c.city?.name}{c.district?.name}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${typeColors[c.business_type] || 'bg-gray-50 text-gray-600'}`}>
          {typeLabels[c.business_type] || c.business_type}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{c.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400 flex items-center gap-1">
          <Phone className="w-3 h-3" /> {c.phone}
        </span>
        <span className="text-gray-400 text-xs">{c.city?.name}{c.district?.name}</span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [cities, setCities] = useState<any[]>([]);
  const [premiumCompanies, setPremiumCompanies] = useState<any[]>([]);
  const [latestCompanies, setLatestCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('cities').select('*').order('sort_order'),
      supabase.from('companies').select('*, city:cities(*), district:districts(*)').eq('is_premium', true).limit(4),
      supabase.from('companies').select('*, city:cities(*), district:districts(*)').order('view_count', { ascending: false }).limit(6),
    ]).then(([cRes, pRes, lRes]) => {
      setCities(cRes.data || []);
      setPremiumCompanies(pRes.data || []);
      setLatestCompanies(lRes.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>;

  return (
    <div>
      <div className="bg-gradient-to-br from-orange-500 to-red-600 -mx-4 -mt-6 px-4 py-12 text-white text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">找福建住人集装箱，上这里就够了</h1>
        <p className="text-orange-100 mb-6 text-lg">整合全省集装箱房出租出售信息 · 免费查找 · 直接联系</p>
        <form action="/search" className="max-w-2xl mx-auto flex gap-2">
          <select name="city" className="px-4 py-3 rounded-lg text-gray-900 bg-white w-32 text-sm">
            <option value="">全部城市</option>
            {cities.map((c: any) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <select name="type" className="px-4 py-3 rounded-lg text-gray-900 bg-white w-32 text-sm">
            <option value="all">全部类型</option>
            <option value="rent">出租</option>
            <option value="sale">出售</option>
          </select>
          <div className="flex-1 relative">
            <input name="q" type="text" placeholder="搜索公司名称..." className="w-full px-4 py-3 rounded-lg text-gray-900 pr-10" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700">
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🏙️ 按城市查找</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {cities.map((c: any) => (
            <Link key={c.slug} href={`/city/${c.slug}`}
              className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-2xl mb-1">{cityEmojis[c.slug] || '📍'}</div>
              <div className="font-medium text-gray-900">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {premiumCompanies.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⭐ 推荐公司</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {premiumCompanies.map((c: any) => <CompanyCard key={c.id} c={c} />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">📋 全部公司</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestCompanies.map((c: any) => <CompanyCard key={c.id} c={c} />)}
        </div>
        <div className="text-center mt-6">
          <Link href="/search" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
            查看更多公司 →
          </Link>
        </div>
      </section>
    </div>
  );
}
