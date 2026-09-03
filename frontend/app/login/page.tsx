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
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-xl rounded-xl bg-white p-10 shadow">
        <header className="flex items-center justify-center gap-3">
          <Image
            src="/j-academy-logo-chat-body.png"
            alt="제이 외국어 온라인 학원 로고"
            width={48}
            height={48}
            priority
          />

          <h1 className="text-4xl font-bold leading-tight text-slate-900">
            제이 외국어 온라인 학원
          </h1>
        </header>

          {isLoggedIn ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                {userName}{" "}
                {userRole === "manager" ? "관리자님" : "회원님"}
              </h2>

              <p className="mt-2 text-slate-500">
                환영합니다.
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800"
                >로그아웃
              </button>
            </div>
          ) : (
            <>

              <p className="mt-2 text-sm text-slate-500">
                아이디와 비밀번호를 입력해 주세요.
              </p>

              <form
                onSubmit={handleLogin}
                className="mt-6 space-y-4"
              >
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-slate-700"
                    htmlFor="username"
                  >
                    아이디
                  </label>

                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-slate-700"
                    htmlFor="password"
                  >
                    비밀번호
                  </label>

                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                  type="submit"
                >
                  로그인
                </button>
                  <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-500">
                  <Link
                    href="/register"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    회원가입
                  </Link>
                  
                  <Link
                    href="/find_id"
                    className="hover:text-slate-800"
                  >
                    아이디 찾기
                  </Link>

                  <Link
                    href="/find_pw"
                    className="hover:text-slate-800"
                  >
                    비밀번호 찾기
                  </Link>
                </div>
              </form>
            </>
          )}
        </section>
    </main>
  );
}