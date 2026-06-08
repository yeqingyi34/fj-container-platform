import Link from "next/link";
import { MapPin, Phone, Star } from "lucide-react";

const cityData: Record<string, { name: string; districts: string[] }> = {
  fuzhou: { name: "福州市", districts: ["鼓楼区","台江区","仓山区","晋安区","马尾区","长乐区","福清市","闽侯县"] },
  xiamen: { name: "厦门市", districts: ["思明区","湖里区","集美区","海沧区","同安区","翔安区"] },
  quanzhou: { name: "泉州市", districts: ["鲤城区","丰泽区","洛江区","泉港区","晋江市","石狮市","南安市","惠安县"] },
  zhangzhou: { name: "漳州市", districts: ["芗城区","龙文区","龙海区","长泰区"] },
  putian: { name: "莆田市", districts: ["城厢区","涵江区","荔城区","秀屿区"] },
  longyan: { name: "龙岩市", districts: ["新罗区","永定区"] },
  sanming: { name: "三明市", districts: ["三元区","沙县区"] },
  nanping: { name: "南平市", districts: ["延平区","建阳区"] },
  ningde: { name: "宁德市", districts: ["蕉城区","福安市","福鼎市"] },
};

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = cityData[params.slug];
  if (!city) return <div className="text-center py-20 text-gray-500">城市不存在</div>;

  return (
    <div>
      <div className="bg-gradient-to-r from-orange-500 to-red-500 -mx-4 -mt-6 px-4 py-8 text-white mb-6">
        <h1 className="text-2xl font-bold">{city.name}</h1>
        <p className="text-orange-100 mt-1">住人集装箱出租出售信息 · {city.districts.length}个区域覆盖</p>
      </div>
      
      <h2 className="text-lg font-bold text-gray-900 mb-3">📌 选择区域</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {city.districts.map(d => (
          <Link key={d} href={`/search?city=${params.slug}&district=${d}`}
            className="bg-white rounded-lg p-4 text-center hover:shadow-md border text-sm font-medium text-gray-700">
            📍 {d}
          </Link>
        ))}
      </div>
      
      <p className="text-center text-gray-400 py-8">更多公司数据持续录入中...</p>
    </div>
  );
}
