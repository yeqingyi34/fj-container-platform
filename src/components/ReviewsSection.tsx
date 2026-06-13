'use client';
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ReviewsSection({ companyId }: { companyId: number }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    supabase.from('reviews')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setReviews(data); });
  }, [companyId]);

  const submitReview = async () => {
    if (!reviewContent.trim() || !reviewName.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      company_id: companyId,
      rating: reviewRating,
      content: reviewContent.trim(),
      user_id: '00000000-0000-0000-0000-000000000000',
    });
    if (!error) {
      setReviewSubmitted(true);
      setShowReviewForm(false);
      setReviewContent('');
      setReviewName('');
      supabase.from('reviews')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setReviews(data); });
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
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
  );
}
