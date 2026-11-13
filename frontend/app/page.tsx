import Link from "next/link";
import HomeSections, { homeTitleClassName } from "./(components)/home/HomeSections";
import InquiryForm from "./(components)/inquiries/InquiryForm";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white pb-6">
      <HomeSections />

      <h1
        id="inquiries"
        className={`${homeTitleClassName} scroll-mt-64 px-5 pt-12 text-center sm:pt-16 md:scroll-mt-44 lg:scroll-mt-36`}
      >
        문의사항 접수하기
      </h1>
      <InquiryForm className="mx-auto max-w-4xl px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10" />

      <section
        id="notice"
        aria-labelledby="notice-heading"
        className="w-full scroll-mt-64 border-y border-slate-300 bg-slate-100 px-6 py-10 sm:px-10 md:scroll-mt-44 lg:scroll-mt-36"
      >
        <h2 id="notice-heading" className="text-2xl font-bold tracking-tight text-slate-900">
          공지·이벤트
        </h2>
        <Link href="/notice" className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
          공지·이벤트 전체 보기
        </Link>
      </section>
    </main>
  );
}
