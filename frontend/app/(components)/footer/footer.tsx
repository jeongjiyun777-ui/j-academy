import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:justify-between">
        {/* 왼쪽: 학원 로고 영역 */}
        <section className="shrink-0 md:w-72">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white p-2">
              <Image
                src="/j-academy-logo-web.png"
                alt="제이 외국어 온라인 학원 로고"
                width={60}
                height={60}
                className="h-14 w-14 object-contain"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                제이 외국어
              </h2>

              <p className="text-sm text-slate-400">
                온라인 학원
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-400">
            영어·스페인어·일본어·중국어를
            <br />
            체계적으로 배우는 온라인 외국어 학원
          </p>
          <ul aria-label="SNS" className="mt-6 flex items-center gap-3">
            <li className="grid size-11 place-items-center rounded-xl bg-[#03C75A] text-white shadow-md shadow-[#03C75A]/20">
              <span aria-hidden="true" className="text-xs font-black tracking-tight">blog</span>
              <span className="sr-only">네이버 블로그</span>
            </li>
            <li className="grid size-11 place-items-center rounded-xl bg-[#FEE500] text-[#371D1E] shadow-md shadow-[#FEE500]/20">
              <svg aria-hidden="true" className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.708 4.8 4.27 6.054l-1.09 3.998c-.097.355.305.645.61.439l4.78-3.17c.142.012.286.019.43.019 4.97 0 9-3.185 9-7.115C21 6.185 16.97 3 12 3z" />
              </svg>
              <span className="sr-only">카카오톡</span>
            </li>
            <li className="grid size-11 place-items-center rounded-xl bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md shadow-[#dc2743]/20">
              <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm9 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm1.5-5.5h.01" />
              </svg>
              <span className="sr-only">인스타그램</span>
            </li>
            <li className="grid size-11 place-items-center rounded-xl bg-[#1877F2] text-white shadow-md shadow-[#1877F2]/20">
              <svg aria-hidden="true" className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M14 21v-8h3l.5-4H14V7c0-1 .4-1.5 1.5-1.5H18V2h-3.5C11.5 2 10 4 10 7v2H7v4h3v8z" />
              </svg>
              <span className="sr-only">페이스북</span>
            </li>
          </ul>
        </section>

        {/* 오른쪽: 학원 정보 영역 */}
        <section className="flex-1 md:max-w-2xl">
          {/* 상담 연락처 */}
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <p>
              <span className="mr-3 font-semibold text-white">
                대표전화
              </span>
              02-1234-5678
            </p>

            <p>
              <span className="mr-3 font-semibold text-white">
                학습상담
              </span>
              02-1234-5679
            </p>

            <p>
              <span className="mr-3 font-semibold text-white">
                상담시간
              </span>
              평일 10:00~18:00
            </p>

            <p>
              <span className="mr-3 font-semibold text-white">
                이메일
              </span>
              help@j-academy.example
            </p>
          </div>

          {/* 링크 */}
          <nav className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
            <Link href="/terms" className="hover:text-blue-400">
              이용약관
            </Link>

            <span className="text-slate-700">|</span>

            <Link href="/privacy" className="hover:text-blue-400">
              개인정보처리방침
            </Link>
          </nav>

          {/* 상세 정보 */}
          <div className="mt-7 text-xs leading-6 text-slate-500">
            <p>제이 외국어 온라인 학원 · 대표자 정지윤</p>
            <p>
              학원 등록번호: 제2026-서울강남-0123호
            </p>
            <p>
              주소: 서울특별시 강남구 학원로 123, 제이빌딩 4층
            </p>

            <p className="mt-2">
              포트폴리오용 데모 서비스이며 표시된 정보는 실제 정보가
              아닙니다.
            </p>

            <p className="mt-1">
              COPYRIGHT © 2026 J ACADEMY. ALL RIGHTS RESERVED.
            </p>
          </div>
        </section>
      </div>
    </footer>
  );
}
