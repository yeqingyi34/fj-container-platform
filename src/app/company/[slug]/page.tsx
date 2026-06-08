'use client';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MapPin, Phone, CheckCircle, Package, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

const typeLabels: Record<string, string> = { rent: '出租', sale: '出售', both: '出租+出售' };
const priceLabels: Record<string, string> = { daily: '天', monthly: '月', sale: '个' };

export default function CompanyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  const loadCompany = () => {
    if (!slug) return;
    const decodedSlug = decodeURIComponent(slug);
    supabase.from('companies')
      .select('*, city:cities(*), district:districts(*), products(*)')
      .eq('slug', decodedSlug).single()
      .then(({ data }) => { setCompany(data); setLoading(false); });
    
    supabase.from('reviews')
      .select('*')
      .eq('company_id', company?.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setReviews(data); });
  };

  useEffect(() => { loadCompany(); }, [slug]);
  useEffect(() => {
    if (!company?.id) return;
    supabase.from('reviews')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setReviews(data); });
  }, [company?.id]);

  const submitReview = async () => {
    if (!reviewContent.trim() || !reviewName.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      company_id: company.id,
      rating: reviewRating,
      content: reviewContent.trim(),
      user_id: '00000000-0000-0000-0000-000000000000', // Anonymous
    });
    if (!error) {
      setReviewSubmitted(true);
      setShowReviewForm(false);
      setReviewContent('');
      setReviewName('');
      supabase.from('reviews')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setReviews(data); });
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>;
  if (!company) return <div className="text-center py-20 text-gray-400">公司不存在</div>;

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {company.name}
              {company.verified && <CheckCircle className="w-5 h-5 text-blue-500" />}
              {avgRating && <span className="text-yellow-500 text-lg flex items-center gap-0.5"><Star className="w-5 h-5 fill-current" /> {avgRating}</span>}
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
          {/* Products */}
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

          {/* Reviews Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                💬 用户评价 {avgRating && <span className="text-yellow-500 text-base font-normal flex items-center gap-0.5"><Star className="w-4 h-4 fill-current" />{avgRating}</span>}
                <span className="text-sm font-normal text-gray-400">({reviews.length}条)</span>
              </h2>
              <button onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                {showReviewForm ? '取消' : '✏️ 写评价'}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="border rounded-lg p-4 mb-4 bg-orange-50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">评分：</span>
                  {[1,2,3,4,5].map(i => (
                    <button key={i} onClick={() => setReviewRating(i)}
                      className={`text-2xl transition-colors ${i <= reviewRating ? 'text-yellow-500' : 'text-gray-300'}`}>
                      <Star className={`w-6 h-6 ${i <= reviewRating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
                <input
                  value={reviewName}
                  onChange={e => setReviewName(e.target.value)}
                  placeholder="你的昵称"
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                />
                <textarea
                  value={reviewContent}
                  onChange={e => setReviewContent(e.target.value)}
                  placeholder="分享你的体验..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-3 resize-none"
                />
                <button
                  onClick={submitReview}
                  disabled={submitting || !reviewContent.trim() || !reviewName.trim()}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                  {submitting ? '提交中...' : '提交评价'}
                </button>
                {reviewSubmitted && <span className="ml-3 text-green-600 text-sm">✅ 评价成功！</span>}
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-center text-gray-400 py-6">暂无评价，来写第一条吧！</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r: any) => (
                  <div key={r.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-900">匿名用户</span>
                      <span className="text-yellow-500 flex">
                        {Array.from({length: r.rating}).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{r.content}</p>
                    <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-3">公司简介</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{company.description || '暂无简介'}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">📞 直接联系</h3>
            <div className="text-2xl font-bold text-orange-600 mb-1">{company.phone}</div>
            <p className="text-xs text-gray-500 mb-3">免费咨询 · 获取报价</p>
            <button onClick={() => setShowReviewForm(true)}
              className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm hover:bg-orange-700">
              写评价
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
