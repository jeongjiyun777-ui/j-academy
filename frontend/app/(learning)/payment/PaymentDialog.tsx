"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PaymentForm from "./PaymentForm";

export default function PaymentDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="payment-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl backdrop:bg-slate-950/50 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="payment-dialog-title" className="text-2xl font-bold tracking-tight text-slate-900">수강 결제</h2>
          <p className="mt-1 text-sm text-slate-600">강좌와 수강료를 확인하고 주문을 생성해 주세요.</p>
        </div>
        <button
          type="button"
          aria-label="수강 결제 닫기"
          disabled={busy}
          onClick={onClose}
          className="grid size-9 shrink-0 place-items-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
      <PaymentForm onDone={onClose} onBusyChange={setBusy} />
    </dialog>
  );
}
