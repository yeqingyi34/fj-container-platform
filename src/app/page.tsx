import Link from "next/link";
import { SearchIcon, MapPin, Phone, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const provinceEmojis: Record<string, string> = {
  guangdong: '🏭', zhejiang: '🏗️', jiangsu: '🏛️', shandong: '⛵',
  fujian: '🏠', sichuan: '🐼', hubei: '🏯', hunan: '🌶️',
  henan: '🛕', hebei: '🏰', anhui: '⛰️', jiangxi: '🏔️',
  liaoning: '🏭', shaanxi: '🗿', beijing: '🏛️', shanghai: '🌃',
  tianjin: '🏙️', chongqing: '🏔️', shanxi: '⛏️', jilin: '❄️',
  heilongjiang: '🧊', yunnan: '🌺', guizhou: '🏔️', gansu: '🐫',
  guangxi: '🏞️', neimenggu: '🐎', xinjiang: '🍇', xizang: '🏔️',
  hainan: '🏖️', qinghai: '🏔️', ningxia: '🕌', taiwan: '🏝️',
  hongkong: '🏙️', macau: '🎰'
};

const typeLabels: Record<string, string> = { rent: '出租', sale: '出售', both: '出租+出售' };
const typeColors: Record<string, string> = {
  rent: 'bg-blue-50 text-blue-600', sale: 'bg-green-50 text-green-600', both: 'bg-purple-50 text-purple-600'
};

export default async function Home() {
  const [pRes, premRes, latestRes, countRes] = await Promise.all([
    supabase.from('provinces').select('*').order('sort_order'),
    supabase.from('companies').select('*, city:cities(*), province:provinces(*)').eq('is_premium', true).limit(4),
    supabase.from('companies').select('*, city:cities(*), province:provinces(*)').order('view_count', { ascending: false }).limit(8),
    supabase.from('companies').select('id', { count: 'exact', head: true }),
  ]);

  const provinces = pRes.data || [];
  const premiumCompanies = premRes.data || [];
  const latestCompanies = latestRes.data || [];
  const totalCount = countRes.count || 0;

  return (
    <div>
      <div className="bg-gradient-to-br from-orange-500 to-red-600 -mx-4 -mt-6 px-4 py-12 text-white text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">中国住人集装箱信息网</h1>
        <p className="text-orange-100 mb-6 text-lg">整合全国{totalCount}+家集装箱房公司 · 覆盖34省 · 免费查找 · 直接联系</p>
        <form action="/search" className="max-w-2xl mx-auto flex gap-2">
          <input name="q" type="text" placeholder="搜索公司名称..."
            className="flex-1 px-4 py-3 rounded-lg text-gray-900" />
          <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <SearchIcon className="w-5 h-5" /> 搜索
          </button>
        </form>
      </div>

      {/* Provinces grid */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🗺️ 按省份查找</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
          {provinces.map((p: any) => (
            <Link key={p.slug} href={`/province/${p.slug}`}
              className="bg-white rounded-lg p-3 text-center hover:shadow-md border hover:border-orange-300 transition-all">
              <div className="text-xl mb-1">{provinceEmojis[p.slug] || '📍'}</div>
              <div className="text-sm font-medium text-gray-800">{p.name}</div>
            </Link>
          ))}
        </div>
        {/* Quick Fujian access */}
        <div className="mt-4 p-3 bg-orange-50 rounded-lg text-center">
          <Link href="/province/fujian" className="text-orange-600 font-medium hover:underline">
            🔥 福建省已收录福州、厦门、泉州等9市57家公司 → 点击查看
          </Link>
        </div>
      </section>

      {premiumCompanies.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⭐ 推荐公司</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {premiumCompanies.map((c: any) => (
              <Link key={c.id} href={`/company/${c.slug}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md p-5 border">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {c.name}
                    {c.verified && <CheckCircle className="w-3 h-3 inline ml-1 text-blue-500" />}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[c.business_type] || 'bg-gray-50'}`}>
                    {typeLabels[c.business_type]}
                  </span>
                </div>
                <p className="text-xs text-gray-500"><MapPin className="w-3 h-3 inline" /> {c.province?.name} {c.city?.name}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{c.description}</p>
                <p className="text-xs text-gray-400 mt-2"><Phone className="w-3 h-3 inline" /> {c.phone}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">📋 最新公司</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestCompanies.map((c: any) => (
            <Link key={c.id} href={`/company/${c.slug}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md p-5 border">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{c.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[c.business_type] || 'bg-gray-50'}`}>
                  {typeLabels[c.business_type]}
                </span>
              </div>
              <p className="text-xs text-gray-500"><MapPin className="w-3 h-3 inline" /> {c.province?.name} {c.city?.name}</p>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{c.description}</p>
              <p className="text-xs text-gray-400 mt-2"><Phone className="w-3 h-3 inline" /> {c.phone}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/search" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700">
            查看更多公司 →
          </Link>
        </div>
      </section>
    </div>
  );
}
