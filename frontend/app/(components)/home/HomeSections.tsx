import { Nanum_Myeongjo } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import ReviewCarousel from "./ReviewCarousel";
import InquiryForm from "../inquiries/InquiryForm";

const reviewTitleFont = Nanum_Myeongjo({ weight: "700", display: "swap", preload: false, fallback: ["Batang", "serif"] });

const starPath = "m8 0 2.4 5.2 5.6.7-4.1 3.8 1.1 5.6-5-2.8-5 2.8 1.1-5.6L0 5.9l5.6-.7Z";

const sectionClass =
  "w-full scroll-mt-64 rounded-2xl border border-slate-300 bg-white px-6 py-10 sm:px-10 md:scroll-mt-44 lg:scroll-mt-36";

export default function HomeSections() {
  return (
    <div className="grid w-full px-4 pb-6 sm:px-6 lg:px-8">
      <section
        id="academy"
        aria-label="학원소개"
        className="relative -mx-4 overflow-hidden scroll-mt-64 sm:-mx-6 md:scroll-mt-44 lg:-mx-8 lg:scroll-mt-36"
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
      </section>

      <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-64 border-b border-slate-200 bg-white pb-10 pt-12 sm:pt-16 -mx-4 sm:-mx-6 md:scroll-mt-44 lg:-mx-8 lg:scroll-mt-36">
        <div className="px-4 text-center">
          <svg aria-hidden="true" viewBox="0 0 112 24" className="mx-auto mb-4 h-6 w-28 fill-amber-500 sm:mb-5">
            <path transform="translate(0 4)" d={starPath} />
            <path transform="translate(23 4)" d={starPath} />
            <path transform="translate(46 2) scale(1.25)" d={starPath} />
            <path transform="translate(73 4)" d={starPath} />
            <path transform="translate(96 4)" d={starPath} />
          </svg>
          <h1 id="reviews-heading" className={`${reviewTitleFont.className} text-[clamp(1.75rem,4vw,2.5rem)] leading-tight tracking-[-0.035em] text-slate-900`}>
            베스트 수강평
          </h1>
        </div>
        <ReviewCarousel />
      </section>

      <section id="inquiries" aria-labelledby="inquiries-heading" className="mt-5 w-full scroll-mt-64 rounded-2xl border border-slate-300 bg-slate-100 px-3 py-8 sm:px-6 sm:py-10 md:scroll-mt-44 lg:scroll-mt-36">
        <div className="mx-auto max-w-3xl">
          <h2 id="inquiries-heading" className="text-2xl font-bold tracking-tight text-slate-900">
            문의사항
          </h2>
          <div className="mt-5 rounded-2xl border border-slate-300 bg-white p-4 sm:p-6 lg:p-8">
            <InquiryForm />
          </div>
        </div>
      </section>

      <section id="notice" aria-labelledby="notice-heading" className={"mt-5 " + sectionClass}>
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
