'use client';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MapPin, Phone, CheckCircle, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";

const typeLabels: Record<string, string> = { rent: '出租', sale: '出售', both: '出租+出售' };
const priceLabels: Record<string, string> = { daily: '天', monthly: '月', sale: '个' };

export default function CompanyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase.from('companies')
      .select('*, city:cities(*), district:districts(*), products(*)')
      .eq('slug', slug).single()
      .then(({ data }) => { setCompany(data); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>;
  if (!company) return <div className="text-center py-20 text-gray-400">公司不存在</div>;

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {company.name}
              {company.verified && <CheckCircle className="w-5 h-5 text-blue-500" />}
            </h1>
            <p className="text-gray-500 mt-1">
              <MapPin className="w-4 h-4 inline" /> {company.city?.name}{company.district?.name} {company.address}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            company.business_type === 'rent' ? 'bg-blue-50 text-blue-600' :
            company.business_type === 'sale' ? 'bg-green-50 text-green-600' :
            'bg-purple-50 text-purple-600'
          }`}>{typeLabels[company.business_type]}</span>
        </div>
        <div className="flex gap-4 mt-4 pt-4 border-t">
          <div className="bg-orange-50 rounded-lg px-4 py-2 text-center">
            <Phone className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-xs text-gray-500">电话</div>
            <div className="font-medium text-orange-600">{company.phone}</div>
          </div>
          {company.wechat && (
            <div className="bg-green-50 rounded-lg px-4 py-2 text-center">
              <span className="text-2xl">💬</span>
              <div className="text-xs text-gray-500">微信</div>
              <div className="font-medium text-green-600">{company.wechat}</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {company.products && company.products.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" /> 产品列表
              </h2>
              <div className="space-y-3">
                {company.products.map((p: any) => (
                  <div key={p.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{p.name}</h3>
                      <span className="text-orange-600 font-bold">
                        ¥{p.price}<span className="text-sm font-normal text-gray-500">/{p.unit || priceLabels[p.price_type] || ''}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      {p.size && <span className="bg-gray-100 px-2 py-1 rounded">{p.size}</span>}
                      {p.material && <span className="bg-gray-100 px-2 py-1 rounded">{p.material}</span>}
                      {p.stock > 0 && <span className="bg-gray-100 px-2 py-1 rounded">库存: {p.stock}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-3">公司简介</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{company.description || '暂无简介'}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">📞 直接联系</h3>
            <div className="text-2xl font-bold text-orange-600 mb-1">{company.phone}</div>
            <p className="text-xs text-gray-500">免费咨询 · 获取报价</p>
          </div>
        </div>
      </div>
    </div>
  );
}
