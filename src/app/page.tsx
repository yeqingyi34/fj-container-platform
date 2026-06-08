import Link from "next/link";
import { SearchIcon, MapPin, Phone, Star } from "lucide-react";

const cities = [
  { name: "福州", slug: "fuzhou", count: 156 },
  { name: "厦门", slug: "xiamen", count: 89 },
  { name: "泉州", slug: "quanzhou", count: 134 },
  { name: "漳州", slug: "zhangzhou", count: 78 },
  { name: "莆田", slug: "putian", count: 42 },
  { name: "龙岩", slug: "longyan", count: 35 },
  { name: "三明", slug: "sanming", count: 28 },
  { name: "南平", slug: "nanping", count: 22 },
  { name: "宁德", slug: "ningde", count: 31 },
];

// Mock seed data
const mockCompanies = [
  { id: 1, name: "福州鑫宏达集装箱有限公司", city: "福州市", district: "仓山区", business_type: "both", phone: "138****6789", verified: true, is_premium: true, rating: 4.5, desc: "专业生产住人集装箱、活动板房，出租出售均可，福州地区免费送货" },
  { id: 2, name: "厦门海沧集装箱租赁中心", city: "厦门市", district: "海沧区", business_type: "rent", phone: "0592-****888", verified: true, is_premium: true, rating: 4.8, desc: "厦门最大的住人集装箱租赁基地，日租月租均可，配套齐全" },
  { id: 3, name: "泉州丰泽区恒达箱房", city: "泉州市", district: "丰泽区", business_type: "sale", phone: "159****2345", verified: true, is_premium: false, rating: 4.2, desc: "厂家直销住人集装箱，多种规格可选，质量保证" },
  { id: 4, name: "漳州龙文区安居住人集装箱", city: "漳州市", district: "龙文区", business_type: "both", phone: "136****7890", verified: false, is_premium: false, rating: 3.9, desc: "出租出售住人集装箱，可定制尺寸，漳州全区配送" },
  { id: 5, name: "宁德福安顺发集装箱", city: "宁德市", district: "福安市", business_type: "rent", phone: "180****4567", verified: true, is_premium: false, rating: 4.0, desc: "福安本地住人集装箱出租，工地用房、临时办公首选" },
  { id: 6, name: "莆田涵江区鑫源集装箱厂", city: "莆田市", district: "涵江区", business_type: "sale", phone: "0594-****666", verified: false, is_premium: false, rating: 4.3, desc: "涵江本地集装箱生产厂家，价格实惠，欢迎来厂考察" },
];

function CompanyCard({ c }: { c: typeof mockCompanies[0] }) {
  return (
    <Link href={`/company/${c.id}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            {c.name}
            {c.verified && <span className="text-blue-500 text-xs bg-blue-50 px-1.5 py-0.5 rounded">已认证</span>}
            {c.is_premium && <span className="text-orange-500 text-xs bg-orange-50 px-1.5 py-0.5 rounded">推荐</span>}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {c.city}{c.district}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          c.business_type === 'rent' ? 'bg-blue-50 text-blue-600' :
          c.business_type === 'sale' ? 'bg-green-50 text-green-600' :
          'bg-purple-50 text-purple-600'
        }`}>
          {c.business_type === 'rent' ? '出租' : c.business_type === 'sale' ? '出售' : '出租+出售'}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{c.desc}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" /> {c.rating}
        </span>
        <span className="text-gray-400 flex items-center gap-1">
          <Phone className="w-3 h-3" /> {c.phone}
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 -mx-4 -mt-6 px-4 py-12 text-white text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">找福建住人集装箱，上这里就够了</h1>
        <p className="text-orange-100 mb-6 text-lg">整合全省集装箱房出租出售信息 · 免费查找 · 直接联系</p>
        
        {/* Search */}
        <form action="/search" className="max-w-2xl mx-auto flex gap-2">
          <select name="city" className="px-4 py-3 rounded-lg text-gray-900 bg-white w-32 text-sm">
            <option value="">全部城市</option>
            {cities.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <select name="type" className="px-4 py-3 rounded-lg text-gray-900 bg-white w-32 text-sm">
            <option value="all">全部类型</option>
            <option value="rent">出租</option>
            <option value="sale">出售</option>
          </select>
          <div className="flex-1 relative">
            <input name="q" type="text" placeholder="搜索公司名称..." 
              className="w-full px-4 py-3 rounded-lg text-gray-900 pr-10" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700">
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Cities */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🏙️ 按城市查找</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {cities.map(c => (
            <Link key={c.slug} href={`/city/${c.slug}`}
              className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-2xl mb-1">{c.name[0] === '福' ? '🏠' : c.name[0] === '厦' ? '🌊' : c.name[0] === '泉' ? '⛵' : '📍'}</div>
              <div className="font-medium text-gray-900">{c.name}</div>
              <div className="text-xs text-gray-400 mt-1">{c.count}家公司</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium companies */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">⭐ 推荐公司</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCompanies.filter(c => c.is_premium).map(c => (
            <CompanyCard key={c.id} c={c} />
          ))}
        </div>
      </section>

      {/* All companies */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">📋 最新入驻</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCompanies.filter(c => !c.is_premium).map(c => (
            <CompanyCard key={c.id} c={c} />
          ))}
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
