'use client';
import { useState } from "react";

export default function Footer() {
  const [showQR, setShowQR] = useState(false);

  return (
    <footer className="bg-gray-800 text-gray-400 text-sm py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>© 2026 中国住人集装箱信息网 | 整合全国住人集装箱出租出售信息 · 覆盖34省</p>
        <p className="mt-1">
          <button
            onClick={() => setShowQR(!showQR)}
            className="text-gray-400 hover:text-white underline underline-offset-4 decoration-dotted transition-colors"
          >
            广告合作 · 商家入驻 · 联系我们
          </button>
        </p>
        {showQR && (
          <div className="mt-4 inline-block bg-white rounded-xl p-4 shadow-lg">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=tel:15259273991"
              alt="扫码联系"
              className="w-44 h-44 mx-auto"
            />
            <p className="text-gray-600 text-xs mt-2">📱 扫码拨打电话</p>
            <p className="text-gray-400 text-xs mt-1">或直接拨打 15259273991</p>
          </div>
        )}
      </div>
    </footer>
  );
}
