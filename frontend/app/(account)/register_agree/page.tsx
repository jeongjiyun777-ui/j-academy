"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Agree() {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);


  return (
      <main className="relative flex min-h-screen flex-col items-center bg-slate-100 px-4 py-12 font-sans overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[1000px] -translate-x-1/2 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/80 to-transparent" />
          <div className="absolute left-1/4 top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
        </div>


        <div className="relative z-10 mb-8 flex flex-col items-center justify-center gap-3">
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
            서비스 이용을 위해 약관에 동의해 주세요.
          </p>
        </div>


        <section className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-10">
          

          <div
            className="max-h-[400px] space-y-6 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-6 text-sm leading-7 text-slate-600 shadow-inner"
            tabIndex={0}
            role="region"
            aria-labelledby="terms-title"
          >
            <h2
              id="terms-title"
              className="border-b border-slate-200 pb-4 text-xl font-bold text-slate-900"
            >
              제이 외국어 온라인 학원 이용약관
            </h2>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">제1조 목적</h3>
              <p className="text-slate-600">
                본 약관은 제이 외국어 온라인 학원(이하 “제이학원”)이 제공하는 웹사이트 및 학습 관련 서비스의 이용 조건과 제이학원 및 회원의 권리·의무를 정하는 것을 목적으로 합니다.
              </p>
            </div>


            <button
              type="button"
              onClick={() => setIsTermsOpen(!isTermsOpen)}
              aria-expanded={isTermsOpen}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
            >
              {isTermsOpen ? "상세 약관 접기" : "상세 약관 전체 보기"}
              <svg
                className={`h-4 w-4 transition-transform duration-300 ${isTermsOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>


            <div
              className={`transition-all duration-300 ${
                isTermsOpen ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <div className="space-y-6 pt-2">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">제2조 회원가입</h3>
                  <p>
                    이용자는 본 약관에 동의하고 가입에 필요한 정보를 입력하여 회원가입을 신청할 수 있습니다. 타인의 정보를 사용하거나 허위 정보를 입력해서는 안 됩니다. 미성년자의 가입 및 유료 서비스 이용에는 관계 법령에 따른 법정대리인 동의 절차가 적용될 수 있습니다.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">제3조 제공 서비스</h3>
                  <p>
                    제이학원은 학원 및 수업 안내, 회원 정보 관리, 수강 신청, 외국어 학습 지원 등의 서비스를 제공합니다. 각 기능의 제공 여부와 이용 조건은 해당 화면에서 안내합니다. 준비 중인 기능은 이용이 제한될 수 있습니다.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">제4조 계정 관리</h3>
                  <p>
                    회원은 자신의 아이디와 비밀번호를 안전하게 관리해야 하며, 타인에게 계정을 양도하거나 대여해서는 안 됩니다. 계정 도용이나 무단 사용을 발견한 경우 제이학원에 알려주시기 바랍니다. 제이학원은 필요한 보호 조치를 검토합니다.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">제5조 이용 시 준수사항</h3>
                  <p>회원은 다음 행위를 해서는 안 됩니다.</p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>타인의 개인정보 또는 계정을 무단으로 사용하는 행위</li>
                    <li>다른 이용자를 괴롭히거나 권리를 침해하는 행위</li>
                    <li>서비스에 장애를 일으키거나 비정상적인 접근을 시도하는 행위</li>
                    <li>학습 자료를 권한 없이 복제·배포하거나 판매하는 행위</li>
                    <li>그 밖에 관계 법령을 위반하는 행위</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">제6조 학습 자료와 AI 상담</h3>
                  <p>
                    제이학원 또는 정당한 권리자가 제공하는 학습 자료의 저작권은 해당 권리자에게 있습니다. 자료는 허용된 학습 범위에서 이용해야 합니다.
                  </p>
                  <p className="mt-1">
                    AI 상담 기능이 제공되는 경우, 답변에는 부정확한 내용이 포함될 수 있습니다. 중요한 학습 내용은 담당 선생님이나 신뢰할 수 있는 자료를 통해 확인하시기 바랍니다. 현재 AI 상담 기능은 준비 중입니다.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">제7조 수강 신청 및 환불</h3>
                  <p>
                    수강 신청의 확정 여부, 수업 일정, 비용 및 취소·환불 조건은 신청 또는 결제 전에 별도로 안내합니다. 회원가입만으로 유료 수강이 확정되거나 비용이 발생하지 않습니다. 환불은 적용되는 관계 법령과 사전에 안내한 기준에 따라 처리합니다.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">제8조 서비스 변경 및 이용 제한</h3>
                  <p>
                    제이학원은 시스템 점검, 장애 또는 운영상 필요한 사유로 서비스를 변경하거나 일시 중단할 수 있습니다. 예정된 변경과 중단은 사전에 안내하며, 긴급한 경우에는 사후에 안내할 수 있습니다.
                  </p>
                  <p className="mt-1">
                    약관 위반으로 이용을 제한하는 경우에는 위반 내용과 제한 사유를 안내하고 소명할 기회를 제공합니다. 긴급한 보호 조치가 필요한 경우에는 조치 후 안내할 수 있습니다.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">제9조 개인정보 보호</h3>
                  <p>
                    제이학원은 회원의 개인정보를 관계 법령에 따라 처리합니다. 개인정보의 처리 목적, 항목, 보유 기간 및 회원의 권리 행사 방법은 별도의 개인정보 처리방침과 필요한 동의 안내에서 확인할 수 있습니다.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">제10조 회원 탈퇴</h3>
                  <p>
                    회원은 [탈퇴 기능 또는 문의 방법]을 통해 탈퇴를 요청할 수 있습니다. 탈퇴 시 개인정보는 개인정보 처리방침 및 관계 법령에 따라 처리하며, 진행 중인 수강이나 환불 사항은 별도로 정산합니다.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">제11조 약관 변경 및 분쟁 처리</h3>
                  <p>
                    제이학원은 약관을 변경하는 경우 변경 내용과 적용일을 사전에 안내하고, 관계 법령에 따라 필요한 절차를 진행합니다. 서비스 이용과 관련한 문의나 분쟁은 아래 연락처로 접수할 수 있습니다. 본 약관은 관계 법령이 보장하는 회원의 권리를 제한하지 않습니다.
                  </p>
                </div>

                <div className="mt-6 rounded-lg bg-slate-100 p-4 text-xs text-slate-500">
                  <p>운영자: [정지윤]</p>
                  <p>문의 이메일 또는 연락처: [010-1234-5678]</p>
                  <p>시행일: [2026년 09월 05일]</p>
                </div>
              </div>
            </div>
          </div>


          <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition-colors hover:bg-blue-50">
            <label className="group flex cursor-pointer items-center justify-center gap-3">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="terms-agree"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-500"
                />
                <svg
                  className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-700 transition-colors group-hover:text-slate-900 sm:text-base">
                [필수] 이용약관을 확인하였으며 이에 동의합니다.
              </span>
            </label>
          </div>


          <div className="mt-6">
            {isAgreed ? (
              <Link
                href="/register"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98]"
              >
                <span>다음 단계로 이동</span>
                <svg
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-4 text-base font-bold text-slate-400"
              >
                <span>다음 단계로 이동</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        </section>

        <div className="relative z-10 mt-6 w-full max-w-2xl pl-2">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
          >
            <svg className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
      </main>
    );
}