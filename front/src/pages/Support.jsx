import React, { useState } from 'react';

export default function Support() {
  const [userRole, setUserRole] = useState("user"); 
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null); 
  const [openInquiryId, setOpenInquiryId] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [formError, setFormError] = useState("");
  const [adminReplyText, setAdminReplyText] = useState("");

  const faqData = [
    { id: 1, q: "AI 챗봇이 제 위치와 다른 맛집을 추천해요.", a: "브라우저 위치 권한을 허용해주세요." },
    { id: 2, q: "밥 친구 매칭 파티는 어떻게 참여하나요?", a: "파티 메뉴에서 참여 가능합니다." },
    { id: 3, q: "결정 게임 항목을 바꿀 수 있나요?", a: "현재는 기본 메뉴만 제공됩니다." },
    { id: 4, q: "최소 주문 금액 매칭은?", a: "합계 금액이 넘으면 자동 매칭됩니다." },
  ];

  const [inquiries, setInquiries] = useState([
    { id: 1, title: "방장이 안 와요", content: "문제 있음", writer: "user1", date: "2026-06-30", answer: null },
    { id: 2, title: "버그 있음", content: "화면 멈춤", writer: "user2", date: "2026-06-29", answer: "확인 중" },
  ]);

  // ✅ 필터링
  const filteredFaqs = faqData.filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInquiries = inquiries.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ ✅ pagination (핵심!)
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

  const currentInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ 기능들
  const handleInquiryToggle = (id) => {
    setOpenInquiryId(openInquiryId === id ? null : id);
    setAdminReplyText("");
  };

  const handleCreateInquiry = (e) => {
    e.preventDefault();
    if (newTitle.length < 4) return alert("제목 4자 이상");
    if (newContent.length < 10) return alert("내용 10자 이상");

    const newInquiry = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      writer: "me",
      date: "2026-07-01",
      answer: null
    };

    setInquiries([newInquiry, ...inquiries]);
    setNewTitle("");
    setNewContent("");
    setIsInquiryModalOpen(false);
    setCurrentPage(1);
  };

  const handleAddAnswer = (id) => {
    if (!adminReplyText) return;
    setInquiries(inquiries.map(item =>
      item.id === id ? { ...item, answer: adminReplyText } : item
    ));
    setAdminReplyText("");
  };

  return (
    <div className="min-h-screen p-6">

      <h2 className="text-xl font-bold mb-4">고객센터</h2>

      <input
        type="text"
        placeholder="검색"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 w-full mb-6"
      />

      {/* FAQ */}
      {(activeTab === "all" || activeTab === "faq") && (
        <div className="mb-8">
          <h3 className="font-bold mb-2">FAQ</h3>
          {filteredFaqs.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveFaq(item)}
              className="border p-3 mb-2 cursor-pointer"
            >
              Q. {item.q}
            </div>
          ))}
        </div>
      )}

      {/* 문의 */}
      {(activeTab === "all" || activeTab === "inquiry") && (
        <div>
          <h3 className="font-bold mb-2">문의사항</h3>

          {currentInquiries.map(item => {
            const isOpen = openInquiryId === item.id;

            return (
              <div key={item.id} className="border mb-2">
                <div
                  onClick={() => handleInquiryToggle(item.id)}
                  className="p-3 cursor-pointer"
                >
                  {item.title}
                </div>

                {isOpen && (
                  <div className="p-3 bg-gray-100">
                    <p>{item.content}</p>

                    {item.answer ? (
                      <p className="text-green-600">답변: {item.answer}</p>
                    ) : (
                      userRole === "admin" && (
                        <div className="flex gap-2 mt-2">
                          <input
                            value={adminReplyText}
                            onChange={(e) => setAdminReplyText(e.target.value)}
                            className="border p-1"
                          />
                          <button onClick={() => handleAddAnswer(item.id)}>
                            등록
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* ✅ pagination */}
          <div className="flex gap-2 mt-4">
            <button onClick={() => setCurrentPage(1)}>{"<<"}</button>
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>{"<"}</button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}

            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>{">"}</button>
            <button onClick={() => setCurrentPage(totalPages)}>{">>"}</button>
          </div>
        </div>
      )}

      {/* FAQ 모달 */}
      {activeFaq && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-4">
            <h4>Q. {activeFaq.q}</h4>
            <p>{activeFaq.a}</p>
            <button onClick={() => setActiveFaq(null)}>닫기</button>
          </div>
        </div>
      )}

    </div>
  );
}
