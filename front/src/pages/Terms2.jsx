import { useEffect } from "react";
import { termsContent } from "../data/termsContent";

export default function Terms() {
  
  // 페이지가 열릴 때 스크롤을 최상단으로 부드럽게 올림
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  return (
    // 전체 배경 흰색, 글자 검은색 모노톤 유지
    <div className="flex justify-center flex-wrap w-full min-h-screen bg-white font-sans antialiased text-gray-900 pb-40">
      
      {/* 1. 최상단 타이틀 */}
      <div className="w-full py-20 text-center">
        <h1 className="text-4xl font-black tracking-tight text-black">
          약관 안내
        </h1>
      </div>

      {/* 2. 본문 영역: mx-auto와 max-w-4xl 조합으로 전체 화면 정중앙에 완벽하게 안착 */}
      <main className="max-w-4xl mx-auto px-8 mt-12 text-center">
        
        {/* 본문 내부 서브 타이틀 */}
        <div className="text-center mb-28">
          <h2 className="text-2xl font-black text-black tracking-tight">
            이용 약관
          </h2>
        </div>

        {/* 3. 약관 텍스트 내용: 정중앙 정렬 기둥 (privacyContent 데이터만 루프) */}
        <div className="w-full space-y-24 text-center">
          {termsContent.map((item, index) => (
            <section key={index} className="w-full text-center">
              
              {/* 조항 제목 */}
              <h3 className="text-xl font-extrabold text-black mb-6 tracking-tight">
                {item.title}
              </h3>
              
              {/* 본문 내용: 양옆 마진 오토(mx-auto)로 본문 문자열 전체를 한가운데로 밀어 넣음 */}
              <p className="text-[16px] text-gray-700 leading-9 whitespace-pre-line font-normal text-center break-keep max-w-3xl mx-auto">
                {item.content}
              </p>
              
            </section>
          ))}
        </div>

      </main>

    </div>
  );
}