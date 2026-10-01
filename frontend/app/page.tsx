"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


type LessonApplication = {
  subject: string;
  class_name: string;
  status: "승인대기" | "승인완료";
};


export default function Home() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
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
    const savedUser = sessionStorage.getItem("displayUser");
    if (!savedUser) {
      localStorage.removeItem("access_token");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (
        typeof user.name !== "string" ||
        !["manager", "student"].includes(user.role)
      ) {
        sessionStorage.removeItem("displayUser");
        localStorage.removeItem("access_token");
        return;
      }

      setUserName(user.name);
      setUserRole(user.role);
      setIsLoggedIn(true);
    } catch {
      sessionStorage.removeItem("displayUser");
      localStorage.removeItem("access_token");
    }
  }, []);
  
  async function handleLogout() {
    const token = localStorage.getItem("access_token");
    sessionStorage.removeItem("displayUser");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;


    try {
      await fetch(`${apiBaseUrl}/logout`, {
        method: "POST",
        headers: {
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
      setUsername("");
      setUserName("");
      setUserRole("");
      setPassword("");


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
    <main className="min-h-screen bg-slate-100 p-6">
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

      <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-7xl flex-col justify-center gap-16 px-4 py-16 lg:flex-row lg:items-center">

        <div className="flex-1 space-y-12 lg:pr-8">
          <div className="flex-1 space-y-12 lg:pr-8">
            <div className="space-y-6">
              <p className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-blue-600 bg-blue-50 border border-blue-100 uppercase">
                J ACADEMY PHILOSOPHY
              </p>

              <motion.h1
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  ease: "easeOut" 
                }}
                className="font-serif text-3xl font-bold leading-[1.3] text-slate-900 md:text-4xl break-keep tracking-tight"
              >
                언어를 배운다는 것은 <br />
                더 넓은 세상을 만나는 일입니다.
              </motion.h1>

              <motion.p
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 0.5, 
                  ease: "easeOut" 
                }}
                className="max-w-md text-lg leading-relaxed text-slate-600 mt-4 tracking-[-0.02em] break-keep"
              >
                진도를 빼는 것보다 중요한 것은, 오늘 배운 한 문장을 내일 당장 내 입으로 말할 수 있게 만드는 것입니다.
              </motion.p>
            </div>

            <div className="flex items-center gap-4">
              <Image
                src="/j-academy-logo-web.png"
                alt="학원 로고"
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
              />
              <div className="border-l-2 border-slate-200 pl-4">
                <p className="font-semibold text-slate-900 tracking-tight">제이 외국어 온라인 학원</p>
                <p className="text-sm text-slate-500 tracking-tight">원장 정지윤</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-lg mx-auto lg:mx-0 space-y-4">
          <div className="group flex items-start gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <div>
                <motion.h3
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 0.6, 
                  ease: "easeOut" 
                }}
                className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700"
              >
                내 수준에서 시작
              </motion.h3>
              <motion.p
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 0.6, 
                  ease: "easeOut" 
                }}
                className="mt-1 text-sm leading-relaxed text-slate-500 break-keep"
              >
                알파벳부터 시작해도 괜찮습니다. 학생마다 다른 출발점을 존중하고 가장 알맞은 목표를 설정합니다.
              </motion.p>
            </div>
          </div>


          <div className="group flex items-start gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <div>
              <motion.h3
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 0.8, 
                  ease: "easeOut" 
                }}
                className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700"
              >
                진짜 말하는 연습
              </motion.h3>
              <motion.p
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 0.8, 
                  ease: "easeOut" 
                }}
                className="mt-1 text-sm leading-relaxed text-slate-500 break-keep"
              >
                눈으로만 보는 암기가 아닌, 입 밖으로 소리 내어 말하는 실전 활용 능력을 최우선으로 기릅니다.
              </motion.p>
            </div>
          </div>


          <div className="group flex items-start gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <div>
                <motion.h3
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 1.0, 
                  ease: "easeOut" 
                }}
                className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700"
              >
                24시간 AI 학습 상담
              </motion.h3>
              <motion.p
                initial={{ opacity: 1, y: 0, filter: "blur(0px) saturate(100%)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px) saturate(100%)" 
                }}
                transition={{ 
                  duration: 1.0, 
                  delay: 1.0, 
                  ease: "easeOut" 
                }}
                className="mt-1 text-sm leading-relaxed text-slate-500 break-keep"
              >
                학습 중 막히는 부분이 있다면, 언제든 질문하고 답변받을 수 있는 스마트 학습 환경을 지원합니다.
              </motion.p>
            </div>
          </div>

        </div>
        
      </section>
    </main>
  );
}






