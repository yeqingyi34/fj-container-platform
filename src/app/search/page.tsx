'use client';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, Star, SearchIcon } from "lucide-react";

const mockData = [
  { id: 1, name: "福州鑫宏达集装箱有限公司", slug: "fuzhou-xinhongda", city: "福州市", district: "仓山区", business_type: "both", phone: "138****6789", verified: true, is_premium: true, rating: 4.5, desc: "专业生产住人集装箱、活动板房，出租出售均可" },
  { id: 2, name: "厦门海沧集装箱租赁中心", slug: "xiamen-haicang", city: "厦门市", district: "海沧区", business_type: "rent", phone: "0592-****888", verified: true, is_premium: true, rating: 4.8, desc: "厦门最大的住人集装箱租赁基地" },
  { id: 3, name: "泉州丰泽区恒达箱房", slug: "quanzhou-hengda", city: "泉州市", district: "丰泽区", business_type: "sale", phone: "159****2345", verified: true, is_premium: false, rating: 4.2, desc: "厂家直销住人集装箱" },
  { id: 4, name: "漳州龙文安居住人集装箱", slug: "zhangzhou-anju", city: "漳州市", district: "龙文区", business_type: "both", phone: "136****7890", verified: false, is_premium: false, rating: 3.9, desc: "出租出售住人集装箱，可定制" },
  { id: 5, name: "宁德福安顺发集装箱", slug: "ningde-shunfa", city: "宁德市", district: "福安市", business_type: "rent", phone: "180****4567", verified: true, is_premium: false, rating: 4.0, desc: "福安本地住人集装箱出租" },
  { id: 6, name: "莆田涵江鑫源集装箱厂", slug: "putian-xinyuan", city: "莆田市", district: "涵江区", business_type: "sale", phone: "0594-****666", verified: false, is_premium: false, rating: 4.3, desc: "涵江本地集装箱生产厂家" },
  { id: 7, name: "福州长乐区海天箱房", slug: "fuzhou-haitian", city: "福州市", district: "长乐区", business_type: "rent", phone: "137****8901", verified: false, is_premium: false, rating: 3.8, desc: "长乐工地住人集装箱出租，日租低至6元" },
  { id: 8, name: "厦门集美集装箱贸易公司", slug: "xiamen-jimei", city: "厦门市", district: "集美区", business_type: "sale", phone: "0592-****999", verified: true, is_premium: false, rating: 4.6, desc: "厦门集美区最大的二手集装箱交易商" },
];

const cities = ["全部城市","福州","厦门","泉州","漳州","莆田","龙岩","三明","南平","宁德"];

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [results, setResults] = useState(mockData);

  useEffect(() => {
    let filtered = [...mockData];
    if (query) filtered = filtered.filter(c => c.name.includes(query));
    if (city) filtered = filtered.filter(c => c.city.includes(city));
    if (type !== 'all') {
      filtered = filtered.filter(c => c.business_type === type || c.business_type === 'both');
    }
    // Sort: premium first
    filtered.sort((a, b) => (b.is_premium ? 1 : 0) - (a.is_premium ? 1 : 0));
    setResults(filtered);
  }, [query, city, type]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🔍 搜索公司</h1>
      
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-3">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="公司名称..."
          className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg text-sm" />
        <select value={city} onChange={e => setCity(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm">
          {cities.map(c => <option key={c} value={c === '全部城市' ? '' : c}>{c}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm">
          <option value="all">全部类型</option>
          <option value="rent">出租</option>
          <option value="sale">出售</option>
        </select>
        <button className="bg-orange-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-orange-700 flex items-center gap-1">
          <SearchIcon className="w-4 h-4" /> 搜索
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">找到 {results.length} 家公司</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(c => (
          <Link key={c.id} href={`/company/${c.slug}`}
            className="block bg-white rounded-xl shadow-sm hover:shadow-md p-5 border">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold text-gray-900">
                {c.name}
                {c.verified && <span className="ml-1 text-blue-500 text-xs bg-blue-50 px-1.5 py-0.5 rounded">认证</span>}
                {c.is_premium && <span className="ml-1 text-orange-500 text-xs bg-orange-50 px-1.5 py-0.5 rounded">推荐</span>}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                c.business_type === 'rent' ? 'bg-blue-50 text-blue-600' :
                c.business_type === 'sale' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
              }`}>
                {c.business_type === 'rent' ? '出租' : c.business_type === 'sale' ? '出售' : '出租+出售'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1"><MapPin className="w-3 h-3 inline" /> {c.city}{c.district}</p>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{c.desc}</p>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-500"><Star className="w-4 h-4 inline fill-current" /> {c.rating}</span>
              <span className="text-gray-400"><Phone className="w-3 h-3 inline" /> {c.phone}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense><SearchContent /></Suspense>;
}
