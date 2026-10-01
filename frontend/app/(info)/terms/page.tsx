import Image from "next/image";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <header className="border-b border-slate-200 pb-8 text-center">
          <Image src="/j-academy-logo-web.png" alt="제이 외국어 온라인 학원 로고" width={52} height={52} className="mx-auto mb-4" />
          <p className="text-sm font-semibold text-blue-600">J ACADEMY</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">이용약관</h1>
          <p className="mt-3 text-sm text-slate-500">시행일: 2026년 9월 18일</p>
        </header>

        <article className="mt-8 space-y-8 text-sm leading-7 text-slate-600">
          <section>
            <h2 className="text-lg font-bold text-slate-900">제1조 목적</h2>
            <p className="mt-2">본 약관은 제이 외국어 온라인 학원이 제공하는 온라인 학습 서비스의 이용 조건과 절차를 정하는 것을 목적으로 합니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">제2조 회원가입 및 계정 관리</h2>
            <p className="mt-2">이용자는 정확한 정보를 입력하여 회원가입을 진행해야 하며, 계정 정보와 비밀번호를 안전하게 관리할 책임이 있습니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">제3조 서비스 이용</h2>
            <p className="mt-2">회원은 서비스에서 제공하는 수강신청과 학습 상담 기능을 이용할 수 있습니다. 서비스 운영에 방해가 되는 행위는 제한될 수 있습니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">제4조 안내</h2>
            <p className="mt-2">이 페이지는 포트폴리오 데모 서비스의 이용약관 예시이며, 실제 상용 서비스 운영을 위한 법률 문서가 아닙니다.</p>
          </section>
        </article>
      </section>
      <div className="mt-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-block px-4 py-4 text-blue-600 hover:underline"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
