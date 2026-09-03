"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [noticeMessage, setNoticeMessage] =
  useState("");
  const [activeTab, setActiveTab] = useState<"home" | "chat">("home");
  const [chatSubject, setChatSubject] = useState("");
  const [chatLevel, setChatLevel] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<
  { sender: "user" | "bot"; text: string }[]
>([]);
  
  function handleHomeClick() {
    setActiveTab("home");
  }


  async function handleMessageSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        sender: "user",
        text: trimmedMessage,
      },
    ]);

    setMessage("");
    setIsSending(true);

    const apiBaseUrl =
      `http://${window.location.hostname}:8000`;

    try {
      const response = await fetch(
        `${apiBaseUrl}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message: trimmedMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ?? "AI 답변을 가져오지 못했습니다."
        );
      }

      if (data.should_close === true) {
        setNoticeMessage(data.answer ?? "대화를 종료했습니다.");
        setActiveTab("home");
        return;
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "bot",
          text: data.answer,
        },
      ]);
    } catch (error) {
      console.error("챗봇 응답 오류:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "bot",
          text:
            error instanceof Error
              ? error.message
              : "서버에 연결할 수 없습니다.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

async function handleApplicationClick(
  event: React.MouseEvent<HTMLAnchorElement>
) {
  event.preventDefault();
  setNoticeMessage("");

  const apiBaseUrl =
    `http://${window.location.hostname}:8000`;

  try {
    const response = await fetch(
      `${apiBaseUrl}/me`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    // 로그인하지 않은 경우
    if (!response.ok) {
      setNoticeMessage(
        data.detail ??
          "수강신청은 로그인 후 이용할 수 있습니다."
      );
      return; 
    }

    // 로그인했지만 학생 계정이 아닌 경우
    if (data.user?.role !== "student") {
      setNoticeMessage(
        "수강신청은 학생 계정만 이용할 수 있습니다."
      );
      return;
    }

    // 학생 로그인인 경우에만 이동
    router.push("/application");
  } catch (error) {
    console.error(
      "로그인 상태 확인 오류:",
      error
    );

    setNoticeMessage(
      "서버에 연결할 수 없습니다."
    );
  }
}

const handleChatClick = async () => {
  setNoticeMessage("");

  const apiBaseUrl =
    `http://${window.location.hostname}:8000`;

  try {
    const response = await fetch(
      `${apiBaseUrl}/chat/access`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    console.log(
      "챗봇 접근 확인:",
      response.status,
      data
    );

    if (!response.ok) {
      setNoticeMessage(
        data.detail ??
          "대화는 수강신청 학생만 이용할 수 있습니다."
      );

      return;
    }

    setChatSubject(data.subject);
    setChatLevel(data.class_name);

    setMessages((previousMessages) => {
      if (previousMessages.length > 0) {
        return previousMessages;
      }

      return [
        {
          sender: "bot",
          text:
            data.greeting ??
            `${data.subject} 학습 AI 상담사입니다. 무엇이 궁금한가요?`,
        },
      ];
    });

    // 권한 검사에 성공한 뒤 대화 탭 열기
    setActiveTab("chat");
  } catch (error) {
    console.error(
      "챗봇 접근 확인 오류:",
      error
    );

    setNoticeMessage(
      "서버에 연결할 수 없습니다."
    );
  }
};




  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <section className="relative mb-3 grid h-[520px] w-[380px] grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl">
          {/* 챗봇 헤더 */}
          <header className="flex items-center gap-2 bg-blue-600 px-4 py-4 text-white">
            <Image
              src="/j-academy-logo-chat-header-v2.png"
              alt="제이 외국어 온라인 학원 로고"
              width={44}
              height={44}
              className="block h-11 w-11 shrink-0 object-contain"
            />

            <h2 className="whitespace-nowrap text-base font-bold">
              제이 외국어 온라인 학원
            </h2>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="챗봇 닫기"
              className="absolute right-3 top-3 border-0 bg-transparent p-0"
            >
              <Image
                src="/images/chatbot_close.png"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </button>
          </header>

          {/* 홈 또는 대화 화면 */}
          {activeTab === "home" ? (
            /* 챗봇 홈 화면 */
            <div className="h-full min-h-0 bg-slate-50 p-4">
              <div className="grid h-full w-full grid-rows-[auto_1fr_auto_auto] rounded-2xl bg-white p-5 shadow-sm">
                {/* 학습 도우미 소개 */}
                <div className="flex items-center gap-3">
                  <Image
                    src="/j-academy-logo-chat-body.png"
                    alt="제이 학습 도우미 로고"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      제이 학습 도우미
                    </h3>

                    <p className="mt-1 text-xs text-slate-600">
                      안녕하세요. 무엇을 도와드릴까요?
                    </p>
                  </div>
                </div>

                <div className="self-end space-y-4 pb-4">
                  <a
                    href="https://map.naver.com/p/search/강남역%201번%20출구"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-blue-600"
                  >
                    <p className="font-semibold">
                      • 학원 안내 및 위치
                    </p>

                    <p className="ml-4 mt-1 text-xs font-normal text-slate-500">
                      강남역 1번 출구에서 찾아오는 길을 확인하세요.
                    </p>
                  </a>

                  <Link
                    href="/application"
                    onClick={handleApplicationClick}
                    className="block font-semibold hover:text-blue-600"
                  >
                    • 외국어·수준별 수강신청
                  </Link>

                  <p className="ml-4 mt-1 text-xs font-normal text-slate-500">
                    원하는 외국어와 학습 수준을 선택해 신청하세요.
                  </p>

                  {noticeMessage && (
                    <div className="mt-3 rounded-lg bg-amber-100 px-3 py-2 text-xs font-medium text-amber-800">
                      {noticeMessage}
                    </div>
                  )}
                </div>

                {/* 운영시간 */}
                <div className="mb-4 border-t border-slate-200 pt-3">
                  <p className="text-center text-xs font-medium text-green-600">
                    AI 학습 상담사 운영시간: 24시간
                  </p>
                </div>

                {/* 상담 시작 버튼 */}
                <button
                  type="button"
                  onClick={handleChatClick}
                  className="w-full rounded-xl bg-green-400 px-4 py-3 text-base font-bold text-slate-900"
                >
                  학습 상담 받기
                </button>
              </div>
            </div>
          ) : (
            /* 대화 화면 */
            <div className="grid min-h-0 grid-rows-[auto_1fr_auto] bg-slate-100">
              <div className="border-b border-slate-200 bg-white px-4 py-2">
                <p className="text-sm font-semibold text-slate-800">
                  {chatSubject} 학습 상담
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  현재 학습 수준: {chatLevel}
                </p>
              </div>

              {/* 메시지 목록 */}
              <div className="space-y-3 overflow-y-auto p-4">
                {messages.map((chatMessage, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      chatMessage.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <p
                      className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-5 ${
                        chatMessage.sender === "user"
                          ? "rounded-br-sm bg-blue-600 text-white"
                          : "rounded-tl-sm bg-white text-slate-700 shadow-sm"
                      }`}
                    >
                      {chatMessage.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* 메시지 입력 Form */}
              <form
                onSubmit={handleMessageSubmit}
                className="flex items-end gap-2 border-t border-slate-200 bg-white p-3"
              >
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="질문을 입력하세요"
                  rows={1}
                  maxLength={500}
                  disabled={isSending}
                  className="max-h-24 min-h-10 min-w-0 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={!message.trim() || isSending}
                  className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSending ? "전송 중" : "전송"}
                </button>
              </form>
            </div>
          )}

          {/* 하단 메뉴 */}
          <nav className="grid grid-cols-2 border-t border-slate-200 bg-white">
            <button
              type="button"
              onClick={handleHomeClick}
              className={`py-3 text-sm font-semibold ${
                activeTab === "home"
                  ? "text-blue-600"
                  : "text-slate-500"
              }`}
            >
              홈
            </button>

            <button
              type="button"
              onClick={handleChatClick}
              className={`border-l border-slate-200 py-3 text-sm font-semibold ${
                activeTab === "chat"
                  ? "text-blue-600"
                  : "text-slate-500"
              }`}
            >
              대화
            </button>
          </nav>
        </section>
      )}

      {/* 챗봇 열기 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="챗봇 열기 또는 닫기"
      >
        <Image
          src="/images/chatbot.png"
          alt="챗봇"
          width={105}
          height={105}
          className="h-[105px] w-[105px] object-contain"
          priority
        />
      </button>
    </div>
  );
}  
