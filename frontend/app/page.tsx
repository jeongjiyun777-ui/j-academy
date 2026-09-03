"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";


export default function Home() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const apiBaseUrl = `http://${window.location.hostname}:8000`;

    const response = await fetch(
      `${apiBaseUrl}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

  const data = await response.json();

  if (response.ok) {
    setIsLoggedIn(true);
    setUserName(data.user.name);
    setUserRole(data.user.role);
    setPassword("");
  } else {
    alert(data.detail ?? "아이디 또는 비밀번호가 올바르지 않습니다.");
  }
  

  console.log(data);
}

async function handleLogout() {
  const apiBaseUrl = `http://${window.location.hostname}:8000`;

  await fetch(`${apiBaseUrl}/logout`, {
    method: "POST",
    credentials: "include",
  });

  setIsLoggedIn(false);
  setUsername("");
  setUserName("");
  setUserRole("");
  setPassword("");
}


function handleApplicationClick(
  event: React.MouseEvent<HTMLAnchorElement>
) {
  if (!isLoggedIn) {
    event.preventDefault();
    alert("로그인 후 이용해 주세요.");
    return;
  }

  if (userRole !== "student") {
    event.preventDefault();
    alert("수강신청은 학생 계정만 이용할 수 있습니다.");
  }
}


  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <header className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-2">
        {/* 왼쪽: 로고와 학원명 */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <Image
            src="/j-academy-logo-main-v2.png"
            alt="제이 외국어 온라인 학원 로고"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />

          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              제이 외국어 온라인 학원
            </span>
          </div>
        </Link>

        {/* 오른쪽: 주요 메뉴 */}
        <nav className="flex items-center gap-8">
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-2 py-3 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
            >
              담당 선생님

              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-200 group-hover:rotate-180"
              >
                ↓
              </span>
            </button>
            

            {/* 마우스를 올리면 나타나는 메뉴 */}
            <div className="invisible absolute left-0 top-full z-50 min-w-36 translate-y-2 rounded-lg bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <Link
                href="/teacher_english"
                className="block whitespace-nowrap px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              >
                영어
              </Link>

              <Link
                href="/teacher_spanish"
                className="block whitespace-nowrap px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              >
                스페인어
              </Link>

              <Link
                href="/teacher_japanese"
                className="block whitespace-nowrap px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              >
                일본어
              </Link>

              <Link
                href="/teacher_chinese"
                className="block whitespace-nowrap px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              >
                중국어
              </Link>
            </div>
          </div>

          <Link
            href="/application"
            onClick={handleApplicationClick}
            className="text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
          >
            수강 신청
          </Link>

          <Link
            href="/manage"
            className="text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
          >
            학생 후기
          </Link>

          <Link
            href="/login"
            className="text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
          >
            로그인
          </Link>
        </nav>
      </header>

      {/* 메인 소개 영역 */}
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-7xl flex-col justify-center gap-16 px-2 py-16 lg:flex-row lg:items-center">
        {/* 왼쪽: 원장 인사말 */}
        <div className="grid flex-1 gap-12">
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] text-slate-500">
              DIRECTOR’S MESSAGE
            </p>

            <h1 className="mt-6 font-serif text-3xl font-medium leading-[1.4] tracking-tight text-slate-950 md:text-4xl">
              <span className="block whitespace-nowrap">
                언어를 배운다는 것은
              </span>

              <span className="mt-2 block whitespace-nowrap">
                더 넓은 세상을 만나는 일입니다.
              </span>
            </h1>

            <div className="mt-10 max-w-xl space-y-5 text-base leading-8 text-slate-600">
              <p>
                학생마다 배우는 속도와 목표는 다릅니다.
                제이 외국어 온라인 학원은 정해진 진도보다 학생이 제대로
                이해하고 활용하는 과정을 더 중요하게 생각합니다.
              </p>

              <p>
                한 문장을 스스로 말하는 작은 변화가 외국어에 대한 자신감으로
                이어질 수 있도록 학생의 현재 수준에서 함께 시작하겠습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Image
              src="/j-academy-logo-main-v2.png"
              alt="제이 외국어 온라인 학원 로고"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
            />

            <div className="border-l border-slate-300 pl-5">
              <p className="font-serif text-lg font-semibold text-slate-900">
                제이 외국어 온라인 학원
              </p>

              <p className="mt-2 text-sm text-slate-500">
                원장 정지윤
              </p>
            </div>
          </div>
        </div>

        {/* 오른쪽: 학원 소개 */}
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-lg">
            <p className="text-sm font-semibold tracking-[0.2em] text-blue-600 mb-2">
              ABOUT J ACADEMY
            </p>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-700">
              학생의 현재 수준에서 시작하는
              <span className="block text-slate-700">
                맞춤형 외국어 교육
              </span>
            </h2>

            <div className="mt-8 space-y-6 text-base leading-8 text-slate-600">
              <p>
                제이 외국어 온라인 학원은 영어·스페인어·일본어·중국어를
                학생의 수준과 학습 목표에 맞춰 체계적으로 지도합니다.
              </p>

              <p>
                단순히 많은 내용을 외우는 수업보다, 실제로 이해하고 말하며
                활용할 수 있는 학습 경험을 중요하게 생각합니다.
              </p>

              <p>
                기초부터 심화 과정까지 학생마다 다른 출발점을 존중하고,
                꾸준한 성장을 만들어갈 수 있도록 함께합니다.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 border-y border-slate-300 py-5 text-center">
              <div>
                <strong className="block text-xl font-bold text-slate-900">
                  4
                </strong>
                <span className="mt-1 block text-xs text-slate-500">
                  외국어 과정
                </span>
              </div>

              <div className="border-x border-slate-300">
                <strong className="block text-xl font-bold text-slate-900">
                  3
                </strong>
                <span className="mt-1 block text-xs text-slate-500">
                  수준별 과정
                </span>
              </div>

              <div>
                <strong className="block text-xl font-bold text-slate-900">
                  24H
                </strong>
                <span className="mt-1 block text-xs text-slate-500">
                  AI 학습 상담
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}