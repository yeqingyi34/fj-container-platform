import { MapPin, Phone, Star, CheckCircle, Package } from "lucide-react";

const companyData = {
  id: 1, name: "福州鑫宏达集装箱有限公司", slug: "fuzhou-xinhongda",
  city: "福州市", district: "仓山区", address: "福州市仓山区盖山镇齐安路88号",
  phone: "138****6789", wechat: "xinhongda888",
  business_type: "both", verified: true, is_premium: true, rating: 4.5,
  description: "福州鑫宏达集装箱有限公司成立于2018年，是一家专业从事住人集装箱设计、生产、销售、租赁为一体的综合性企业。公司拥有标准化生产车间2000平方米，年产量达5000个标准集装箱房。产品广泛应用于工地临建、临时办公、员工宿舍、仓库存储等场景。公司始终坚持质量第一、客户至上的经营理念，产品覆盖福州、厦门、泉州、漳州等全省各地。",
  photos: ["🏠", "🏗️", "📦"],
  products: [
    { id: 1, name: "标准住人箱房 3m×6m", type: "标准箱", size: "3m×6m×2.7m", material: "彩钢板+岩棉保温层", price_type: "monthly", price: 600, unit: "月", stock: 200, description: "标准配置：防盗门、铝合金窗、电路布线、吸顶灯、空调插座" },
    { id: 2, name: "豪华住人箱房 3m×6m", type: "豪华箱", size: "3m×6m×2.7m", material: "镀锌钢板+聚氨酯保温", price_type: "sale", price: 12000, unit: "个", stock: 50, description: "豪华配置：实木地板、整体卫浴、空调、热水器、办公桌椅" },
    { id: 3, name: "工地办公室集装箱", type: "定制箱", size: "3m×9m×2.7m", material: "镀锌钢板", price_type: "daily", price: 8, unit: "天", stock: 100, description: "加长型，可做办公室、会议室，配套办公家具" },
    { id: 4, name: "双层宿舍集装箱", type: "定制箱", size: "3m×6m×5.4m", material: "型钢框架+彩钢板", price_type: "monthly", price: 900, unit: "月", stock: 30, description: "上下两层，可住8人，独立卫浴，通风采光好" },
  ],
  reviews: [
    { id: 1, user: "陈**", rating: 5, content: "租了20个箱房做工地宿舍，质量很好，送货安装都很快，推荐！", date: "2026-05-15" },
    { id: 2, user: "林**", rating: 4, content: "买了3个做临时办公室，价格比市场便宜，做工还行，用了半年没出问题。", date: "2026-04-22" },
    { id: 3, user: "张**", rating: 5, content: "服务态度好，有问题随叫随到。集装箱质量靠谱，第二次回购了。", date: "2026-03-10" },
  ]
};

export default function CompanyPage() {
  const c = companyData;
  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {c.name}
              {c.verified && <CheckCircle className="w-5 h-5 text-blue-500" />}
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-4">
              <span><MapPin className="w-4 h-4 inline" /> {c.city}{c.district} {c.address}</span>
              <span className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" /> {c.rating}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              c.business_type === 'rent' ? 'bg-blue-50 text-blue-600' :
              c.business_type === 'sale' ? 'bg-green-50 text-green-600' :
              'bg-purple-50 text-purple-600'
            }`}>
              {c.business_type === 'rent' ? '可出租' : c.business_type === 'sale' ? '可出售' : '出租+出售'}
            </span>
            {c.is_premium && <span className="px-3 py-1 rounded-full text-sm bg-orange-50 text-orange-600">推荐商家</span>}
          </div>
        </div>
        
        <div className="flex gap-4 mt-4 pt-4 border-t">
          <div className="bg-orange-50 rounded-lg px-4 py-2 text-center">
            <Phone className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-xs text-gray-500">电话</div>
            <div className="font-medium text-orange-600">{c.phone}</div>
          </div>
          <div className="bg-green-50 rounded-lg px-4 py-2 text-center">
            <span className="text-2xl">💬</span>
            <div className="text-xs text-gray-500">微信</div>
            <div className="font-medium text-green-600">{c.wechat}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" /> 产品列表
            </h2>
            <div className="space-y-4">
              {c.products.map(p => (
                <div key={p.id} className="border rounded-lg p-4 hover:border-orange-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <span className="text-orange-600 font-bold text-lg">
                      ¥{p.price}<span className="text-sm font-normal text-gray-500">/{p.unit}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                    <span className="bg-gray-100 px-2 py-1 rounded">{p.size}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{p.material}</span>
                    {p.stock > 0 && <span className="bg-gray-100 px-2 py-1 rounded">库存: {p.stock}</span>}
                  </div>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">💬 用户评价 ({c.reviews.length})</h2>
            <div className="space-y-4">
              {c.reviews.map(r => (
                <div key={r.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-900">{r.user}</span>
                    <span className="text-yellow-500">{'⭐'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{r.content}</p>
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-3">公司简介</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{c.description}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">📞 直接联系</h3>
            <div className="text-2xl font-bold text-orange-600 mb-1">{c.phone}</div>
            <p className="text-xs text-gray-500">免费咨询 · 获取报价</p>
          </div>
        </div>
      </div>
    </div>
  );
}
