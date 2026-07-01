import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { termsContent } from "../data/termsContent";
import { privacyContent } from "../data/privacyContent";

export default function Terms() {
  const location = useLocation();

  const fromFooter = !!location.state?.defaultTab;
  const initialTab = location.state?.defaultTab || "terms";

  const [tab, setTab] = useState(initialTab);

  // ✅ JSX 깨짐 수정
  useEffect(() => {
    if (location.state?.defaultTab) {
      setTab(location.state.defaultTab);
    }
  }, [location]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  const data = tab === "terms" ? termsContent : privacyContent;

  const subTitle =
    tab === "terms"
      ? "today-menu 서비스 이용약관"
      : "개인정보 처리방침";

  const pageTitle =
    tab === "terms" ? "이용약관" : "개인정보처리방침";

  return (
    <div className="flex justify-center flex-wrap w-full min-h-screen bg-white font-sans antialiased text-gray-900 pb-40">

      {/* 타이틀 */}
      <div className="w-full py-20 text-center">
        <h1 className="text-4xl font-black tracking-tight text-black">
          {fromFooter ? pageTitle : "약관 안내"}
        </h1>
      </div>

      {/* ✅ 탭 (Footer 진입 시 숨김) */}
      {!fromFooter && (
        <div className="w-full border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="w-full flex justify-center gap-20 py-6">
            <button
              onClick={() => setTab("terms")}
              className={`text-lg font-bold transition-all relative pb-2 ${
                tab === "terms"
                  ? "text-black"
                  : "text-gray-400 opacity-50 hover:opacity-80"
              }`}
            >
              이용약관
              {tab === "terms" && (
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-black" />
              )}
            </button>

            <button
              onClick={() => setTab("privacy")}
              className={`text-lg font-bold transition-all relative pb-2 ${
                tab === "privacy"
                  ? "text-black"
                  : "text-gray-400 opacity-50 hover:opacity-80"
              }`}
            >
              개인정보처리방침
              {tab === "privacy" && (
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-black" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 본문 */}
      <main className="max-w-4xl mx-auto px-8 mt-32 text-center">

        <div className="mb-20">
          <h2 className="text-2xl font-black text-black">
            {subTitle}
          </h2>
        </div>

        <div className="space-y-16">
          {data.map((item, index) => (
            <section key={index}>
              <h3 className="text-xl font-extrabold text-black mb-4">
                {item.title}
              </h3>

              <p className="text-[16px] text-gray-700 leading-8 whitespace-pre-line max-w-3xl mx-auto">
                {item.content}
              </p>
            </section>
          ))}
        </div>

      </main>
    </div>
  );
}