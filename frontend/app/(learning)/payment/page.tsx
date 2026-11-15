import PaymentForm from "./PaymentForm";
import TossPaymentResult from "./TossPaymentResult";

export default async function PaymentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const isResult = Boolean(query.paymentKey || query.payment === "failed");
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">수강료 결제</h1>
        <p className="mt-1 text-sm text-slate-600">수강할 외국어와 단계를 선택하고 수강료를 확인해 주세요.</p>
        {isResult ? <TossPaymentResult /> : <PaymentForm />}
      </div>
    </main>
  );
}
