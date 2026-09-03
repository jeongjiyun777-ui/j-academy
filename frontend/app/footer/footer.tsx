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
                src="/j-academy-logo-footer.png"
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

            <span className="text-slate-700">|</span>

            <Link href="/manager" className="hover:text-blue-400">
              관리자 전용
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