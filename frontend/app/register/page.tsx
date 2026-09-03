"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";


export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userBirth, setUserBirth] = useState("");
  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

async function handleRegister(
  e: React.FormEvent<HTMLFormElement>
) {
  console.log("handleRegister 실행됨");
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }


    const apiBaseUrl = `http://${window.location.hostname}:8000`;

    const response = await fetch(
      `${apiBaseUrl}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        username,
        password,
        birth_date: userBirth,
        phone: `${phoneFirst}${phoneMiddle}${phoneLast}`,
      }),
    }
  );

  const data = await response.json();

  

  if (response.ok) {
    alert(data.message ?? "회원가입이 완료되었습니다.");

    setName("");
    setUsername("");
    setPassword("");
    setUserBirth("");
    setPhoneFirst("");
    setPhoneMiddle("");
    setPhoneLast(""); 
    setConfirmPassword("");
  } else if (response.status === 400) {
    alert(data.detail ?? "입력값을 다시 확인해 주세요.");
  } else if (response.status === 409) {
    alert(data.detail ?? "이미 사용 중인 아이디입니다.");
  } else {
    alert("회원가입 중 서버 오류가 발생했습니다.");
  }
    

  console.log(data);
}




  return (
    <main className="grid min-h-screen items-center gap-12 bg-slate-100 p-6 md:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col justify-center text-center">
        <header className="flex items-center justify-center gap-3">
          <Image
            src="/j-academy-logo-main-v2.png"
            alt="제이 외국어 온라인 학원 로고"
            width={48}
            height={48}
            priority
          />
          <p className="text-sm font-semibold text-blue-600">
            제이 온라인 외국어 학원
          </p>
        </header>

        <h1 className="mt-3 text-4xl font-bold text-slate-900">
          회원가입
        </h1>

        <p className="mt-5 leading-7 text-slate-600">
          회원 유형을 선택하고
          필요한 정보를 입력해 주세요.
        </p>

        <Link
          href="/"
          className="mt-6 font-semibold text-blue-600"
        >
          홈으로 돌아가기
        </Link>
      </div>

      <div className="w-full rounded-xl bg-white p-8 shadow">
        <h2 className="text-2xl font-bold text-slate-900">
          회원 정보 입력
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          모든 필수 항목을 입력해 주세요.
        </p>

        <form
          onSubmit={handleRegister}
          className="mt-6 grid gap-4"
        >

          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700"
            >
              이름
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) =>
                      setName(event.target.value)
                    }
              className="rounded-lg border border-slate-300 px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="birth-date"
              className="text-sm font-medium text-slate-700"
            >
              생년월일
            </label>

            <input
              id="birth-date"
              name="birth_date"
              type="date"
              value={userBirth}
              onChange={(event) =>
                      setUserBirth(event.target.value)
                    }
              className="rounded-lg border border-slate-300 px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone-first"
              className="text-sm font-medium text-slate-700"
            >
              전화번호
            </label>

            <div className="flex items-center gap-2">
              <input
                id="phone-first"
                name="phone_first"
                value={phoneFirst}
                onChange={(event) => setPhoneFirst(event.target.value)}
                type="text"
                inputMode="numeric"
                placeholder="010"
                minLength={3}
                maxLength={3}
                pattern="[0-9]{3}"
                className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center"
                required
              />

              <span className="text-slate-500">
                -
              </span>

              <input
                id="phone-middle"
                name="phone_middle"
                value={phoneMiddle}
                onChange={(event) => setPhoneMiddle(event.target.value)}
                type="text"
                inputMode="numeric"
                placeholder="1234"
                minLength={3}
                maxLength={4}
                pattern="[0-9]{3,4}"
                aria-label="전화번호 가운데 자리"
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center"
                required
              />

              <span className="text-slate-500">
                -
              </span>

              <input
                id="phone-last"
                name="phone_last"
                value={phoneLast}
                onChange={(event) => setPhoneLast(event.target.value)}
                type="text"
                inputMode="numeric"
                placeholder="5678"
                minLength={4}
                maxLength={4}
                pattern="[0-9]{4}"
                aria-label="전화번호 마지막 자리"
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-700"
            >
              아이디
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="rounded-lg border border-slate-300 px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              비밀번호
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)} 
              className="rounded-lg border border-slate-300 px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password-confirm"
              className="text-sm font-medium text-slate-700"
            >
              비밀번호 확인
            </label>

            <input
              id="password-confirm"
              name="password_confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}  
              className="rounded-lg border border-slate-300 px-3 py-2"
              required
            />
          </div>


          <button
            type="submit"
            className="mt-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
          >
            회원가입
          </button>
        </form>
      </div>
    </main>
  );
}