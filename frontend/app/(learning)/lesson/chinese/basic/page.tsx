"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";

type Application = {
  subject: string;
  class_name: string;
};

export default function LessonPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [noticeMessage, setNoticeMessage] = useState("");

  useEffect(() => {
    async function getLessonAccess() {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;
      const token = localStorage.getItem("access_token");

      try {
        const response = await fetch(`${apiBaseUrl}/lesson/access?subject=chinese`, {
          method: "GET",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await response.json();

        if (!response.ok) {
          setNoticeMessage(
            data.detail ?? "수강신청 완료 후 강의를 이용할 수 있습니다."
          );
          return;
        }

        setApplication(data.application);
      } catch (error) {
        console.error("강의 권한 확인 오류:", error);
        setNoticeMessage("서버에 연결할 수 없습니다.");
      }
    }

    getLessonAccess();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      
      <header className="bg-slate-100 p-6">
        <div className="mb-8 flex flex-col items-center justify-center gap-2 text-center sm:mb-12">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 sm:gap-3 transition-opacity hover:opacity-80"
          >
            <Image
              src="/j-academy-logo-web.png"
              alt="제이 외국어 온라인 학원 로고"
              width={48}
              height={48}
              className="h-8 w-8 sm:h-12 sm:w-12 shrink-0 object-contain"
              priority
            />
            <h1 className="text-xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl whitespace-nowrap">
              제이 외국어 온라인 학원
            </h1>
          </Link>
          <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
            중국어 기초 강좌
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        {noticeMessage ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-lg font-semibold text-slate-700">{noticeMessage}</p>
          </div>
        ) : (
          <section className="w-full">
            <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/10">
              <iframe
                className="aspect-video w-full rounded-lg"
                src="https://www.youtube-nocookie.com/embed/eszvPxy7-60"
                title="중국어 기초 강의"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="mt-4 flex items-center justify-between px-1 text-sm text-slate-500">
              <p className="font-medium text-slate-700">
                출처: YouTube · 중국어 업 chinese up
              </p>
            </div>
          </section>
        )}


        <div className="mt-8 w-full pl-2">
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
        
      </main>
    </div>
  );
}

