"use client";

import Script from "next/script";
import { useRef, useState } from "react";

type TossSdk = (clientKey: string) => {
  payment(options: { customerKey: string }): {
    requestPayment(options: {
      method: "CARD";
      amount: { currency: "KRW"; value: number };
      orderId: string;
      orderName: string;
      successUrl: string;
      failUrl: string;
    }): Promise<unknown>;
  };
};

export default function TossTestPayment({ orderId, amount }: { orderId: string; amount: number }) {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim();
  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  if (!clientKey?.startsWith("test_ck_") || !orderId) {
    return <p className="text-sm text-slate-700">테스트 결제창을 사용할 수 없습니다.</p>;
  }

  async function openPayment() {
    if (inFlight.current || !clientKey) return;
    inFlight.current = true;
    setOpening(true);
    setError("");
    try {
      const sdk = (window as Window & { TossPayments?: TossSdk }).TossPayments;
      if (!sdk) throw new Error("Toss SDK unavailable");
      const payment = sdk(clientKey).payment({ customerKey: "ANONYMOUS" });
      const { origin, pathname, search, hash } = window.location;
      const callback = new URL("/payment", origin);
      callback.searchParams.set("returnTo", pathname + search + hash);
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: amount },
        orderId,
        orderName: "제이아카데미 수강료",
        successUrl: callback.toString(),
        failUrl: new URL("?payment=failed", callback).toString(),
      });
    } catch {
      setError("결제창을 열지 못했거나 결제가 중단되었습니다. 다시 시도해 주세요.");
    } finally {
      inFlight.current = false;
      setOpening(false);
    }
  }

  return (
    <div className="space-y-2">
      <Script
        src="https://js.tosspayments.com/v2/standard"
        onReady={() => setReady(true)}
        onError={() => setError("토스 결제창을 불러오지 못했습니다.")}
      />
      <button
        type="button"
        disabled={!ready || opening}
        onClick={openPayment}
        className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {opening ? "결제창 여는 중…" : ready || error ? "테스트 카드 결제" : "결제창 불러오는 중…"}
      </button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  );
}