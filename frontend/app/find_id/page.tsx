"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function FindIdPage() {
  const [name, setName] = useState("");
  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [username, setUsername] = useState("");  
  const [resultMessage, setResultMessage] = useState("");


async function handleFindId(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  const apiBaseUrl = `http://${window.location.hostname}:8000`;

  const params = new URLSearchParams({
    name,
    phone: `${phoneFirst}${phoneMiddle}${phoneLast}`,
  });

  const response = await fetch(
    `${apiBaseUrl}/find-id?${params.toString()}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (response.ok) {
    setUsername(data.username);
    setResultMessage(`아이디는 ${data.username}입니다.`);
  } else {
    setResultMessage(
      data.detail ?? "일치하는 회원 정보를 찾지 못했습니다."
    );
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

        <p className="mt-3 text-center text-lg text-slate-500">
          이름과 전화번호를 입력해 아이디를 찾습니다.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleFindId}
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              이름
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
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
                type="text"
                inputMode="numeric"
                placeholder="010"
                minLength={3}
                maxLength={3}
                pattern="[0-9]{3}"
                value={phoneFirst}
                onChange={(e) => setPhoneFirst(e.target.value)}
                className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center"
                required
              />

              <span className="text-slate-500">
                -
              </span>

              <input
                id="phone-middle"
                name="phone_middle"
                type="text"
                inputMode="numeric"
                placeholder="1234"
                minLength={3}
                maxLength={4}
                pattern="[0-9]{3,4}"
                aria-label="전화번호 가운데 자리"
              value={phoneMiddle}
                onChange={(e) => setPhoneMiddle(e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center"
                required
              />

              <span className="text-slate-500">
                -
              </span>

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
                onChange={(e) => setPhoneLast(e.target.value)}  
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            아이디 찾기
          </button>
        </form>

        {resultMessage && (
          <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-800">
            {resultMessage}
          </div>
        )}

        <Link
          href="/"
          className="mt-8 inline-block text-blue-600 hover:underline"
        >
          홈 화면으로 돌아가기
        </Link>
      </section>
    </main>
  );
}