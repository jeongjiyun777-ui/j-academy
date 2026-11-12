"use client";

import { useState } from "react";
import { REVIEW_DATA } from "./reviewData";

const total = REVIEW_DATA.length;
const arrowClass =
  "pointer-events-auto grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-md hover:bg-pink-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 sm:size-12";

function ReviewCard({ index, active }: { index: number; active: boolean }) {
  const { name, subject, review } = REVIEW_DATA[index];

  return (
    <article
      aria-hidden={!active}
      className={`flex min-h-[25rem] w-full flex-col rounded-3xl border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-violet-50 p-6 shadow-sm sm:min-h-[32rem] sm:p-9 ${active ? "" : "opacity-45"}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-9 fill-rose-600">
        <path d="M10 4v3a4 4 0 0 0-4 4h4v9H1v-9a7 7 0 0 1 9-7Zm13 0v3a4 4 0 0 0-4 4h4v9h-9v-9a7 7 0 0 1 9-7Z" />
      </svg>
      <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">{subject} 수강평</h3>
      <p className="mt-2 text-sm font-semibold text-slate-600">{name} 수강생</p>
      <span role="img" aria-label="별점 5점 만점에 5점" className="mt-3 tracking-widest text-amber-700">★★★★★</span>
      <blockquote className="mt-5 break-keep text-lg leading-relaxed text-slate-800">{review}</blockquote>
      <div className="mt-auto flex flex-wrap gap-2 pt-8 text-sm font-semibold text-rose-800">
        <span className="rounded-full bg-rose-100 px-3 py-1">#{subject}</span>
        <span className="rounded-full bg-rose-100 px-3 py-1">#수강평</span>
      </div>
    </article>
  );
}

export default function ReviewCarousel() {
  const [index, setIndex] = useState(0);
  const previous = (index + total - 1) % total;
  const next = (index + 1) % total;

  function move(step: number) {
    setIndex((current) => (current + step + total) % total);
  }

  return (
    <div className="mt-7 overflow-hidden px-4 pb-2">
      <div className="relative mx-auto max-w-[25rem]">
        <div className="absolute inset-y-0 right-full mr-4 hidden w-full sm:block">
          <ReviewCard index={previous} active={false} />
        </div>
        <div aria-live="polite" aria-atomic="true">
          <ReviewCard index={index} active />
        </div>
        <div className="absolute inset-y-0 left-full ml-4 hidden w-full sm:block">
          <ReviewCard index={next} active={false} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between sm:-inset-x-6">
          <button type="button" aria-label="이전 수강평" className={arrowClass + " -translate-x-1/4 sm:translate-x-0"} onClick={() => move(-1)}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>
          <button type="button" aria-label="다음 수강평" className={arrowClass + " translate-x-1/4 sm:translate-x-0"} onClick={() => move(1)}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <p className="mt-4 text-center text-sm tabular-nums text-slate-600">{index + 1} / {total}</p>
    </div>
  );
}
