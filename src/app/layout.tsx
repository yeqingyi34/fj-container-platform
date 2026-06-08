import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "福建集装箱房 - 住人集装箱出租出售信息平台",
  description: "整合福建省所有住人集装箱出租、出售公司信息，找集装箱房就上福建集装箱房",
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
        <footer className="bg-gray-800 text-gray-400 text-sm py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>© 2026 福建集装箱房信息平台 | 整合福建住人集装箱出租出售信息</p>
            <p className="mt-1">广告合作、商家入驻请联系</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
