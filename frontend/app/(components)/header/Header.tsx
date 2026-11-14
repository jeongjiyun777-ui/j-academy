"use client";

import AcademyBrand from "./AcademyBrand";
import { sessionFetch } from "../auth/request-refresh";

import { CreditCard } from "lucide-react";
import Link from "next/link";
import PaymentDialog from "../../(learning)/payment/PaymentDialog";
import { useEffect, useState } from "react";

type LessonApplication = {
  subject: string;
  class_name: string;
  status: "승인대기" | "승인완료";
};


const subjects = [
  { href: "/teacher_english", label: "영어", icon: "english" },
  { href: "/teacher_spanish", label: "스페인어", icon: "spanish" },
  { href: "/teacher_japanese", label: "일본어", icon: "japanese" },
  { href: "/teacher_chinese", label: "중국어", icon: "chinese" },
] as const;

const paths = {
  academy: "m2 9 10-5 10 5-10 5-10-5Zm4 2v6c3 3 9 3 12 0v-6m4-2v8",
  notice: "M3 10v4h5l11 5V5L8 10H3Zm5 4 2 6h3l-2-5m10-6v6",
  english: "M3 18 8 6l5 12M5 14h6m5 0c0-2 1-3 3-3s3 1 3 3v4m0-4h-3c-2 0-3 1-3 2s1 2 3 2 3-1 3-2",
  spanish: "M6 20V8l12 12V8M7 5c2-4 5 2 8 0l2-2",
  japanese: "M4 7c4 .4 9 .4 14-.5M11 3c-2 5-3 11-1 16m5-9c-1 4-5 10-9 10-4 0-3-5 1-8 4-3 11-3 13 1 2 4-1 7-6 8",
  chinese: "M4 7h16v10H4zM12 3v19",
  signup: "M14 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M8 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm11 5v6m-3-3h6",
  book: "M12 7c-2-2-5-3-9-3v14c4 0 7 1 9 3 2-2 5-3 9-3V4c-4 0-7 1-9 3Zm0 0v14",
  chat: "M4 4h16v12H9l-5 4V4Zm4 4h8m-8 4h5",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z",
  list: "M5 4h14v16H5zM8 8h8m-8 4h8m-8 4h5",
  user: "M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  login: "M10 7l5 5-5 5m5-5H3m10-8h7v16h-7",
  chevron: "m6 9 6 6 6-6",
};

