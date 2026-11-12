import Link from "next/link";
import HomeSections from "./(components)/home/HomeSections";
import InquiryForm from "./(components)/inquiries/InquiryForm";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-slate-100 pb-6">
      <HomeSections />

      <h2
        id="inquiries"
        className="scroll-mt-64 px-5 pt-12 text-center font-sans text-3xl font-semibold leading-tight tracking-[-0.055em] text-slate-900 sm:pt-16 sm:text-4xl md:scroll-mt-44 lg:scroll-mt-36"
      >
        문의하기
      </h2>
      <div className="mx-auto mt-8 w-full max-w-4xl px-5 pb-12 sm:mt-10 sm:px-8 sm:pb-16">
        <InquiryForm />
      </div>

      <section
        id="notice"
        aria-labelledby="notice-heading"
        className="mx-4 scroll-mt-64 rounded-2xl border border-slate-300 bg-white px-6 py-10 sm:mx-6 sm:px-10 md:scroll-mt-44 lg:mx-8 lg:scroll-mt-36"
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
