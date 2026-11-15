"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { sessionFetch } from "../../(components)/auth/request-refresh";

function getReturnPath(value: string | null) {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/";
  const url = new URL(value, window.location.origin);
  if (url.origin !== window.location.origin || url.pathname.startsWith("//")) return "/";
  return url.pathname + url.search + url.hash;
}

export default function TossPaymentResult() {
  const router = useRouter();
  const confirming = useRef(false);
  const [message, setMessage] = useState("테스트 결제 승인을 확인하는 중입니다…");
  const [retry, setRetry] = useState(false);
  const [paid, setPaid] = useState(false);

  const confirm = useCallback(async () => {
    if (confirming.current) return;
    const query = new URLSearchParams(window.location.search);
    if (query.get("payment") === "failed") {
      setMessage("테스트 결제가 중단되었습니다.");
      return;
    }
    const paymentKey = query.get("paymentKey");
    const orderId = query.get("orderId");
    const amount = Number(query.get("amount"));
    if (!paymentKey || !orderId || !Number.isSafeInteger(amount) || amount <= 0) {
      setMessage("결제 인증 정보를 확인할 수 없습니다.");
      return;
    }

    confirming.current = true;
    setRetry(false);
    setMessage("테스트 결제 승인을 확인하는 중입니다…");
    try {
      const response = await sessionFetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      });
      if (response.status === 401 || response.status === 403) {
        setMessage("학생 로그인 상태를 확인한 뒤 승인을 다시 확인해 주세요.");
        setRetry(true);
        return;
      }
      if (response.status >= 500) throw new Error("Approval uncertain");
      if (!response.ok) {
        setMessage("주문번호와 결제 금액을 확인할 수 없습니다.");
        return;
      }
      const order = await response.json();
      if (order.status !== "결제완료") throw new Error("Unexpected order status");
      setPaid(true);
      setMessage("테스트 결제가 완료되었습니다.");
      window.alert("테스트 결제가 완료되었습니다.");
      router.replace(getReturnPath(query.get("returnTo")));
    } catch {
      setMessage("승인 결과를 아직 확인하지 못했습니다. 같은 주문의 승인을 다시 확인해 주세요.");
      setRetry(true);
    } finally {
      confirming.current = false;
    }
  }, [router]);

  useEffect(() => {
    const id = window.setTimeout(() => void confirm(), 0);
    return () => window.clearTimeout(id);
  }, [confirm]);

  return (
    <div className="mt-5 space-y-3">
      <p role="status" className={paid ? "text-emerald-700" : "text-slate-700"}>{message}</p>
      {retry && <button type="button" onClick={confirm} className="rounded-lg bg-blue-700 px-4 py-2 text-white">승인 다시 확인</button>}
    </div>
  );
}