"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";


export default function ApplicationPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [resultMessage, setResultMessage] = useState("");

async function handleApplication(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;
  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch(`${apiBaseUrl}/applications`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",

          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      credentials: "include",
      body: JSON.stringify({
        subject: selectedSubject,
        class_name: selectedClass,
      }),
    });

    const data = await response.json();

    if (response.status === 409) {
      alert(data.detail ?? "이미 신청한 과목과 반입니다.");
      return;
    }

    if (response.ok) {
      setResultMessage("수강신청이 접수되었습니다. 관리자 승인 후 강의를 이용할 수 있습니다.");
      setSelectedSubject("");
      setSelectedClass("");
    } else {
      setResultMessage(data.detail ?? "수강신청에 실패했습니다.");
    }
  } catch {
    setResultMessage("서버에 연결하지 못했습니다.");
  }
}

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mb-10 flex flex-col items-center justify-center gap-3">
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

        <div className="mx-auto mt-6 w-full max-w-xl rounded-xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-slate-900">
            수강 신청
          </h1>
          <p className="mt-2 text-slate-600">
            수강할 외국어와 반을 선택해 주세요.
          </p>

          <form className="mt-8" onSubmit={handleApplication}>
            <section>
              <label
                htmlFor="subject"
                className="text-sm font-semibold text-slate-700"
              >
                외국어 선택
              </label>
              <select
                id="subject"
                name="subject"
                value={selectedSubject}
                onChange={(event) => {
                  setSelectedSubject(event.target.value);
                  setSelectedClass(""); // 과목 변경 시 반 선택 초기화
                }}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
                required
              >
                <option value="">외국어를 선택해 주세요</option>
                <option value="영어">영어</option>
                <option value="스페인어">스페인어</option>
                <option value="일본어">일본어</option>
                <option value="중국어">중국어</option>
              </select>
            </section>

            {selectedSubject && (
              <section className="mt-8">
                <h2 className="text-sm font-semibold text-slate-700">{selectedSubject} 반 선택</h2>

                <div className="mt-3 flex items-center justify-between sm:justify-start gap-2 sm:gap-6">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm text-slate-700 whitespace-nowrap">
                    <input
                      type="radio"
                      name="class_level"
                      value="A반"
                      checked={selectedClass === "A반"} 
                      onChange={(event) => setSelectedClass(event.target.value)}
                      className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500"
                    />
                    <span>A반(초급)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm text-slate-700 whitespace-nowrap">
                    <input
                      type="radio"
                      name="class_level"
                      value="B반"
                      checked={selectedClass === "B반"} 
                      onChange={(event) => setSelectedClass(event.target.value)}
                      className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500"
                    />
                    <span>B반(중급)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm text-slate-700 whitespace-nowrap">
                    <input
                      type="radio"
                      name="class_level"
                      value="C반"
                      checked={selectedClass === "C반"} 
                      onChange={(event) => setSelectedClass(event.target.value)}
                      className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500"
                    />
                    <span>C반(고급)</span>
                  </label>
                </div>
              </section>
            )}
            
            <button
              type="submit"
              disabled={!selectedSubject || !selectedClass}
              className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              수강 신청하기
            </button>
          </form>

          {resultMessage && (
            <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-800">
              {resultMessage}
            </div>
          )}
        </div>

        <div className="mt-6 w-full max-w-xl pl-2">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-base font-semibold text-slate-500 transition-colors hover:text-blue-600"
          >
            <svg 
              className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2.5" 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

