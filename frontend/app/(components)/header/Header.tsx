"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type LessonApplication = {
  subject: string;
  class_name: string;
  status: "승인대기" | "승인완료";
};


export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [applications, setApplications] = useState<LessonApplication[]>([]);
  const [openMenu, setOpenMenu] = useState<"user" | "admin" | null>(null);

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
    const token = localStorage.getItem("access_token");
    sessionStorage.removeItem("displayUser");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;


    try {
      await fetch(`${apiBaseUrl}/logout`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
    } catch (err) {
      console.error("로그아웃 요청 실패:", err);
    } finally {
      localStorage.removeItem("access_token");
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
      const token = localStorage.getItem("access_token");

      if (!token) {
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

      try {
        const response = await fetch(
          `${apiBaseUrl}/applications/me`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
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

  return (
    <header className="mx-auto flex h-14 sm:h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 bg-white rounded-2xl shadow-xs border border-slate-200/80 my-2 sm:my-3">
      <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <Image
          src="/j-academy-logo-web.png"
          alt="제이 외국어 온라인 학원 로고"
          width={40}
          height={40}
          className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0"
          priority
        />
        <span className="text-[14px] sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
          <span className="sm:hidden">제이외국어</span>
          <span className="hidden sm:inline">제이 외국어 온라인 학원</span>
        </span>
      </Link>
      <nav className="flex shrink-0 items-center gap-3 sm:gap-6">
        {userRole !== "manager" && (
          <div className="group relative flex items-center">
            <button
              type="button"
              onClick={() => setOpenMenu((current) => current === "user" ? null : "user")}
              aria-expanded={openMenu === "user"}
              className="relative flex items-center gap-1 py-3 text-[13px] font-medium text-slate-600 transition-colors duration-200 hover:text-blue-600 sm:gap-1.5 sm:text-[15px] after:absolute after:bottom-2 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-blue-600 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
            >
              {canAccessLessons ? (
                <span className="flex max-w-[120px] items-center gap-1 sm:max-w-none">
                  <span className="truncate">{userName}</span>
                  <span className="shrink-0">회원님</span>
                </span>
              ) : (
                "메뉴"
              )}
              <span
                aria-hidden="true"
                className="inline-block text-[10px] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180 sm:text-xs"
              >
                ↓
              </span>
            </button>

            <div className={`${openMenu === "user" ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"} absolute right-0 top-full z-50 min-w-52 rounded-xl border border-slate-100 bg-white py-2 shadow-xl transition-all md:invisible md:translate-y-2 md:opacity-0 md:group-hover:visible md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:visible md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100`}>
              <div className="px-4 py-1.5 text-xs font-bold text-slate-400">
                담당 선생님
              </div>
              <div className="grid grid-cols-2 gap-1 px-3 pb-2">
                <Link href="/teacher_english" className="rounded bg-slate-50 py-1.5 text-center text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600">영어</Link>
                <Link href="/teacher_spanish" className="rounded bg-slate-50 py-1.5 text-center text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600">스페인어</Link>
                <Link href="/teacher_japanese" className="rounded bg-slate-50 py-1.5 text-center text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600">일본어</Link>
                <Link href="/teacher_chinese" className="rounded bg-slate-50 py-1.5 text-center text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600">중국어</Link>
              </div>

              <div className="my-1 border-t border-slate-100" />
              <Link href="/reviews" className="block px-4 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 sm:text-sm">수강평</Link>
              <Link href="/inquiries" className="block px-4 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 sm:text-sm">문의 사항</Link>

              {canAccessLessons && (
                <>
                  <div className="my-1 border-t border-slate-100" />
                  <div className="px-4 py-1.5 text-xs font-bold text-slate-400">
                    {userName} 회원님
                  </div>
                  <Link href="/application" className="block px-4 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 sm:text-sm">
                    수강 신청
                  </Link>

                  <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400">
                    내 강의
                  </div>
                  {applications.length > 0 ? (
                    <div className="flex flex-col pb-1">
                      {applications.map((application) => {
                        const applicationKey = `${application.subject}-${application.class_name}`;

                        if (application.status !== "승인완료") {
                          return (
                            <div
                              key={applicationKey}
                              className="block whitespace-nowrap bg-amber-50/50 px-4 py-2 text-center text-xs font-medium text-amber-600 sm:text-sm"
                            >
                              {application.subject} {application.class_name} (대기중)
                            </div>
                          );
                        }

                        const lesson =
                          lessonLinkBySubjectAndClass[
                            application.subject as keyof typeof lessonLinkBySubjectAndClass
                          ]?.[
                            application.class_name as "A반" | "B반" | "C반"
                          ];

                        if (!lesson) return null;

                        return (
                          <Link
                            key={applicationKey}
                            href={lesson.href}
                            className="block whitespace-nowrap px-4 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 sm:text-sm"
                          >
                            {lesson.label} ({application.class_name})
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-2 text-xs text-slate-400">
                      신청한 강의가 없습니다.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full whitespace-nowrap border-t border-slate-100 px-4 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 sm:text-sm"
                  >
                    로그아웃
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {canAccessAdmin ? (
          <div className="group relative flex items-center">
            <button
              type="button"
              onClick={() => setOpenMenu((current) => current === "admin" ? null : "admin")}
              aria-expanded={openMenu === "admin"}
              className="relative flex max-w-[145px] items-center gap-1 py-3 text-[13px] font-medium text-slate-600 transition-colors duration-200 hover:text-blue-600 sm:max-w-none sm:gap-1.5 sm:text-[15px]"
            >
              <span className="truncate">{userName} 관리자님</span>
              <span
                aria-hidden="true"
                className="inline-block text-[10px] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180 sm:text-xs"
              >
                ↓
              </span>
            </button>

            <div className={`${openMenu === "admin" ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"} absolute right-0 top-full z-50 min-w-52 rounded-xl border border-slate-100 bg-white py-2 shadow-xl transition-all md:invisible md:translate-y-2 md:opacity-0 md:group-hover:visible md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:visible md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100`}>
              <Link href="/admin" className="block px-4 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 sm:text-sm">
                수강 신청 목록
              </Link>
              <Link href="/admin_inquiries" className="block px-4 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 sm:text-sm">
                문의 사항 엑셀 다운로드
              </Link>
              <Link href="/member_list" className="block px-4 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 sm:text-sm">
                회원 목록
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full whitespace-nowrap border-t border-slate-100 px-4 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 sm:text-sm"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : !isLoggedIn ? (
          <Link
            href="/login"
            className="relative flex items-center py-3 text-[13px] font-medium text-slate-600 transition-colors duration-200 hover:text-blue-600 sm:text-[15px]"
          >
            로그인
          </Link>
        ) : null}
      </nav>
    </header>
  );
}
