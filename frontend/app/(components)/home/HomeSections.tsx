import { Nanum_Myeongjo } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import ReviewCarousel from "./ReviewCarousel";

const reviewTitleFont = Nanum_Myeongjo({ weight: "700", display: "swap", preload: false, fallback: ["Batang", "serif"] });

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
        <Image
          src="/j-academy2.png"
          alt="J-academy 두 번째 소개 배너"
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
        <div className="text-center">
          <svg aria-hidden="true" viewBox="0 0 112 40" className="mx-auto mb-2 h-9 w-28 fill-amber-500">
            <path transform="translate(2 16)" d="m8 0 2.4 5.2 5.6.7-4.1 3.8 1.1 5.6-5-2.8-5 2.8 1.1-5.6L0 5.9l5.6-.7Z" />
            <path transform="translate(25 7)" d="m8 0 2.4 5.2 5.6.7-4.1 3.8 1.1 5.6-5-2.8-5 2.8 1.1-5.6L0 5.9l5.6-.7Z" />
            <path transform="translate(46 0) scale(1.25)" d="m8 0 2.4 5.2 5.6.7-4.1 3.8 1.1 5.6-5-2.8-5 2.8 1.1-5.6L0 5.9l5.6-.7Z" />
            <path transform="translate(71 7)" d="m8 0 2.4 5.2 5.6.7-4.1 3.8 1.1 5.6-5-2.8-5 2.8 1.1-5.6L0 5.9l5.6-.7Z" />
            <path transform="translate(94 16)" d="m8 0 2.4 5.2 5.6.7-4.1 3.8 1.1 5.6-5-2.8-5 2.8 1.1-5.6L0 5.9l5.6-.7Z" />
          </svg>
          <h2 id="reviews-heading" className={`${reviewTitleFont.className} px-4 text-[clamp(1.75rem,4vw,2.5rem)] leading-tight tracking-[-0.035em] text-slate-900`}>
            베스트 수강평
          </h2>
        </div>
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
