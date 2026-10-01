"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ChatApplication = {
  subject: string;
  class_name: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [noticeMessage, setNoticeMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "chat">("home");
  const [chatSubject, setChatSubject] = useState("");
  const [chatLevel, setChatLevel] = useState("");
  const [greeting, setGreeting] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatApplications, setChatApplications] =
  useState<ChatApplication[]>([]);

  function handleHomeClick() {
    setActiveTab("home");
  }

  function showLoginRequired() {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("displayUser");
    setIsAuthenticated(false);
    setChatApplications([]);
    setChatSubject("");
    setChatLevel("");
    setGreeting("");
    setMessages([]);
    setMessage("");
    setActiveTab("home");
    setNoticeMessage("로그인 후 이용해 주세요.");
  }

  async function handleMessageSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      showLoginRequired();
      return;
    }

    const trimmedMessage = message.trim();

    if (!chatSubject) {
      setNoticeMessage(
        "상담할 과목을 먼저 선택해 주세요."
      );
      return;
    }

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

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

    try {
      const response = await fetch(
        `${apiBaseUrl}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          credentials: "include",
          body: JSON.stringify({
            message: trimmedMessage,
            subject: chatSubject,
          }),
        }
      );

      if (response.status === 401) {
        showLoginRequired();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ??
            "AI 답변을 가져오지 못했습니다."
        );
      }

      if (data.should_close === true) {
        setNoticeMessage(
          data.answer ?? "대화를 종료했습니다."
        );
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

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;
    const token = localStorage.getItem("access_token");

    if (!token) {
      showLoginRequired();
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/me`, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (response.status === 401) {
        showLoginRequired();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setNoticeMessage(
          data.detail ?? "수강신청은 로그인 후 이용할 수 있습니다."
        );
        return;
      }

      if (data.user?.role !== "student") {
        setNoticeMessage(
          "수강신청은 학생 계정만 이용할 수 있습니다."
        );
        return;
      }

      router.push("/application");
    } catch (error) {
      console.error("로그인 상태 확인 오류:", error);
      setNoticeMessage("서버에 연결할 수 없습니다.");
    }
  }

  function handleChatSubjectSelect(
  application: ChatApplication
) {
  setChatSubject(application.subject);
  setChatLevel(application.class_name);
  setNoticeMessage("");

  setMessages((previousMessages) => [
    ...previousMessages,
    {
      sender: "bot",
      text:
        `${application.subject} ${application.class_name} ` +
        "상담을 선택하셨습니다. 궁금한 내용을 입력해 주세요.",
    },
  ]);
}

  const handleChatClick = async () => {
    setNoticeMessage("");

    const token = localStorage.getItem("access_token");
    const savedUser = sessionStorage.getItem("displayUser");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

    if (!token || !savedUser) {
      showLoginRequired();
      return;
    }

    let currentUser: { role?: string };

    try {
      currentUser = JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("displayUser");
      setIsAuthenticated(false);
      setNoticeMessage("로그인 정보가 올바르지 않습니다. 다시 로그인해 주세요.");
      return;
    }

    if (currentUser.role !== "student") {
      setIsAuthenticated(false);
      setNoticeMessage(
        "학생 계정만 AI 학습 상담을 이용할 수 있습니다."
      );
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/chat/access`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        showLoginRequired();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setIsAuthenticated(false);

        if (response.status === 403) {
          setNoticeMessage(
            data.detail ??
              "수강 승인 완료 학생만 AI 학습 상담을 이용할 수 있습니다."
          );
          return;
        }

        if (response.status === 404) {
          setNoticeMessage(
            data.detail ?? "학생 정보를 찾을 수 없습니다."
          );
          return;
        }

        setNoticeMessage(
          data.detail ?? "AI 학습 상담을 이용할 수 없습니다."
        );
        return;
      }

      setIsAuthenticated(true);
      setChatApplications(data.applications);
      setChatSubject("");
      setChatLevel("");
      setGreeting(data.greeting);

      setMessages([
        {
          sender: "bot",
          text: data.greeting,
        },
      ]);

      setActiveTab("chat");
    } catch (error) {
      console.error("챗봇 접근 확인 오류:", error);
      setIsAuthenticated(false);
      setNoticeMessage("서버에 연결할 수 없습니다.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const trimmedMessage = message.trim();
      if (!trimmedMessage || isSending) return;

      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };



  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section className="relative mb-3 grid h-[480px] max-h-[82vh] w-[calc(100vw-2rem)] max-w-[360px] grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl sm:w-[350px]">
          <header className="flex items-center gap-2 bg-blue-600 px-3.5 py-3 text-white">
            <Image
              src="/j-academy-logo-chat-header-v2.png"
              alt="제이 외국어 온라인 학원 로고"
              width={34}
              height={34}
              className="block h-[34px] w-[34px] shrink-0 object-contain"
            />

            <h2 className="whitespace-nowrap text-sm font-bold">
              제이 외국어 온라인 학원
            </h2>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setNoticeMessage("");
              }}
              aria-label="챗봇 닫기"
              className="absolute right-3 top-3 border-0 bg-transparent p-0"
            >
              <Image
                src="/images/chatbot_close.png"
                alt=""
                width={18}
                height={18}
                className="h-4.5 w-4.5"
              />
            </button>
          </header>

          {activeTab === "home" ? (
            <div className="h-full min-h-0 bg-slate-50 p-3 sm:p-3.5">
              <div className="grid h-full w-full grid-rows-[auto_1fr_auto_auto] rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/j-academy-logo-chat-body.png"
                    alt="제이 학습 도우미 로고"
                    width={34}
                    height={34}
                    className="h-8.5 w-8.5 object-contain"
                  />

                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      제이 학습 도우미
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-600">
                      안녕하세요. 무엇을 도와드릴까요?
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid self-center gap-3">
                  <a
                    href="https://map.naver.com/p/search/강남역%201번%20출구"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition-colors hover:border-blue-200 hover:bg-blue-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
                        <circle cx="12" cy="10" r="2" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold tracking-[0.02em] text-slate-800 group-hover:text-blue-700">
                        학원 안내 및 위치
                      </span>
                      <span className="mt-1 block text-xs leading-5 tracking-wide text-slate-500">
                        강남역 1번 출구에서 찾아오는 길을 확인하세요.
                      </span>
                    </span>
                  </a>

                  <Link
                    href="/application"
                    onClick={handleApplicationClick}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition-colors hover:border-blue-200 hover:bg-blue-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
                        <path d="M4 19h16" />
                        <path d="M8 7h8M8 11h6" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold tracking-[0.02em] text-slate-800 group-hover:text-blue-700">
                        외국어·수준별 수강신청
                      </span>
                      <span className="mt-1 block text-xs leading-5 tracking-wide text-slate-500">
                        원하는 외국어와 학습 수준을 선택해 신청하세요.
                      </span>
                    </span>
                  </Link>

                  {noticeMessage && (
                    <div className="mt-2 rounded-lg bg-amber-100 px-2.5 py-1.5 text-xs font-medium text-amber-800">
                      {noticeMessage}
                    </div>
                  )}
                </div>

                <div className="mb-3 border-t border-slate-200 pt-2.5">
                  <p className="text-center text-[11px] font-medium text-green-600">
                    AI 학습 상담사 운영시간: 24시간
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleChatClick}
                  className="w-full rounded-lg bg-green-400 px-3 py-2.5 text-sm font-bold text-slate-900 transition-colors hover:bg-green-500"
                >
                  학습 상담 받기
                </button>
              </div>
            </div>
          ) : (
            <div className="grid min-h-0 grid-rows-[auto_1fr_auto] bg-slate-100">
              <div className="flex items-center gap-2.5 border-b border-blue-100 bg-white px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path d="M12 3a7 7 0 0 0-7 7v2a3 3 0 0 0 3 3h1v-5H6v-1a6 6 0 1 1 12 0v1h-3v5h1a3 3 0 0 0 3-3v-2a7 7 0 0 0-7-7Z" />
                    <path d="M9 18c.7 1 1.7 1.5 3 1.5 1.1 0 2-.3 2.7-1" />
                  </svg>
                </span>
                <div>
                  <p className="text-[15px] font-extrabold tracking-[0.025em] text-slate-900">
                    제이 외국어 학습상담 AI봇
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-500">
                    맞춤형 학습 상담을 도와드려요
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 overflow-y-auto p-3">
                {messages.map((chatMessage, index) => (
                  <div key={index} className="space-y-2">
                    <div
                      className={`flex ${
                        chatMessage.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <p
                        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-xl px-3 py-2 text-xs leading-5 sm:text-sm ${
                          chatMessage.sender === "user"
                            ? "rounded-br-sm bg-blue-600 text-white"
                            : "rounded-tl-sm bg-white text-slate-700 shadow-sm"
                        }`}
                      >
                        {chatMessage.text}
                      </p>
                    </div>

                    {index === 0 &&
                      chatMessage.sender === "bot" &&
                      !chatSubject &&
                      chatApplications.length > 0 && (
                        <div className="ml-1 flex flex-wrap gap-2">
                          {chatApplications.map((application) => (
                            <button
                              key={`${application.subject}-${application.class_name}`}
                              type="button"
                              onClick={() =>
                                handleChatSubjectSelect(application)
                              }
                              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-bold tracking-[0.02em] text-blue-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-3.5 w-3.5"
                              >
                                <path d="m9 18 6-6-6-6" />
                              </svg>
                              {application.subject} {application.class_name}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleMessageSubmit}
                className="flex items-end gap-2 border-t border-slate-200 bg-white p-2.5"
              >
                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={
                    chatSubject
                      ? "질문을 입력하세요"
                      : "상담할 과목을 먼저 선택해 주세요"
                  }
                  rows={1}
                  maxLength={500}
                  disabled={!chatSubject || isSending}
                  className="max-h-20 min-h-9 min-w-0 flex-1 resize-none rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 sm:text-sm"
                />

                <button
                  type="submit"
                  disabled={
                    !chatSubject ||
                    !message.trim() ||
                    isSending
                  }
                  className="h-9 shrink-0 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-sm"
                >
                  {isSending ? "전송 중" : "전송"}
                </button>
              </form>
            </div>
          )}

          {/* Bottom Navigation */}
          <nav className="grid grid-cols-2 border-t border-slate-200 bg-white">
            <button
              type="button"
              onClick={handleHomeClick}
              className={`py-2.5 text-xs font-semibold sm:text-sm ${
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
              className={`border-l border-slate-200 py-2.5 text-xs font-semibold sm:text-sm ${
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

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setNoticeMessage("");
        }}
        aria-label="챗봇 열기 또는 닫기"
        className="block"
      >
        <Image
          src="/images/chatbot.png"
          alt="챗봇"
          width={76}
          height={76}
          className="h-16 w-16 object-contain sm:h-20 sm:w-20"
          priority
        />
      </button>
    </div>
  );
}


