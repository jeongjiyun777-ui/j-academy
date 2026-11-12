"use client";

import { useState } from "react";
import { REVIEW_DATA } from "./reviewData";

const buttonClass =
  "grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-xl text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export default function ReviewCarousel() {
  const [index, setIndex] = useState(0);
  const total = REVIEW_DATA.length;
  const { name, subject, review } = REVIEW_DATA[index];

  function move(step: number) {
    setIndex((current) => (current + step + total) % total);
  }

  return (
    <div className="mt-6">
      <article
        aria-live="polite"
        aria-atomic="true"
        className="grid min-h-52 content-start gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/60 p-5 shadow-sm sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
            {subject}
          </span>
          <span role="img" aria-label="별점 5점 만점에 5점" className="tracking-wider text-amber-600">
            ★★★★★
          </span>
        </div>
        <blockquote className="break-keep text-lg leading-relaxed text-slate-800">
          “{review}”
        </blockquote>
        <p className="text-sm font-semibold text-slate-600">{name} 수강생</p>
      </article>

      <div className="mt-4 flex items-center justify-end gap-3">
        <button type="button" aria-label="이전 수강평" className={buttonClass} onClick={() => move(-1)}>
          <span aria-hidden="true">←</span>
        </button>
        <span className="min-w-12 text-center text-sm tabular-nums text-slate-600">
          {index + 1} / {total}
        </span>
        <button type="button" aria-label="다음 수강평" className={buttonClass} onClick={() => move(1)}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
