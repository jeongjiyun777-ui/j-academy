"use client";

import Image from "next/image";
import Link from "next/link";

export default function InquiryManagerPage() {


  async function handleInquiriesExport(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("관리자 로그인이 필요합니다.");
    return;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

  try {
    const response = await fetch(
      `${apiBaseUrl}/admin/inquiries/export`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();

      throw new Error(
        data.detail ?? "현재 등록된 문의사항이 없습니다."
      );
    }

    const fileBlob = await response.blob();
    const downloadUrl = URL.createObjectURL(fileBlob);

    const contentDisposition = response.headers.get("Content-Disposition");

    const fileName =
      contentDisposition?.match(/filename="([^"]+)"/)?.[1] ??
      "inquiries.xlsx";

    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "엑셀 파일을 다운로드하지 못했습니다."
    );
  }
}

  return (
      <main className="relative flex min-h-screen flex-col items-center bg-slate-100 px-4 py-12">
        <div className="mb-10 flex flex-col items-center justify-center gap-3">
          <Link
            href="/"
            className="mt-3 flex items-center justify-center gap-2 sm:gap-3 transition-opacity hover:opacity-80"
          >
            <Image
              src="/j-academy-logo-web.png"
              alt="제이 외국어 온라인 학원 로고"
              width={48}
              height={48}
              className="h-8 w-8 sm:h-12 sm:w-12 object-contain shrink-0"
              priority
            />

            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold leading-tight text-slate-900 whitespace-nowrap">
              제이 외국어 온라인 학원
            </h1>
          </Link>
          <p className="text-sm font-medium text-slate-500">
            문의 사항 엑셀 다운로드
          </p>
        </div>

        <section className="mx-auto w-full max-w-5xl rounded-xl bg-white p-10 shadow">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/10">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">문의 내역 스프레드시트</h2>
                <p className="text-xs text-slate-500">홈페이지에서 접수된 온라인 문의 데이터를 추출합니다.</p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Excel (.xlsx)
            </span>
          </div>

          <div className="my-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">엑셀 파일에 포함되는 데이터 항목</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {[
                "접수 일시",
                "이름 (name)",
                "연락처 (phone)",
                "문의 유형 (inquiry_type)",
                "제목 (title)",
                "문의 내용 (content)",
              ].map((field) => (
                <span
                  key={field}
                  className="rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleInquiriesExport} className="flex flex-col gap-4">
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-emerald-700/20 transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-[0.99] whitespace-nowrap"
            >
              <svg
                className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="whitespace-nowrap">문의사항 전체 내역 엑셀 다운로드</span>
            </button>
            <p className="text-center text-[11px] text-slate-400 keep-all">
              고객의 이름 및 연락처 등 민감 정보가 포함되어 있으므로 안전하게 관리해 주세요.
            </p>
          </form>
        </section>

        <div className="mx-auto mt-6 w-full max-w-5xl px-0">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-base font-semibold text-slate-500 transition-colors hover:text-blue-600"
          >
            <svg 
              className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2.5" 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
      </main>
    );
}

