import Image from "next/image";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <header className="border-b border-slate-200 pb-8 text-center">
          <Image src="/j-academy-logo-web.png" alt="제이 외국어 온라인 학원 로고" width={52} height={52} className="mx-auto mb-4" />
          <p className="text-sm font-semibold text-blue-600">J ACADEMY</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">개인정보처리방침</h1>
          <p className="mt-3 text-sm text-slate-500">시행일: 2026년 9월 18일</p>
        </header>

        <article className="mt-8 space-y-8 text-sm leading-7 text-slate-600">
          <section>
            <h2 className="text-lg font-bold text-slate-900">1. 수집하는 정보</h2>
            <p className="mt-2">서비스 이용을 위해 이름, 아이디, 생년월일, 휴대폰 번호와 수강신청 정보를 수집할 수 있습니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">2. 정보 이용 목적</h2>
            <p className="mt-2">수강신청 처리, 회원 식별, 학습 상담 제공과 서비스 운영을 위해 필요한 범위에서 정보를 이용합니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">3. 정보 보관 및 보호</h2>
            <p className="mt-2">비밀번호와 개인정보는 안전한 방식으로 보호하며, 서비스 제공에 필요한 범위에서 관리합니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">4. 안내</h2>
            <p className="mt-2">이 페이지는 포트폴리오 데모 서비스의 개인정보처리방침 예시이며, 실제 상용 서비스 운영을 위한 법률 문서가 아닙니다.</p>
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
