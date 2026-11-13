"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { requestRefresh } from "../../(components)/auth/request-refresh";

interface Course {
  id: number;
  subject: string;
  level: string;
  priceKrw: number;
}

interface Order {
  orderId: number;
  amountKrw: number;
  status: string;
}

const levelLabels: Record<string, string> = { basic: "기초", intermediate: "중급", advanced: "고급" };
const won = new Intl.NumberFormat("ko-KR");

export default function PaymentPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order>();
  const inFlight = useRef(false);
  const selected = courses.find((course) => String(course.id) === selectedId);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCourses() {
      try {
        const response = await fetch("/api/checkout/courses", { signal: controller.signal });
        if (!response.ok) throw new Error("강좌를 불러올 수 없습니다.");
        setCourses(await response.json());
      } catch {
        if (!controller.signal.aborted) setError("강좌를 불러올 수 없습니다. 새로고침해 주세요.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadCourses();
    return () => controller.abort();
  }, []);

  async function createOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !agreed || order || inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    setError("");

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://" + window.location.hostname + ":8000";
      const refresh = await requestRefresh(apiBaseUrl);
      if (refresh.status === 401) throw new Error("로그인 세션이 만료됐습니다. 다시 로그인해 주세요.");
      if (!refresh.ok) throw new Error("로그인 세션을 확인할 수 없습니다.");
      const session = await refresh.json();
      if (session.user?.role !== "student" || typeof session.access_token !== "string") {
        throw new Error("학생 계정으로 로그인해 주세요.");
      }

      const response = await fetch("/api/checkout/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.access_token,
        },
        body: JSON.stringify({ courseId: selected.id }),
      });
      if (response.status === 401 || response.status === 403) throw new Error("학생 로그인 상태를 확인해 주세요.");
      if (!response.ok) throw new Error("주문 결과를 확인할 수 없습니다.");
      setOrder(await response.json());
    } catch (error) {
      setError(error instanceof Error ? error.message : "주문 요청에 실패했습니다.");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">수강결제</h1>
        {order ? (
          <section aria-live="polite" className="mt-8 space-y-3 rounded-2xl bg-sky-50 p-5 text-slate-800">
            <h2 className="text-lg font-semibold">{order.status}</h2>
            <p>주문번호 {order.orderId}</p>
            <p className="text-2xl font-bold">{won.format(order.amountKrw)}원</p>
            <p className="text-sm">주문을 접수했습니다. 결제는 아직 진행되지 않았습니다.</p>
            <Link href="/" className="inline-block text-sm font-semibold text-blue-700 underline">홈으로</Link>
          </section>
        ) : (
          <form onSubmit={createOrder} className="mt-8 space-y-6">
            <label className="grid gap-2 font-medium text-slate-800">
              강좌 선택
              <select required disabled={loading || submitting} value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white p-3">
                <option value="">{loading ? "강좌 불러오는 중" : "강좌를 선택해 주세요"}</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.subject} {levelLabels[course.level] ?? course.level} · {won.format(course.priceKrw)}원
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline">이용약관 보기</Link>
              <label className="mt-3 flex items-start gap-2">
                <input type="checkbox" required disabled={submitting} checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-1 accent-blue-600" />
                이용약관을 확인했고 주문 생성에 동의합니다.
              </label>
            </div>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={!selected || !agreed || submitting} className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-600">
              {submitting ? "주문 확인 중…" : "결제대기 주문 만들기"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
