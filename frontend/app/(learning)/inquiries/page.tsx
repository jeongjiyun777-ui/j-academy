import Image from "next/image";
import Link from "next/link";
import InquiryForm from "../../(components)/inquiries/InquiryForm";

export default function InquiryPage() {
  return (
      <main className="relative flex min-h-screen flex-col items-center bg-slate-100 px-4 py-12">
        <div className="mb-10 flex flex-col items-center justify-center gap-3">
          <Link
            href="/"
            className="mt-3 flex items-center justify-center gap-2 sm:gap-3 transition-opacity hover:opacity-80"
          >
            <Image
              src="/j-academy-logo-web.png"
              alt="제이 외국어 온라인 학원 로고"
              width={48}
              height={48}
              className="h-8 w-8 sm:h-12 sm:w-12 object-contain shrink-0"
              priority
            />

            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold leading-tight text-slate-900 whitespace-nowrap">
              제이 외국어 온라인 학원
            </h1>
          </Link>
          <p className="text-sm font-medium text-slate-500">
            궁금한 점을 남겨주시면 빠르게 답변해 드리겠습니다.
          </p>
        </div>

        <InquiryForm className="max-w-3xl" />

        <div className="mt-6 w-full max-w-3xl pl-2">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-base font-semibold text-slate-500 transition-colors hover:text-blue-600"
          >
            <svg className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
      </main>
    );
}
