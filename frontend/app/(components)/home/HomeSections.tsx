import { Nanum_Myeongjo } from "next/font/google";
import Image from "next/image";
import ReviewCarousel from "./ReviewCarousel";

const homeTitleFont = Nanum_Myeongjo({ weight: "700", display: "swap", preload: false, fallback: ["Batang", "serif"] });

export const homeTitleClassName = `${homeTitleFont.className} text-[clamp(1.75rem,4vw,2.5rem)] leading-tight tracking-[-0.035em] text-slate-900`;

const starPath = "m8 0 2.4 5.2 5.6.7-4.1 3.8 1.1 5.6-5-2.8-5 2.8 1.1-5.6L0 5.9l5.6-.7Z";

export default function HomeSections() {
  return (
    <>
      <section
        id="academy"
        aria-label="학원소개"
        className="relative overflow-hidden scroll-mt-64 md:scroll-mt-44 lg:scroll-mt-36"
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

      <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-64 border-b border-slate-200 bg-white pb-10 pt-12 sm:pt-16 md:scroll-mt-44 lg:scroll-mt-36">
        <div className="px-4 text-center">
          <svg aria-hidden="true" viewBox="0 0 112 24" className="mx-auto mb-4 h-6 w-28 fill-amber-500 sm:mb-5">
            <path transform="translate(0 4)" d={starPath} />
            <path transform="translate(23 4)" d={starPath} />
            <path transform="translate(46 2) scale(1.25)" d={starPath} />
            <path transform="translate(73 4)" d={starPath} />
            <path transform="translate(96 4)" d={starPath} />
          </svg>
          <h1 id="reviews-heading" className={homeTitleClassName}>
            베스트 수강평
          </h1>
        </div>
        <ReviewCarousel />
      </section>
    </>
  );
}
