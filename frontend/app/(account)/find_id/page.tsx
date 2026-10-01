"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function FindIdPage() {
  const [name, setName] = useState("");
  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [username, setUsername] = useState("");  
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [isFindSuccess, setIsFindSuccess] = useState(false);
  

  const isFormValid =
    name.trim().length > 0 &&
    phoneFirst.length === 3 &&
    phoneMiddle.length === 4 &&
    phoneLast.length === 4 &&
    birthYear.length === 4 &&
    birthMonth.length > 0 &&
    birthDay.length > 0;

  async function handleFindId(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

    const birthDate =
      `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`;

    const params = new URLSearchParams({
      name: name.trim(),
      phone: `${phoneFirst}${phoneMiddle}${phoneLast}`,
      birth_date: birthDate,
    });

    const response = await fetch(
      `${apiBaseUrl}/find-id?${params.toString()}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (response.ok) {
      setUsername(data.username);
      setResultMessage(`아이디는 ${data.username}입니다.`);
      setIsFindSuccess(true);
    } else {
      setResultMessage(
        data.detail ?? "일치하는 회원 정보를 찾지 못했습니다."
      );
      setIsFindSuccess(false);
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
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800">아이디 찾기</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              가입 시 등록한 이름, 전화번호, 생년월일을 입력해 주세요.
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleFindId}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-base font-semibold text-slate-700">
                이름 <span className="text-blue-600">*</span>
              </label>
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone-first" className="text-base font-semibold text-slate-700">
                전화번호 <span className="text-blue-600">*</span>
              </label>
              <div className="flex w-full items-center gap-2">
                <input
                  id="phone-first"
                  name="phone_first"
                  type="text"
                  inputMode="numeric"
                  placeholder="010"
                  minLength={3}
                  maxLength={3}
                  pattern="[0-9]{3}"
                  value={phoneFirst}
                  onChange={(e) => setPhoneFirst(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-20 rounded-xl border border-slate-200 bg-slate-50 py-3.5 text-center text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <span className="shrink-0 text-slate-400">-</span>
                <input
                  id="phone-middle"
                  name="phone_middle"
                  type="text"
                  inputMode="numeric"
                  placeholder="1234"
                  minLength={3}
                  maxLength={4}
                  pattern="[0-9]{3,4}"
                  value={phoneMiddle}
                  onChange={(e) => setPhoneMiddle(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3.5 text-center text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <span className="shrink-0 text-slate-400">-</span>
                <input
                  id="phone-last"
                  name="phone_last"
                  type="text"
                  inputMode="numeric"
                  placeholder="5678"
                  minLength={4}
                  maxLength={4}
                  pattern="[0-9]{4}"
                  value={phoneLast}
                  onChange={(e) => setPhoneLast(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3.5 text-center text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold text-slate-700">
                생년월일 <span className="text-blue-600">*</span>
              </label>
              <div className="flex w-full items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="YYYY"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value.replace(/[^0-9]/g, ""))} 
                  className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3.5 text-center text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <span className="shrink-0 text-base font-medium text-slate-500">년</span>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="MM"
                  value={birthMonth} 
                  onChange={(e) => setBirthMonth(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-20 rounded-xl border border-slate-200 bg-slate-50 py-3.5 text-center text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <span className="shrink-0 text-base font-medium text-slate-500">월</span>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="DD"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-20 rounded-xl border border-slate-200 bg-slate-50 py-3.5 text-center text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <span className="shrink-0 text-base font-medium text-slate-500">일</span>
              </div>
            </div>

            <button
              className={`group mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-lg font-bold transition-all duration-200 ${
                isFormValid
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98]"
                  : "cursor-not-allowed bg-slate-100 text-slate-400"
              }`}
              type="submit"
              disabled={!isFormValid}
            >
              <span>아이디 찾기</span>
              <svg
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {resultMessage && (
            <div className="mt-8 flex flex-col gap-6">
              <div
                className={`flex w-full items-center gap-3 rounded-xl p-5 ${
                  isFindSuccess
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                <svg className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isFindSuccess ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <p className="font-medium text-sm sm:text-base">{resultMessage}</p>
              </div>

              {isFindSuccess && (
                <Link
                  href="/login"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98]"
                >
                  <span>로그인하러 가기</span>
                  <svg
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              )}
            </div>
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

