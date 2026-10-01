"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type InquiryForm = {
  inquiry_type: string;
  name: string;
  phone: string;
  title: string;
  content: string;
};


export default function InquiryPage() {
  const [inquiryType, setInquiryType] = useState("");
  const [name, setName] = useState("");
  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);


  function handleInquiryInputChange(
  event: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) {
  const { name, value } = event.target;

  switch (name) {
        case "name":
          setName(value);
          break;
        case "phone_first":
          setPhoneFirst(value);
          break;

        case "phone_middle":
          setPhoneMiddle(value);
          break;

        case "phone_last":
          setPhoneLast(value);
          break;
        case "inquiry_type":
          setInquiryType(value);
          break;
        case "title":
          setTitle(value);
          break;
        case "content":
          setContent(value);
          break;
      }
}

  async function handleInquirySubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const inquiryData: InquiryForm = {
      inquiry_type: inquiryType,
      name: name.trim(),
      phone: `${phoneFirst.trim()}-${phoneMiddle.trim()}-${phoneLast.trim()}`,
      title: title.trim(),
      content: content.trim(),
    };

    if (
      !inquiryData.inquiry_type ||
      !inquiryData.name ||
      !inquiryData.phone ||
      !inquiryData.title ||
      !inquiryData.content
    ) {
      alert("모든 문의 항목을 입력해 주세요.");
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

    try {
      const response = await fetch(`${apiBaseUrl}/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail ?? "문의 접수에 실패했습니다.");
      }

      setInquiryType("");
      setName("");
      setPhoneFirst("");
      setPhoneMiddle("");
      setPhoneLast("");
      setTitle("");
      setContent("");

      alert(data.message ?? "문의가 접수되었습니다.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "서버에 연결할 수 없습니다."
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
            궁금한 점을 남겨주시면 빠르게 답변해 드리겠습니다.
          </p>
        </div>

        <section className="w-full max-w-3xl rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-200/40 md:p-10">
          <form onSubmit={handleInquirySubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                  이름 <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name" 
                  value={name} 
                  onChange={handleInquiryInputChange} 
                  placeholder="홍길동"
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="phone-first"
                  className="text-sm font-semibold text-slate-700"
                >
                  연락처 <span className="text-blue-600">*</span>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    id="phone-first"
                    name="phone_first"
                    type="text"
                    inputMode="numeric"
                    placeholder="010"
                    minLength={3}
                    maxLength={3}
                    pattern="[0-9]{3}"
                    value={phoneFirst}
                    onChange={(event) => setPhoneFirst(event.target.value)}
                    className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center"
                    required
                  />

                  <span className="text-slate-500">-</span>

                  <input
                    id="phone-middle"
                    name="phone_middle"
                    type="text"
                    inputMode="numeric"
                    placeholder="1234"
                    minLength={4}
                    maxLength={4}
                    pattern="[0-9]{4}"
                    aria-label="전화번호 가운데 자리"
                    value={phoneMiddle}
                    onChange={(event) => setPhoneMiddle(event.target.value)}
                    className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center"
                    required
                  />

                  <span className="text-slate-500">-</span>

                  <input
                    id="phone-last"
                    name="phone_last"
                    type="text"
                    inputMode="numeric"
                    placeholder="5678"
                    minLength={4}
                    maxLength={4}
                    pattern="[0-9]{4}"
                    aria-label="전화번호 마지막 자리"
                    value={phoneLast}
                    onChange={(event) => setPhoneLast(event.target.value)}
                    className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="inquiry_type" className="text-sm font-semibold text-slate-700">
                문의 유형 <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <select
                  id="inquiry_type"
                  name="inquiry_type" 
                  value={inquiryType} 
                  onChange={handleInquiryInputChange} 
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  required
                >
                  <option value="">문의 유형을 선택해 주세요</option>
                  <option value="consulting">수강 및 학습 상담</option>
                  <option value="payment">결제 및 환불 문의</option>
                  <option value="system">사이트 이용 및 오류</option>
                  <option value="etc">기타 문의</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="title"
                  className="text-sm font-semibold text-slate-700"
                >
                  제목 <span className="text-blue-600">*</span>
                </label>

                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={handleInquiryInputChange}
                  placeholder="문의하실 내용의 제목을 입력해 주세요"
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  required
                />

                <p className="text-right text-xs text-slate-400">
                  {title.length} / 100자
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="content"
                  className="text-sm font-semibold text-slate-700"
                >
                  문의 내용 <span className="text-blue-600">*</span>
                </label>

                <textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={handleInquiryInputChange}
                  rows={6}
                  placeholder="궁금하신 점이나 겪고 계신 문제를 자세히 적어주시면 더욱 정확한 안내가 가능합니다."
                  className="resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  required
                />

                <p className="text-right text-xs text-slate-400">
                  {content.length} / 700자
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-slate-200/80" />

            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <label className="group flex cursor-pointer items-start gap-3 sm:items-center">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isAgreed} 
                    onChange={(e) => setIsAgreed(e.target.checked)} 
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-slate-50 transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-500"
                    required
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
                <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-slate-900">
                  개인정보 수집 및 이용에 동의합니다. <span className="text-blue-600">*</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={!isAgreed}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all duration-200 sm:w-auto ${
                  isAgreed
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
                    : "cursor-not-allowed bg-slate-300 text-slate-100 shadow-none"
                }`}
              >
                <span>문의 접수하기</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>

        </section>

        <div className="mt-6 w-full max-w-3xl pl-2">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-base font-semibold text-slate-500 transition-colors hover:text-blue-600"
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

