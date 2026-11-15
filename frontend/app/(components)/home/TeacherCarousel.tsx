"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const teachers = [
  {
    language: "영어", name: "맥칸지", image: "english-teacher.png",
    university: "University of Pennsylvania", degree: "영어교육학 석사",
    career: ["제이 온라인학원 대표 강사", "대형 어학원 토익·스피킹 대표 강사 (4년)", "외국계 IT 기업 비즈니스 영어 전담 출강 (2년)"],
  },
  {
    language: "스페인어", name: "알바레즈", image: "spanish-teacher.png",
    university: "Universidad Complutense de Madrid", degree: "스페인어문학 학사",
    career: ["제이 외국어 온라인학원 대표 강사", "마드리드 주립 어학원 스페인어(ELE) 튜터 (2년)", "외교관 및 기업 임원 대상 스페인어 출강 (2년)"],
  },
  {
    language: "일본어", name: "사토 히마리", image: "japanese-teacher.png",
    university: "Waseda University", degree: "교육학부 일본어교육전공 학사",
    career: ["제이 외국어 온라인학원 대표 강사", "도쿄 소재 어학원 일본어 강사 (2년)", "한일 교류 프로그램 언어·문화 코디네이터 (1년)"],
  },
  {
    language: "중국어", name: "장위통", image: "chinese-teacher.png",
    university: "Beijing University", degree: "대외한어과 학사",
    career: ["제이 온라인학원 대표 강사", "베이징 소재 어학원 외국인 전담 중국어 강사 (2년)", "글로벌 기업 임원진 비즈니스 중국어 트레이너 (2년)"],
  },
];

const educationPath = "m2 9 10-5 10 5-10 5-10-5Zm4 2v6c3 3 9 3 12 0v-6m4-2v8";
const careerPath = "M9 7V5h6v2M4 7h16v13H4zM4 12c5 3 11 3 16 0m-8 1v3";
const buttonClass = "grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

function CardIcon({ path }: { path: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
      <path d={path} />
    </svg>
  );
}

export default function TeacherCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (teachers.length < 2) return;

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % teachers.length);
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [active]);

  function move(offset: number) {
    setActive((current) => (current + offset + teachers.length) % teachers.length);
  }

  return (
    <div className="mx-auto mt-7 max-w-4xl px-4 sm:px-8">
      <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:max-w-none">
        <div
          className="flex w-full transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {teachers.map((teacher, index) => (
            <article key={teacher.language} aria-hidden={index !== active} className="grid w-full shrink-0 bg-white sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="flex items-center justify-center px-6 pt-6 sm:p-8">
                <div className="aspect-square w-full max-w-52 overflow-hidden rounded-full bg-slate-100 ring-4 ring-blue-50">
                  <Image
                    src={"/images/teachers/" + teacher.image}
                    alt={teacher.name + " 선생님"}
                    width={340}
                    height={425}
                    sizes="208px"
                    className="block h-full w-full rounded-full object-cover object-top"
                  />
                </div>
              </div>
              <div className="space-y-5 px-[clamp(1.25rem,4vw,2.25rem)] py-6 sm:py-8">
                <div>
                  <h1 className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{teacher.language}</h1>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{teacher.name} 선생님</h3>
                </div>
                <div className="flex gap-3 rounded-2xl bg-blue-50 px-4 py-3">
                  <span className="mt-0.5 text-blue-700"><CardIcon path={educationPath} /></span>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">학력</h4>
                    <p className="mt-1 text-sm font-medium text-slate-900">{teacher.university}</p>
                    <p className="text-sm text-slate-600">{teacher.degree}</p>
                  </div>
                </div>
                <div className="px-1">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900"><CardIcon path={careerPath} />주요 경력</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
                    {teacher.career.map((entry) => <li key={entry}>{entry}</li>)}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-4">
        <button type="button" aria-label="이전 선생님" className={buttonClass} onClick={() => move(-1)}><CardIcon path="m15 18-6-6 6-6" /></button>
        <span className="text-sm tabular-nums text-slate-600">{active + 1} / {teachers.length}</span>
        <button type="button" aria-label="다음 선생님" className={buttonClass} onClick={() => move(1)}><CardIcon path="m9 18 6-6-6-6" /></button>
      </div>
    </div>
  );
}
