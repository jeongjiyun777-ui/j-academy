'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";


const PageHeader = () => (
  <Link 
    href="/" 
    className="group inline-flex items-center gap-4 transition-opacity hover:opacity-80"
  >
    <div className="relative flex items-center justify-center">
      <Image
        src="/j-academy-logo-web.png"
        alt="제이 외국어 온라인 학원 로고"
        width={48}
        height={48}
        priority
      />
    </div>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
      제이 외국어 온라인 학원
    </h1>
  </Link>
);

interface ReviewCardProps {
  name: string;
  subject: string;
  review: string;
  delay: number;
}

const ReviewCard = ({ name, subject, review, delay }: ReviewCardProps) => (
  <motion.div 
    initial={{ opacity: 1, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    <section className="relative flex min-h-64 flex-col gap-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md md:flex-row md:p-8">      
      <div className="grid w-full content-start gap-5 border-b border-slate-100 pb-6 md:w-52 md:shrink-0 md:border-b-0 md:border-r md:pb-0 md:pr-8">
        <div className="flex justify-center gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        
        <div className="group relative mx-auto aspect-square w-full max-w-[160px] overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src="/images/students/student.png"
            alt={`${name} 학생`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <h2 className="text-center text-xl font-bold tracking-tight text-slate-900">
          {name}
        </h2>
      </div>

      <div className="relative flex flex-1 flex-col">
        <div className="absolute right-0 top-0 text-slate-50">
          <svg className="h-32 w-32 -translate-y-4 translate-x-4" fill="currentColor" viewBox="0 0 32 32">
            <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2h2V8h-2zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2h2V8h-2z" />
          </svg>
        </div>

        <div className="relative z-10 grid flex-1 grid-rows-[auto_1fr]">
          <div className="grid gap-2 border-b border-slate-100 pb-5">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">선택한 과목</h3>
            <p className="text-xl font-bold text-blue-600">{subject}</p>
          </div>
          
          <div className="grid content-start gap-4 pt-5">
            <h3 className="text-sm font-semibold text-slate-900">수강평</h3>
            <p className="break-keep text-lg font-medium leading-relaxed text-slate-700">
              "{review}"
            </p>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

const BackButton = () => (
  <div className="mt-12">
    <Link
      href="/"
      className="group inline-flex items-center gap-2 text-base font-semibold text-slate-500 transition-colors hover:text-blue-600"
    >
      <svg 
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" 
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
);


const REVIEW_DATA = [
  {
    name: "김**",
    subject: "영어",
    review: "기초 문법부터 차근차근 설명해 주셔서 영어에 대한 자신감이 생겼습니다.",
    delay: 0.3
  },
  {
    name: "박**",
    subject: "중국어",
    review: "발음과 성조를 반복해서 연습하면서 중국어를 말하는 부담이 줄었습니다.",
    delay: 0.5
  },
  {
    name: "이**",
    subject: "일본어",
    review: "어려웠던 일본어 문법을 쉽게 설명해 주셔서 학습 내용을 이해하는 데 도움이 되었습니다.",
    delay: 0.7
  },
  {
    name: "정**",
    subject: "스페인어",
    review: "실생활에서 활용할 수 있는 표현을 중심으로 배워 스페인어 회화가 재미있어졌습니다.",
    delay: 0.9
  }
];

export default function ManagePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-5xl">
        
        <div className="mb-10 flex flex-col items-start gap-8">
          <PageHeader />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            학생 수강평
          </h1>
        </div>

        <div className="grid gap-6">
          {REVIEW_DATA.map((data, index) => (
            <ReviewCard
              key={index}
              name={data.name}
              subject={data.subject}
              review={data.review}
              delay={data.delay}
            />
          ))}
        </div>

        <BackButton />
      </div>
    </main>
  );
}
