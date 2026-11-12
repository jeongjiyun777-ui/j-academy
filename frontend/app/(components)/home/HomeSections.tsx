import Image from "next/image";
import Link from "next/link";
import ReviewCarousel from "./ReviewCarousel";

const sectionClass =
  "w-full scroll-mt-64 rounded-2xl border border-slate-300 bg-white px-6 py-10 sm:px-10 md:scroll-mt-44 lg:scroll-mt-36";

export default function HomeSections() {
  return (
    <div className="grid w-full gap-5 px-4 pb-6 sm:px-6 lg:px-8">
      <section
        id="academy"
        aria-label="학원소개"
        className="relative -mx-4 overflow-hidden scroll-mt-64 border-b border-slate-300 sm:-mx-6 md:scroll-mt-44 lg:-mx-8 lg:scroll-mt-36"
      >
        <Image
          src="/J-academy1.png"
          alt="J-academy"
          width={1672}
          height={941}
          sizes="100vw"
          className="block h-auto w-full"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-4 w-full fill-slate-50 sm:h-8"
        >
          <path d="M0 48V30C290 4 510 4 760 24C1040 48 1240 42 1440 12V48Z" />
        </svg>
      </section>

      <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-64 border-y border-slate-200 bg-white py-10 -mx-4 sm:-mx-6 md:scroll-mt-44 lg:-mx-8 lg:scroll-mt-36">
        <h2 id="reviews-heading" className="flex items-center justify-center gap-3 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-[-0.05em] text-slate-900">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-blue-600 ring-1 ring-inset ring-sky-100">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <path d="M7 17.5 4 20v-5.2A7 7 0 0 1 4 6.5C5.8 4.8 8.4 4 12 4c5.1 0 8 2.6 8 6.5S17.1 17 12 17H8.5L7 17.5Z" />
              <path d="M8 9h8m-8 3h5" />
            </svg>
          </span>
          수강평
        </h2>
        <ReviewCarousel />
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
