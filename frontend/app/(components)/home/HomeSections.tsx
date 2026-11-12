"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const sectionClass =
  "scroll-mt-64 rounded-2xl border border-slate-200 bg-white px-6 py-10 sm:px-10 md:scroll-mt-44 lg:scroll-mt-36";

export default function HomeSections() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6">
      <section
        id="academy"
        aria-label="학원소개"
        className={`${sectionClass} flex flex-col gap-12 lg:flex-row lg:items-center`}
      >

        <div className="flex-1 space-y-12 lg:pr-8">
          <div className="flex-1 space-y-12 lg:pr-8">
            <div className="space-y-6">
              <p className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-blue-600 bg-blue-50 border border-blue-100 uppercase">
                학원소개
              </p>

              <motion.h1
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  ease: "easeOut" 
                }}
                className="font-serif text-3xl font-bold leading-[1.3] text-slate-900 md:text-4xl break-keep tracking-tight"
              >
                언어를 배운다는 것은 <br />
                더 넓은 세상을 만나는 일입니다.
              </motion.h1>

              <motion.p
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 0.5, 
                  ease: "easeOut" 
                }}
                className="max-w-md text-lg leading-relaxed text-slate-600 mt-4 tracking-[-0.02em] break-keep"
              >
                진도를 빼는 것보다 중요한 것은, 오늘 배운 한 문장을 내일 당장 내 입으로 말할 수 있게 만드는 것입니다.
              </motion.p>
            </div>

            <div className="flex items-center gap-4">
              <Image
                src="/j-academy-logo-web.png"
                alt="학원 로고"
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
              />
              <div className="border-l-2 border-slate-200 pl-4">
                <p className="font-semibold text-slate-900 tracking-tight">제이 외국어 온라인 학원</p>
                <p className="text-sm text-slate-500 tracking-tight">원장 정지윤</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-lg mx-auto lg:mx-0 space-y-4">
          <div className="group flex items-start gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <div>
                <motion.h3
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 0.6, 
                  ease: "easeOut" 
                }}
                className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700"
              >
                내 수준에서 시작
              </motion.h3>
              <motion.p
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 0.6, 
                  ease: "easeOut" 
                }}
                className="mt-1 text-sm leading-relaxed text-slate-500 break-keep"
              >
                알파벳부터 시작해도 괜찮습니다. 학생마다 다른 출발점을 존중하고 가장 알맞은 목표를 설정합니다.
              </motion.p>
            </div>
          </div>


          <div className="group flex items-start gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <div>
              <motion.h3
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 0.8, 
                  ease: "easeOut" 
                }}
                className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700"
              >
                진짜 말하는 연습
              </motion.h3>
              <motion.p
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 0.8, 
                  ease: "easeOut" 
                }}
                className="mt-1 text-sm leading-relaxed text-slate-500 break-keep"
              >
                눈으로만 보는 암기가 아닌, 입 밖으로 소리 내어 말하는 실전 활용 능력을 최우선으로 기릅니다.
              </motion.p>
            </div>
          </div>


          <div className="group flex items-start gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <div>
                <motion.h3
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 1.0, 
                  ease: "easeOut" 
                }}
                className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700"
              >
                24시간 AI 학습 상담
              </motion.h3>
              <motion.p
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 1.0, 
                  ease: "easeOut" 
                }}
                className="mt-1 text-sm leading-relaxed text-slate-500 break-keep"
              >
                학습 중 막히는 부분이 있다면, 언제든 질문하고 답변받을 수 있는 스마트 학습 환경을 지원합니다.
              </motion.p>
            </div>
          </div>

        </div>
      </section>

      <section id="reviews" aria-labelledby="reviews-heading" className={sectionClass}>
        <h2 id="reviews-heading" className="text-2xl font-bold tracking-tight text-slate-900">
          수강평
        </h2>
        <Link href="/reviews" className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
          수강평 전체 보기
        </Link>
      </section>

      <section id="notice" aria-labelledby="notice-heading" className={sectionClass}>
        <h2 id="notice-heading" className="text-2xl font-bold tracking-tight text-slate-900">
          공지·이벤트
        </h2>
        <Link href="/notice" className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
          공지·이벤트 전체 보기
        </Link>
      </section>
    </div>
  );
}
