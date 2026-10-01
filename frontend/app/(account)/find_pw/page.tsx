"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function FindpwPage() {
  const [emailUser, setEmailUser] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("direct");
  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [name, setName] = useState("");

  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  const fullUsername = emailDomain ? `${emailUser}@${emailDomain}` : emailUser;

  const isAccountFormValid =
    emailUser.trim().length > 0 &&
    emailDomain.trim().length > 0 &&
    name.trim().length >= 2 &&
    /^010$/.test(phoneFirst) &&
    /^\d{4}$/.test(phoneMiddle) &&
    /^\d{4}$/.test(phoneLast);

  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isPasswordValid =
    newPassword.length >= 8 && hasLetter && hasNumber && hasSpecial;

  const isResetFormValid =
    isAccountFormValid &&
    isAccountVerified &&
    isPasswordValid &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  function handleDomainChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSelectedDomain(val);
    if (val !== "direct") {
      setEmailDomain(val);
    } else {
      setEmailDomain("");
    }
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setNewPassword(value);

    const hasLetterCheck = /[A-Za-z]/.test(value);
    const hasNumberCheck = /\d/.test(value);
    const hasSpecialCheck = /[^A-Za-z0-9]/.test(value);

    if (value.length < 8) {
      setPasswordMessage("비밀번호는 8자 이상 입력해 주세요.");
    } else if (!hasLetterCheck) {
      setPasswordMessage("영문을 포함해 주세요.");
    } else if (!hasNumberCheck) {
      setPasswordMessage("숫자를 포함해 주세요.");
    } else if (!hasSpecialCheck) {
      setPasswordMessage("특수문자를 포함해 주세요.");
    } else {
      setPasswordMessage("사용 가능한 비밀번호입니다.");
    }
  }

  async function handleAccountCheck(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

    try {
      const response = await fetch(
        `${apiBaseUrl}/reset-password/check-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: fullUsername.trim(),
            name: name.trim(),
            phone: `${phoneFirst}${phoneMiddle}${phoneLast}`,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsAccountVerified(true);
        setResultMessage(data.message ?? "계정이 확인되었습니다. 새 비밀번호를 설정해 주세요.");
      } else {
        setIsAccountVerified(false);
        const errorMessage =
          typeof data.detail === "string"
            ? data.detail
            : "계정 확인에 실패했습니다.";
        setResultMessage(errorMessage);
      }
    } catch (error) {
      console.error("계정 확인 오류:", error);
      setIsAccountVerified(false);
      setResultMessage("서버와 통신할 수 없습니다. 백엔드 서버를 확인해 주세요.");
    }
  }

  async function handlePasswordReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setResultMessage("새 비밀번호를 모두 입력해 주세요.");
      return;
    }

    if (!isPasswordValid) {
      setResultMessage("비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResultMessage("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

      const response = await fetch(
        `${apiBaseUrl}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            username: fullUsername.trim(),
            phone: `${phoneFirst}${phoneMiddle}${phoneLast}`,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("비밀번호가 성공적으로 변경되었습니다.");

        setEmailUser("");
        setEmailDomain("");
        setSelectedDomain("direct");
        setName("");
        setPhoneFirst("");
        setPhoneMiddle("");
        setPhoneLast("");

        setNewPassword("");
        setConfirmPassword("");
        setPasswordMessage("");

        setIsAccountVerified(false);
        setIsResetSuccess(true);
        setResultMessage(
          data.message ?? "비밀번호가 성공적으로 변경되었습니다."
        );
      } else {
        const errorMessage =
          typeof data.detail === "string"
            ? data.detail
            : Array.isArray(data.detail)
              ? data.detail.map((err: { msg: string }) => err.msg).join(", ")
              : "비밀번호 변경에 실패했습니다.";

        setResultMessage(errorMessage);
        setIsResetSuccess(false);
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      setResultMessage("서버와 통신할 수 없습니다. 백엔드 서버를 확인해 주세요.");
      setIsResetSuccess(false);
    }
  }


  return (
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-12 font-sans overflow-hidden">
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
        </div>

        <section className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800">비밀번호 찾기</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              가입한 계정 정보를 확인한 후 새로운 비밀번호로 변경합니다.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleAccountCheck}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email-user" className="text-sm font-semibold text-slate-700">
                아이디 <span className="text-blue-600">*</span>
              </label>
              <div className="flex w-full items-center gap-1.5">
                <input
                  id="email-user"
                  type="text"
                  value={emailUser}
                  onChange={(e) => setEmailUser(e.target.value.trim())}
                  placeholder="아이디"
                  className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-3 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <span className="shrink-0 text-slate-400">@</span>
                <input
                  type="text"
                  value={emailDomain}
                  onChange={(e) => {
                    setEmailDomain(e.target.value.trim());
                    if (selectedDomain !== "direct") {
                      setSelectedDomain("direct");
                    }
                  }}
                  placeholder="도메인"
                  className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-3 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <select
                  value={selectedDomain}
                  onChange={handleDomainChange}
                  className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-2 text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="direct">직접 입력</option>
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="kakao.com">kakao.com</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                이름 <span className="text-blue-600">*</span>
              </label>
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone-first" className="text-sm font-semibold text-slate-700">
                전화번호 <span className="text-blue-600">*</span>
              </label>
              <div className="flex w-full items-center gap-2">
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
                  onChange={(e) => setPhoneFirst(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-20 rounded-xl border border-slate-200 bg-slate-50 py-3.5 text-center text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <span className="shrink-0 text-slate-400">-</span>
                <input
                  id="phone-middle"
                  name="phone_middle"
                  type="text"
                  inputMode="numeric"
                  placeholder="1234"
                  minLength={3}
                  maxLength={4}
                  pattern="[0-9]{3,4}"
                  value={phoneMiddle}
                  onChange={(e) => setPhoneMiddle(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3.5 text-center text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <span className="shrink-0 text-slate-400">-</span>
                <input
                  id="phone-last"
                  name="phone_last"
                  type="text"
                  inputMode="numeric"
                  placeholder="5678"
                  minLength={4}
                  maxLength={4}
                  pattern="[0-9]{4}"
                  value={phoneLast}
                  onChange={(e) => setPhoneLast(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3.5 text-center text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isAccountFormValid}
              className={`group mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-lg font-bold transition-all duration-200 ${
                isAccountFormValid
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98]"
                  : "cursor-not-allowed bg-slate-100 text-slate-400"
              }`}
            >
              <span>계정 확인</span>
              <svg
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          {isAccountVerified && (
            <form className="mt-8 flex flex-col gap-5 border-t border-slate-100 pt-8" onSubmit={handlePasswordReset}>
              <div className="mb-1 text-center">
                <h3 className="text-xl font-bold text-slate-800">새 비밀번호 설정</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">사용할 새로운 비밀번호를 입력해 주세요.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="new-password" className="text-sm font-semibold text-slate-700">
                  새 비밀번호 <span className="text-blue-600">*</span>
                </label>
                <div className="relative w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>
                {passwordMessage && (
                  <p className={`text-xs ${passwordMessage === "사용 가능한 비밀번호입니다." ? "text-emerald-600" : "text-rose-500"}`}>
                    {passwordMessage}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirm-password" className="text-sm font-semibold text-slate-700">
                  새 비밀번호 확인 <span className="text-blue-600">*</span>
                </label>
                <div className="relative w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>
                {confirmPassword.length > 0 && (
                  <p className={`text-xs ${newPassword === confirmPassword ? "text-emerald-600" : "text-rose-500"}`}>
                    {newPassword === confirmPassword ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isResetFormValid}
                className={`group mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-lg font-bold transition-all duration-200 ${
                  isResetFormValid
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98]"
                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
              >
                <span>비밀번호 변경</span>
                <svg
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </form>
          )}

          {resultMessage && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <div
                className={`flex w-full items-center gap-3 rounded-xl p-5 ${
                  isResetSuccess || isAccountVerified
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                <svg className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isResetSuccess || isAccountVerified ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <p className="font-medium text-sm sm:text-base">{resultMessage}</p>
              </div>

              {isResetSuccess && (
                <Link
                  href="/login"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98]"
                >
                  <span>로그인하러 가기</span>
                  <svg
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </section>

        <div className="relative z-10 mt-6 w-full max-w-md pl-2">
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

