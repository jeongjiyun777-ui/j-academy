'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PageHeader = () => (
  <Link 
    href="/" 
    className="group inline-flex items-center gap-4 transition-opacity hover:opacity-80"
  >
    <div className="mx-auto max-w-6xl">
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

interface InfoCardProps {
  title: string;
  subtitle: string;
  dotColor: string;
  children: React.ReactNode;
}

const InfoCard = ({ title, subtitle, dotColor, children }: InfoCardProps) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
      <div className="flex items-center gap-2.5">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">
          {title}
        </h3>
      </div>
      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        {subtitle}
      </span>
    </div>
    <div className="mt-4">
      {children}
    </div>
  </div>
);

const TeacherSidebar = () => (
  <motion.div
    initial={{ opacity: 1, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    className="flex w-full flex-col gap-6 md:w-[340px] md:shrink-0"
  >
    <div className="group relative overflow-hidden rounded-3xl bg-slate-100 shadow-sm">
      <Image
        src="/images/teachers/japanese-teacher.png"
        alt="일본어 선생님"
        width={340}
        height={425}
        className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>

    <InfoCard title="주요 경력" subtitle="CAREER" dotColor="bg-blue-500">
      <ul className="space-y-4 text-xs leading-relaxed text-slate-600">
        <li className="flex gap-3">
          <span className="font-medium text-slate-400">前)</span>
          <span>도쿄 소재 어학원 일본어 강사 <span className="text-slate-400">(2년)</span></span>
        </li>
        <li className="flex gap-3">
          <span className="font-medium text-slate-400">前)</span>
          <span>한일 교류 프로그램 언어·문화 코디네이터 <span className="text-slate-400">(1년)</span></span>
        </li>
        <li className="flex gap-3 rounded-lg bg-blue-50/50 p-3 text-blue-900">
          <span className="font-semibold text-blue-600">現)</span>
          <div>
            <span className="font-semibold text-slate-900">제이 외국어 온라인학원 대표 강사</span>
            <p className="mt-1 text-[11px] text-blue-600/80">JLPT 단기 합격반 & EJU 일본어</p>
          </div>
        </li>
      </ul>
    </InfoCard>

    <InfoCard title="학력 및 전공" subtitle="EDUCATION" dotColor="bg-indigo-500">
      <div className="space-y-1 text-xs">
        <p className="font-semibold text-slate-800">Waseda University</p>
        <p className="text-slate-600">교육학부 일본어교육전공 학사</p>
        <p className="text-[11px] text-slate-400 font-mono">(B.A. in Japanese Language Education)</p>
      </div>
    </InfoCard>
  </motion.div>
);

const TeacherPhilosophy = () => (
  <motion.div
    initial={{ opacity: 1, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    className="relative flex flex-1 flex-col justify-start rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 sm:p-12 lg:p-16"
  >
    <div className="pointer-events-none absolute left-6 top-4 select-none font-serif text-[80px] leading-none text-blue-100/60 sm:left-10 sm:top-6">
      “
    </div>

    <div className="relative z-10">
      <div className="space-y-2">
        <span className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
          Philosophy & Vision
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          사토 히마리 선생님
        </h2>
      </div>

      <blockquote className="mt-10 space-y-8">
        <p
          lang="ja"
          className="font-serif text-xl leading-loose text-slate-700 md:text-[22px] md:leading-loose"
        >
          日本語の勉強が楽しくなるように、基礎から丁寧に<br />
          サポートします。私と一緒に一歩ずつ着実に<br />
          ステップアップしていきましょう！
        </p>

        <div className="h-px w-12 bg-slate-200" />

        <p className="break-keep text-base font-normal leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
          일본어 공부가 매일 기다려지고 즐거워질 수 있도록 기초부터 친절하고 다정하게 지도해 드리겠습니다. 
          저와 함께 한 걸음씩 확실하게 목표를 달성해 봐요!
        </p>
      </blockquote>
    </div>
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

export default function EnglishTeacherProfilePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-6xl">
        <PageHeader />
        <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <TeacherSidebar />
          <TeacherPhilosophy />
        </div>

        <BackButton />
      </div>
    </main>
  );
}
