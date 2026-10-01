"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("direct");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const router = useRouter();
  const username =
    emailId.trim() && emailDomain.trim()
      ? `${emailId.trim()}@${emailDomain.trim()}`
      : "";

    const handleDomainSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDomain(value);

    if (value === "direct") {
      setEmailDomain("");
    } else {
      setEmailDomain(value);
    }
  };    

  const isFormValid =
    username.length > 0 && password.length > 0;

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

    const response = await fetch(
      `${apiBaseUrl}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("access_token", data.access_token);
    sessionStorage.setItem(
      "displayUser",
      JSON.stringify({
        name: data.user.name,
        role: data.user.role,
      })
    );

    setPassword("");
    router.replace("/");
  } else {
    alert(data.detail ?? "아이디 또는 비밀번호가 올바르지 않습니다.");
  }
  
  console.log(data); 
}

  async function handleLogout() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;
    localStorage.removeItem("access_token");

    await fetch(`${apiBaseUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });

    setIsLoggedIn(false);
    setEmailId("");
    setEmailDomain("");
    setSelectedDomain("direct");
    setUserName("");
    setUserRole("");
    setPassword("");
  }


function handleApplicationClick(
  event: React.MouseEvent<HTMLAnchorElement>
) {
  if (!isLoggedIn) {
    event.preventDefault();
    alert("로그인 후 이용해 주세요.");
    return;
  }

  if (userRole !== "student") {
    event.preventDefault();
    alert("수강신청은 학생 계정만 이용할 수 있습니다.");
  }
}

  return (
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-12 font-sans overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[1000px] -translate-x-1/2 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/80 to-transparent" />
          <div className="absolute left-1/4 top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 mb-8 flex flex-col items-center justify-center gap-3">
          <Link
            href="/"
            className="mt-3 flex items-center justify-center gap-2 sm:gap-3 transition-opacity hover:opacity-80"
          >
            <Image
              src="/j-academy-logo-web.png"
              alt="제이 외국어 온라인 학원 로고"
              width={48}
              height={48}
              className="h-8 w-8 sm:h-12 sm:w-12 object-contain shrink-0"
              priority
            />

            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold leading-tight text-slate-900 whitespace-nowrap">
              제이 외국어 온라인 학원
            </h1>
          </Link>
        </div>

        <section className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-10">
          {isLoggedIn ? (
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {userName} <span className="text-lg font-medium text-slate-600">{userRole === "manager" ? "관리자님" : "회원님"}</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">환영합니다. 오늘도 즐거운 학습 되세요!</p>
              <div className="flex w-full justify-center">
                <div className="w-full">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-8 w-full rounded-xl bg-slate-800 px-4 py-3.5 font-semibold text-white transition-colors hover:bg-slate-900 active:scale-[0.98]"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-800">로그인</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  아이디와 비밀번호를 입력해 주세요.
                </p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email-id" className="text-sm font-semibold text-slate-700">
                    아이디 <span className="text-blue-600">*</span>
                  </label>
                  <div className="flex w-full items-center gap-1.5">
                    <input
                      id="email-id"
                      type="text"
                      value={emailId}
                      onChange={(e) => setEmailId(e.target.value.trim())}
                      placeholder="아이디"
                      className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-3 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                    <span className="shrink-0 text-slate-400">@</span>
                    <input
                      type="text"
                      value={emailDomain}
                      onChange={(e) => {
                        setEmailDomain(e.target.value.trim());
                        if (selectedDomain !== "direct") {
                          setSelectedDomain("direct");
                        }
                      }}
                      placeholder="도메인"
                      className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-3 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                    <select
                      value={selectedDomain}
                      onChange={handleDomainSelect}
                      className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-2 text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="direct">직접 입력</option>
                      <option value="naver.com">naver.com</option>
                      <option value="gmail.com">gmail.com</option>
                      <option value="daum.net">daum.net</option>
                      <option value="kakao.com">kakao.com</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    비밀번호 <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      placeholder="비밀번호를 입력하세요"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                  </div>
                </div>

                <div className="flex w-full justify-center">
                  <div className="w-full">
                    <button
                      className={`group mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-lg font-bold transition-all duration-200 ${
                        isFormValid
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98]"
                          : "cursor-not-allowed bg-slate-100 text-slate-400"
                      }`}
                      type="submit"
                      disabled={!isFormValid}
                    >
                      <span>로그인</span>
                      <svg
                        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex w-full justify-center">
                  <div className="mt-2 flex w-full items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-slate-500 whitespace-nowrap">
                    <Link href="/register_agree" className="text-blue-600 transition-colors hover:text-blue-800">
                      회원가입
                    </Link>
                    <div className="h-3 sm:h-4 w-px bg-slate-300"></div>
                    <Link href="/find_id" className="transition-colors hover:text-slate-800">
                      아이디 찾기
                    </Link>
                    <div className="h-3 sm:h-4 w-px bg-slate-300"></div>
                    <Link href="/find_pw" className="transition-colors hover:text-slate-800">
                      비밀번호 찾기
                    </Link>
                  </div>
                </div>
              </form>
            </>
          )}
        </section>

        <div className="relative z-10 mt-6 w-full max-w-md pl-2">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
          >
            <svg className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
      </main>
    );
  }

