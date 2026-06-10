import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "福建集装箱房 - 住人集装箱出租出售信息平台",
    template: "%s | 福建集装箱房"
  },
  description: "福建集装箱房信息平台整合福建省9市住人集装箱出租、出售公司信息，免费查找、直接联系。覆盖福州、厦门、泉州、漳州、莆田、龙岩、三明、南平、宁德。",
  keywords: ["住人集装箱","集装箱出租","集装箱出售","福建集装箱","福州集装箱","厦门集装箱","泉州集装箱","活动房","移动板房","工地宿舍"],
  openGraph: {
    title: "福建集装箱房 - 住人集装箱出租出售信息平台",
    description: "找福建住人集装箱，上这里就够了。整合全省集装箱房出租出售信息，免费查找，直接联系。",
    type: "website",
    locale: "zh_CN",
  }
};

const cities = [
  { name: "福州", slug: "fuzhou" },
  { name: "厦门", slug: "xiamen" },
  { name: "泉州", slug: "quanzhou" },
  { name: "漳州", slug: "zhangzhou" },
  { name: "莆田", slug: "putian" },
  { name: "龙岩", slug: "longyan" },
  { name: "三明", slug: "sanming" },
  { name: "南平", slug: "nanping" },
  { name: "宁德", slug: "ningde" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-orange-600 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-wide">
              🏗️ 福建集装箱房
            </Link>
            <nav className="hidden md:flex gap-1 text-sm">
              {cities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/city/${c.slug}`}
                  className="px-2 py-1 rounded hover:bg-orange-500 transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
            <span className="text-sm text-white/80">📞 广告入驻请联系</span>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
