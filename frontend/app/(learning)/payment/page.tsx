import PaymentForm from "./PaymentForm";

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">수강 결제</h1>
        <p className="mt-1 text-sm text-slate-600">강좌와 수강료를 확인하고 주문을 생성해 주세요.</p>
        <PaymentForm />
      </div>
    </main>
  );
}
