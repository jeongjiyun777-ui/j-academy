"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type AdminApplication = {
  application_id: number;
  name: string;
  subject: string;
  class_name: string;
  status: string;
  updated_at: string;
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [applicationCurrentPage, setApplicationCurrentPage] = useState(1);
  const [applicationTotalPages, setApplicationTotalPages] = useState(1);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<
    Record<number, "승인대기" | "승인완료">
  >({});

  async function loadAdminApplications(page: number = 1) {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setNoticeMessage("관리자 로그인이 필요합니다.");
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

    try {
      const response = await fetch(
        `${apiBaseUrl}/admin/applications?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ?? "수강신청 목록을 불러오지 못했습니다."
        );
      }

      setApplications(data.applications);
      setApplicationTotalPages(data.total_pages ?? 1);
      setApplicationCurrentPage(data.page ?? page);
    } catch (error) {
      console.error("관리자 수강신청 목록 조회 오류:", error);

      setNoticeMessage(
        error instanceof Error
          ? error.message
          : "서버에 연결할 수 없습니다."
      );
    }
  }

  useEffect(() => {
    loadAdminApplications(1);
  }, []);

  function handleStatusChange(
    applicationId: number,
    status: "승인대기" | "승인완료"
  ) {
    setSelectedStatuses((previousStatuses) => ({
      ...previousStatuses,
      [applicationId]: status,
    }));
  }

  async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = localStorage.getItem("access_token");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

    const updates = Object.entries(selectedStatuses).map(
      ([applicationId, status]) => ({
        application_id: Number(applicationId),
        status,
      })
    );

    if (updates.length === 0) {
      setNoticeMessage("변경할 수강신청 상태를 선택해 주세요.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/admin/applications/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail ?? "승인 상태를 변경하지 못했습니다.");
      }

      setNoticeMessage("수강신청 상태가 변경되었습니다.");

      setApplications((previousApplications) =>
        previousApplications.filter(
          (application) =>
            selectedStatuses[application.application_id] !== "승인완료"
        )
      );

      setSelectedStatuses({});
    } catch (error) {
      setNoticeMessage(
        error instanceof Error
          ? error.message
          : "서버에 연결할 수 없습니다."
      );
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center bg-slate-100 px-4 py-12">
      <div className="mb-8 flex flex-col items-center justify-center gap-2 text-center sm:mb-12">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 sm:gap-3 transition-opacity hover:opacity-80"
        >
          <Image
            src="/j-academy-logo-web.png"
            alt="제이 외국어 온라인 학원 로고"
            width={48}
            height={48}
            className="h-8 w-8 sm:h-12 sm:w-12 shrink-0 object-contain"
            priority
          />
          <h1 className="text-xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl whitespace-nowrap">
            제이 외국어 온라인 학원
          </h1>
        </Link>
        <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
          수강 신청 관리 및 상태 변경 시스템
        </p>
      </div>


      <section className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-10">
        {noticeMessage && (
          <p className="mb-6 text-center text-sm font-medium text-red-600">{noticeMessage}</p>
        )}

        <form onSubmit={handleConfirm}>
          {applications.length > 0 && (
            <>
              <div className="w-full overflow-x-auto rounded-lg border border-slate-400">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr className="divide-x divide-slate-400 border-b border-slate-400">
                      <th className="whitespace-nowrap px-4 py-3 text-center align-middle">
                        번호
                      </th>
                      <th className="whitespace-nowrap px-4 py-3.5 text-center align-middle font-medium">
                        학생
                      </th>
                      <th className="whitespace-nowrap px-4 py-3.5 text-center align-middle font-medium">
                        과목
                      </th>
                      <th className="whitespace-nowrap px-4 py-3.5 text-center align-middle font-medium">
                        반
                      </th>
                      <th className="whitespace-nowrap px-4 py-3.5 text-center align-middle font-medium">
                        신청 날짜
                      </th>
                      <th className="whitespace-nowrap px-4 py-3.5 text-center align-middle font-medium">
                        상태
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-400">
                    {applications.map((application, index) => (
                      <tr
                        key={application.application_id}
                        className="divide-x divide-slate-400 transition-colors hover:bg-slate-50/50"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-center align-middle">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-center align-middle">
                          {application.name}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-center align-middle">
                          {application.subject}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-center align-middle">
                          {application.class_name}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-center align-middle">
                          {new Date(
                            application.updated_at
                          ).toLocaleDateString("ko-KR")}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-center align-middle">
                          <select
                            value={
                              selectedStatuses[application.application_id] ??
                              application.status
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                application.application_id,
                                event.target.value as "승인대기" | "승인완료"
                              )
                            }
                            className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="승인대기">승인대기</option>
                            <option value="승인완료">승인완료</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    loadAdminApplications(applicationCurrentPage - 1)
                  }
                  disabled={applicationCurrentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  &lt;
                </button>

                {Array.from(
                  { length: applicationTotalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    onClick={() => loadAdminApplications(pageNumber)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-all ${
                      applicationCurrentPage === pageNumber
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    loadAdminApplications(applicationCurrentPage + 1)
                  }
                  disabled={
                    applicationCurrentPage === applicationTotalPages
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  &gt;
                </button>
              </div>
            </>
          )}

          {!noticeMessage && applications.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-500">
              현재 수강신청 내역이 없습니다.
            </p>
          )}

          {!noticeMessage && applications.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-500">
              현재 수강신청 내역이 없습니다.
            </p>
          )}

          {applications.length > 0 && (
            <div className="mt-10 flex w-full justify-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] sm:w-auto"
              >
                <span>확정하기</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-slate-400">
            제이 외국어 온라인 학원 학생 관리 시스템
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

