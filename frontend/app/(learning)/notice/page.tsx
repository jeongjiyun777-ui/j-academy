import Link from "next/link";

export default function NoticePage() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline">
        ← 홈으로
      </Link>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">공지·이벤트</h1>
      <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-slate-600">
        등록된 공지나 이벤트가 없습니다.
      </p>
    </main>
  );
}
