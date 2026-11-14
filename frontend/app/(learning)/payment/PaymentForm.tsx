"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sessionFetch } from "../../(components)/auth/request-refresh";

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

export default function PaymentForm({ onDone, onBusyChange }: { onDone?: () => void; onBusyChange?: (busy: boolean) => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subject, setSubject] = useState("");
  const [selectedId, setSelectedId] = useState<number>();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order>();
  const inFlight = useRef(false);
  const subjects = [...new Set(courses.map((course) => course.subject))];
  const visibleCourses = courses.filter((course) => course.subject === subject);
  const selected = visibleCourses.find((course) => course.id === selectedId);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCourses() {
      try {
        const response = await fetch("/api/checkout/courses", { signal: controller.signal });
        if (!response.ok) throw new Error("강좌를 불러올 수 없습니다.");
        setCourses(await response.json());
      } catch {
        if (!controller.signal.aborted) setError("강좌를 불러올 수 없습니다. 잠시 후 결제창을 다시 열어 주세요.");
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
    onBusyChange?.(true);
    setError("");

    try {
      const response = await sessionFetch("/api/checkout/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      onBusyChange?.(false);
    }
  }

  return (<>
        {order ? (
          <section aria-live="polite" className="mt-8 space-y-3 rounded-2xl bg-sky-50 p-5 text-slate-800">
            <h2 className="text-lg font-semibold">결제 대기</h2>
            <p>주문번호 {order.orderId}</p>
            <p className="text-2xl font-bold">{won.format(order.amountKrw)}원</p>
            <p className="text-sm">주문이 생성됐어요. 결제 승인 전까지 결제 대기 상태로 표시돼요.</p>
            {onDone ? <button type="button" onClick={onDone} className="text-sm font-semibold text-blue-700 underline">닫기</button> : <Link href="/" className="text-sm font-semibold text-blue-700 underline">홈으로</Link>}
          </section>
        ) : (
          <form onSubmit={createOrder} className="mt-5 space-y-4">
            <fieldset disabled={loading || submitting} className="min-w-0">
              <legend className="mb-3 font-semibold text-slate-900">외국어 선택하기</legend>
              {loading ? (
                <p role="status" className="text-sm text-slate-600">강좌를 불러오는 중입니다.</p>
              ) : subjects.length > 0 ? (
                <select
                  aria-label="외국어 선택하기"
                  value={subject}
                  onChange={(event) => {
                    setSubject(event.target.value);
                    setSelectedId(undefined);
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900"
                >
                  <option value="">외국어를 선택해 주세요</option>
                  {subjects.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              ) : !error && (
                <p className="text-sm text-slate-600">현재 신청 가능한 강좌가 없습니다.</p>
              )}
            </fieldset>

            {subject && (
              <fieldset disabled={submitting} className="min-w-0">
                <legend className="mb-3 font-semibold text-slate-900">단계 및 수강료</legend>
                <div className="grid max-h-48 gap-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
                  {visibleCourses.map((course) => (
                    <label key={course.id} className="flex cursor-pointer items-center gap-3 rounded-lg bg-white px-3 py-3 text-sm text-slate-800 ring-1 ring-slate-200 hover:bg-blue-50 has-checked:ring-blue-600">
                      <input
                        type="radio"
                        name="course"
                        checked={selectedId === course.id}
                        onChange={() => setSelectedId(course.id)}
                        className="shrink-0 accent-blue-700"
                        required
                      />
                      <span className="min-w-0 flex-1 font-medium">
                        {course.subject} {levelLabels[course.level] ?? course.level}
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums">{won.format(course.priceKrw)}원</span>
                    </label>
                  ))}
                </div>

              </fieldset>
            )}
            <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white">
              <span className="text-sm font-medium text-slate-200">결제 예정 금액</span>
              <strong className="text-xl tabular-nums">{selected ? `${won.format(selected.priceKrw)}원` : "—"}</strong>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline">이용약관 보기</Link>
              <label className="mt-3 flex items-start gap-2">
                <input type="checkbox" required disabled={submitting} checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-1 accent-blue-600" />
                이용약관을 확인했고 주문 생성에 동의합니다.
              </label>
            </div>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={!selected || !agreed || submitting} className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-600">
              {submitting ? "주문 확인 중…" : "결제 대기 주문 생성"}
            </button>
          </form>
        )}
  </>);
}
