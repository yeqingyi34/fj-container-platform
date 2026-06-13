import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import SearchClient from "./SearchClient";

export const metadata = {
  title: "搜索公司 - 中国住人集装箱信息网",
  description: "搜索全国住人集装箱出租、出售公司。按省份、城市、业务类型筛选，免费查找，直接联系。",
};

export default async function SearchPage() {
  // Pre-fetch cities on server for the dropdown
  const { data: cities } = await supabase.from('cities').select('*').order('sort_order');

  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">加载中...</div>}>
      <SearchClient cities={cities || []} />
    </Suspense>
  );
}