function HeaderIcon({ name, small = false }: { name: keyof typeof paths; small?: boolean }) {
  return (
    <svg aria-hidden="true" className={small ? "size-3.5 shrink-0" : "size-5 shrink-0"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}

const academyLink = { href: "/#academy", label: "학원소개", icon: "academy" } as const;

const navClass = "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-1 py-1.5 text-sm font-semibold text-slate-700 hover:text-blue-700 xl:text-base";
const accountClass = "block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [applications, setApplications] = useState<LessonApplication[]>([]);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const canAccessLessons =
    isLoggedIn && userRole === "student";

  const canAccessAdmin =
    isLoggedIn && userRole === "manager";

  const lessonLinkBySubjectAndClass = {
    영어: {
      A반: {
        href: "/lesson/english/basic",
        label: "영어 기초 강의",
      },
      B반: {
        href: "/lesson/english/intermediate",
        label: "영어 중급 강의",
      },
      C반: {
        href: "/lesson/english/advanced",
        label: "영어 고급 강의",
      },
    },
    스페인어: {
      A반: {
        href: "/lesson/spanish/basic",
        label: "스페인어 기초 강의",
      },
      B반: {
        href: "/lesson/spanish/intermediate",
        label: "스페인어 중급 강의",
      },
      C반: {
        href: "/lesson/spanish/advanced",
        label: "스페인어 고급 강의",
      },
    },
    일본어: {
      A반: {
        href: "/lesson/japanese/basic",
        label: "일본어 기초 강의",
      },
      B반: {
        href: "/lesson/japanese/intermediate",
        label: "일본어 중급 강의",
      },
      C반: {
        href: "/lesson/japanese/advanced",
        label: "일본어 고급 강의",
      },
    },
    중국어: {
      A반: {
        href: "/lesson/chinese/basic",
        label: "중국어 기초 강의",
      },
      B반: {
        href: "/lesson/chinese/intermediate",
        label: "중국어 중급 강의",
      },
      C반: {
        href: "/lesson/chinese/advanced",
        label: "중국어 고급 강의",
      },
    },
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedUser = sessionStorage.getItem("displayUser");
      if (!savedUser) return;

      try {
        const user = JSON.parse(savedUser);
        if (
          typeof user.name === "string" &&
          ["manager", "student"].includes(user.role)
        ) {
          setUserName(user.name);
          setUserRole(user.role);
          setIsLoggedIn(true);
        } else {
          sessionStorage.removeItem("displayUser");
        }
      } catch {
        sessionStorage.removeItem("displayUser");
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleSessionRestored = (event: Event) => {
      const { name, role } = (event as CustomEvent<{ name: string; role: string }>).detail;
      setUserName(name);
      setUserRole(role);
      setIsLoggedIn(true);
    };

    const handleSessionExpired = () => {
      setIsLoggedIn(false);
      setUserName("");
      setUserRole("");
      setApplications([]);
    };

    window.addEventListener("auth-session-restored", handleSessionRestored);
    window.addEventListener("auth-session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth-session-restored", handleSessionRestored);
      window.removeEventListener("auth-session-expired", handleSessionExpired);
    };
  }, []);
  
  async function handleLogout() {
    sessionStorage.removeItem("displayUser");
    const apiBaseUrl = "/api/backend";


    try {
      await fetch(`${apiBaseUrl}/logout`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (err) {
      console.error("로그아웃 요청 실패:", err);
    } finally {
      sessionStorage.removeItem("displayUser");


      setIsLoggedIn(false);
      setUserName("");
      setUserRole("");


      window.location.href = "/";
    }
  }

  useEffect(() => {
    if (!canAccessLessons) {
      return;
    }

    async function loadMyApplications() {


      const apiBaseUrl = "/api/backend";

      try {
        const response = await sessionFetch(
          `${apiBaseUrl}/applications/me`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "내 수강신청 목록 조회 오류:",
            data.detail
          );
          return;
        }

        setApplications(data.applications);
      } catch (error) {
        console.error(
          "내 수강신청 목록 조회 오류:",
          error
        );
      }
    }

    loadMyApplications();
  }, [canAccessLessons]);

  const links = canAccessAdmin
    ? [
        { href: "/admin", label: "수강 신청 목록", icon: "list" },
        { href: "/admin_inquiries", label: "문의 관리", icon: "chat" },
        { href: "/member_list", label: "회원 목록", icon: "user" },
      ] as const
    : [
        { href: "/#reviews", label: "수강평", icon: "star" },
        { href: "/#inquiries", label: "문의 사항", icon: "chat" },
        { href: "/#notice", label: "공지·이벤트", icon: "notice" },
      ] as const;

  return (
    <>
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-slate-300 bg-white shadow-sm">
      <div className="w-full border-b border-slate-800 bg-slate-900 px-4 py-2 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs sm:text-[13px]">
          <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-center tracking-tight text-slate-200">
            <span className="font-bold text-sky-400">✨ 12월 25일 마감 임박</span>
            <span aria-hidden="true" className="hidden text-slate-500 sm:inline">|</span>
            <span>
              영어·스페인어·일본어·중국어{" "}
              <strong className="font-semibold text-white">첫 달 수강료 10% 얼리버드 혜택</strong>
            </span>
          </p>
          <Link
            href="/register_agree"
            className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-900 shadow-xs transition-colors hover:bg-sky-50 sm:text-xs"
          >
            <span>할인 쿠폰 받기</span>
            <span aria-hidden="true" className="font-extrabold text-blue-600">&gt;</span>
          </Link>
        </div>
      </div>
      <div className="relative w-full border-b border-slate-200">
        <div className="mx-auto flex min-h-[60px] max-w-[1440px] items-center justify-between gap-2.5 px-4 md:min-h-20 md:flex-wrap md:gap-y-0 md:px-6 lg:flex-nowrap lg:gap-3 lg:px-7">
          <Link href="/" className="inline-flex shrink-0"><AcademyBrand /></Link>

          <nav aria-label="주 메뉴" className="hidden min-w-0 flex-1 items-center justify-center gap-3 md:order-last md:flex md:basis-full lg:order-none lg:basis-auto lg:gap-2.5 xl:gap-5">
            {!canAccessAdmin && (
              <Link href={academyLink.href} className={navClass}>
                <HeaderIcon name={academyLink.icon} />{academyLink.label}
              </Link>
            )}
            {!canAccessAdmin && (
              <div
                className="flex min-h-11 items-center lg:min-h-20"
                onMouseEnter={() => setSubjectsOpen(true)}
                onMouseLeave={(event) => {
                  if (!event.currentTarget.contains(document.activeElement)) setSubjectsOpen(false);
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setSubjectsOpen(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape" && subjectsOpen) {
                    setSubjectsOpen(false);
                    event.currentTarget.querySelector("button")?.focus();
                  }
                }}
              >
                <button
                  type="button"
                  aria-expanded={subjectsOpen}
                  aria-controls="desktop-subject-menu"
                  className={navClass}
                  onClick={() => setSubjectsOpen((open) => !open)}
                >
                  <HeaderIcon name="book" /> 강사진 소개 <HeaderIcon name="chevron" small />
                </button>
                <div id="desktop-subject-menu" hidden={!subjectsOpen} className="absolute inset-x-0 top-full border-y border-slate-200 bg-white px-6 py-4 shadow-md">
                  <div className="mx-auto grid max-w-2xl grid-cols-4 gap-3">
                    {subjects.map(({ href, label, icon }) => (
                      <Link key={href} href={href} onClick={() => setSubjectsOpen(false)} className="flex flex-col items-center gap-2 rounded-xl p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700">
                        <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><HeaderIcon name={icon} /></span>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {links.map(({ href, label, icon }) => (
              <Link key={href} href={href} className={navClass}><HeaderIcon name={icon} />{label}</Link>
            ))}
          </nav>

          <div className="flex min-w-0 items-center gap-1 sm:gap-3">
            {!canAccessAdmin && (
              <button
                type="button"
                aria-haspopup={canAccessLessons ? "dialog" : undefined}
                onClick={() => canAccessLessons ? setPaymentOpen(true) : window.alert("로그인이 필요한 서비스입니다.")}
                className="flex min-h-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-2.5 py-2 text-white shadow-sm transition-colors hover:from-sky-600 hover:to-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:px-3.5"
              >
                <CreditCard aria-hidden="true" className="size-4 stroke-[2.2]" />
                <span className="text-[11px] leading-none font-semibold tracking-tight sm:text-xs">수강결제</span>
              </button>
            )}
            {!isLoggedIn ? (
              <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                <Link href="/login" className="flex flex-col items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-2 text-xs font-semibold text-slate-600 hover:text-blue-700 sm:px-2 md:text-sm">
                  <HeaderIcon name="login" /> 로그인
                </Link>
                <Link href="/register_agree" className="flex flex-col items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-2 text-xs font-semibold text-slate-600 hover:text-blue-700 sm:px-2 md:text-sm">
                  <HeaderIcon name="signup" /> 회원가입
                </Link>
              </div>
            ) : (
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                {canAccessLessons ? (
                  <details className="group relative min-w-0">
                    <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-md py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 [&::-webkit-details-marker]:hidden">
                      <HeaderIcon name="user" />
                      <span className="max-w-24 truncate lg:max-w-36">{userName}</span>
                      <span className="shrink-0">{canAccessAdmin ? "관리자님" : "회원님"}</span>
                      <HeaderIcon name="chevron" small />
                    </summary>
                    <div className="absolute right-0 top-full z-10 max-h-[65vh] w-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                      {canAccessLessons && (
                        <>
                          <Link href="/application" className={accountClass}>수강 신청</Link>
                          <p className="px-3 pt-2 text-xs font-semibold text-slate-500">내 강의</p>
                          {applications.length === 0 && <p className="px-3 py-2 text-sm text-slate-600">신청한 강의가 없습니다.</p>}
                          {applications.map((application) => {
                            const key = `${application.subject}-${application.class_name}`;
                            if (application.status !== "승인완료") {
                              return <p key={key} className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{application.subject} {application.class_name} (대기중)</p>;
                            }
                            const lesson = lessonLinkBySubjectAndClass[
                              application.subject as keyof typeof lessonLinkBySubjectAndClass
                            ]?.[application.class_name as "A반" | "B반" | "C반"];
                            return lesson ? <Link key={key} href={lesson.href} className={accountClass}>{lesson.label} ({application.class_name})</Link> : null;
                          })}
                        </>
                      )}
                    </div>
                  </details>
                ) : (
                  <span className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <HeaderIcon name="user" />
                    <span className="truncate">{userName}</span>
                    <span className="shrink-0">관리자님</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="shrink-0 whitespace-nowrap rounded-md px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-700 md:text-sm"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>

        <nav aria-label="모바일 주 메뉴" className={`grid gap-1.5 border-t border-slate-100 px-3 py-2 md:hidden ${canAccessAdmin ? "grid-cols-3" : "grid-cols-4"}`}>
          {(canAccessAdmin ? links : [academyLink, ...subjects, ...links]).map(({ href, label, icon }) => (
            <Link key={href} href={href} className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg bg-slate-50 px-1.5 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700">
              <HeaderIcon name={icon} small />{label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
    {paymentOpen && canAccessLessons && <PaymentDialog onClose={() => setPaymentOpen(false)} />}
    </>
  );
}
