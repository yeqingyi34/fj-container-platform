import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "中国住人集装箱信息网 - 全国住人集装箱出租出售信息平台",
    template: "%s | 中国住人集装箱信息网"
  },
  description: "中国住人集装箱信息网整合全国各省住人集装箱出租、出售公司信息，覆盖34个省份，免费查找、直接联系。",
  keywords: ["住人集装箱","集装箱出租","集装箱出售","集装箱房","活动房","移动板房","工地宿舍","全国集装箱"],
  openGraph: {
    title: "中国住人集装箱信息网",
    description: "整合全国住人集装箱出租出售信息，覆盖34省。免费查找，直接联系。",
    type: "website", locale: "zh_CN",
  }
};

const provinces = [
  { name: "广东", slug: "guangdong" }, { name: "浙江", slug: "zhejiang" },
  { name: "江苏", slug: "jiangsu" }, { name: "山东", slug: "shandong" },
  { name: "福建", slug: "fujian" }, { name: "四川", slug: "sichuan" },
  { name: "湖北", slug: "hubei" }, { name: "湖南", slug: "hunan" },
  { name: "河南", slug: "henan" }, { name: "河北", slug: "hebei" },
  { name: "安徽", slug: "anhui" }, { name: "江西", slug: "jiangxi" },
  { name: "辽宁", slug: "liaoning" }, { name: "陕西", slug: "shaanxi" },
  { name: "北京", slug: "beijing" }, { name: "上海", slug: "shanghai" },
  { name: "全国", slug: "all" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-orange-600 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg md:text-xl font-bold tracking-wide whitespace-nowrap">
              🏗️ 中国住人集装箱信息网
            </Link>
            <nav className="hidden lg:flex gap-0.5 text-xs">
              {provinces.map((c) => {
                if (c.slug === 'all') {
                  return (
                    <Link key={c.slug} href="/search" className="px-1.5 py-1 rounded hover:bg-orange-500 whitespace-nowrap">{c.name}</Link>
                  );
                }
                return (
                  <Link key={c.slug} href={`/province/${c.slug}`} className="px-1.5 py-1 rounded hover:bg-orange-500 whitespace-nowrap">
                    {c.name}
                  </Link>
                );
              })}
            </nav>
            <Link href="/search" className="text-sm bg-white text-orange-600 px-3 py-1.5 rounded-lg font-medium hover:bg-orange-50">
              🔍 搜索
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
