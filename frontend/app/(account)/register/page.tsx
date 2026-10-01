"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
  


export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("direct");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const isFormValid =
    name.trim().length > 0 &&
    emailId.trim().length > 0 &&
    emailDomain.trim().length > 0 &&
    password.length >= 8 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    birthYear.length === 4 &&
    birthMonth.length > 0 &&
    birthDay.length > 0 &&
    phoneFirst.length === 3 &&
    phoneMiddle.length === 4 &&
    phoneLast.length === 4;


  const handleDomainSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDomain(value);

    if (value === "direct") {
      setEmailDomain("");
    } else {
      setEmailDomain(value);
    }
  };

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);

    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(value);

    if (value.length < 8) {
      setPasswordMessage("비밀번호는 8자 이상 입력해 주세요.");
    } else if (!hasLetter) {
      setPasswordMessage("영문을 포함해 주세요.");
    } else if (!hasNumber) {
      setPasswordMessage("숫자를 포함해 주세요.");
    } else if (!hasSpecialCharacter) {
      setPasswordMessage("특수문자를 포함해 주세요.");
    } else {
      setPasswordMessage("사용 가능한 비밀번호입니다.");
    }
  }

  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return -1;
    const birth = new Date(birthDateString);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      alert("이름을 입력해 주세요.");
      return;
    }

    const trimmedId = emailId.trim();
    const trimmedDomain = emailDomain.trim();

    if (!trimmedId) {
      alert("이메일 아이디를 입력해 주세요.");
      return;
    }
    if (!trimmedDomain) {
      alert("이메일 도메인(예: naver.com)을 입력하거나 선택해 주세요.");
      return;
    }

    const fullUsername = `${trimmedId}@${trimmedDomain}`;
    const formattedMonth = birthMonth.padStart(2, "0");
    const formattedDay = birthDay.padStart(2, "0");
    const userBirth = `${birthYear}-${formattedMonth}-${formattedDay}`;
    if (!birthYear || !birthMonth || !birthDay) {
          alert("생년월일을 모두 입력해 주세요.");
          return;
        }
    const currentAge = calculateAge(userBirth);
    if (currentAge < 10 || currentAge > 70) {
      alert("가입 가능한 연령은 만 10세부터 70세까지입니다.");
      return;
    }

    const fullPhone = `${phoneFirst}${phoneMiddle}${phoneLast}`;
    const isPhoneValid = /^010\d{8}$/.test(fullPhone);
    if (!isPhoneValid) {
      alert("올바른 휴대폰 번호(010으로 시작하는 11자리)를 입력해 주세요.");
      return;
    }

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (password.length < 8 || !hasLetter || !hasNumber || !hasSpecial) {
      alert("비밀번호는 영문, 숫자, 특수문자를 모두 포함하여 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

      const response = await fetch(`${apiBaseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          username: fullUsername, 
          password,
          birth_date: userBirth,
          phone: fullPhone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message ?? "회원가입이 완료되었습니다.");
        router.push("/");


        setName("");
        setEmailId("");
        setEmailDomain("");
        setSelectedDomain("direct");
        setPassword("");
        setConfirmPassword("");
        setBirthYear("");
        setBirthMonth("");
        setBirthDay("");
        setPhoneFirst("");
        setPhoneMiddle("");
        setPhoneLast("");
        setPasswordMessage("");
      } else if (response.status === 400) {
        alert(data.detail ?? "입력값을 다시 확인해 주세요.");
      } else if (response.status === 409) {
        alert(data.detail ?? "이미 사용 중인 아이디 또는 전화번호입니다.");
      } else {
        alert(data.detail ?? "회원가입 중 서버 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("회원가입 전송 오류:", error);
      alert("서버와 통신할 수 없습니다.");
    }
  }


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
            새로운 시작을 위한 회원가입 정보를 입력해 주세요.
          </p>
        </div>

        <section className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-10">
          <form onSubmit={handleRegister} className="flex flex-col gap-10">
            
            <div className="flex flex-col gap-6">
              <h2 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800">
                1. 계정 정보
              </h2>

              <div className="flex flex-col gap-2">
                <label htmlFor="email-id" className="text-sm font-semibold text-slate-700">
                  아이디 <span className="text-blue-600">*</span>
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    id="email-id"
                    type="text"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value.trim())}
                    placeholder="아이디 입력"
                    className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                  <span className="hidden font-semibold text-slate-400 sm:inline">@</span>
                  <input
                    type="text"
                    value={emailDomain}
                    onChange={(e) => setEmailDomain(e.target.value.trim())}
                    readOnly={selectedDomain !== "direct"}
                    placeholder="도메인 입력"
                    className={`w-full flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all ${
                      selectedDomain !== "direct"
                        ? "cursor-not-allowed bg-slate-100 text-slate-500"
                        : "bg-slate-50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    }`}
                    required
                  />
                  <div className="relative sm:w-36">
                    <select
                      value={selectedDomain}
                      onChange={handleDomainSelect}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-8 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="direct">직접입력</option>
                      <option value="naver.com">naver.com</option>
                      <option value="gmail.com">gmail.com</option>
                      <option value="daum.net">daum.net</option>
                      <option value="kakao.com">kakao.com</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    비밀번호 <span className="text-blue-600">*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="영문, 숫자, 특수기호 포함 8자 이상"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                  {passwordMessage && (
                    <p className={`text-xs ${passwordMessage === "사용 가능한 비밀번호입니다." ? "text-emerald-600" : "text-rose-500"}`}>
                      {passwordMessage}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="password-confirm" className="text-sm font-semibold text-slate-700">
                    비밀번호 확인 <span className="text-blue-600">*</span>
                  </label>
                  <input
                    id="password-confirm"
                    name="password_confirm"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="비밀번호를 다시 입력해주세요"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                  {confirmPassword.length > 0 && (
                    <p
                      className={`text-xs ${
                        password === confirmPassword
                          ? "text-emerald-600"
                          : "text-rose-500"
                      }`}
                    >
                      {password === confirmPassword
                        ? "비밀번호가 일치합니다."
                        : "비밀번호가 일치하지 않습니다."}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800">
                2. 개인 정보
              </h2>

              <div className="flex w-full justify-center">
                <div className="flex w-full max-w-sm flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                    이름 <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="홍길동"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex w-full justify-center">
                <div className="flex w-full max-w-sm flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    생년월일 <span className="text-blue-600">*</span>
                  </label>
                  <div className="flex w-full items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-20 flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 text-center text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                    <span className="shrink-0 text-sm font-medium text-slate-500">년</span>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="MM"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-16 rounded-xl border border-slate-200 bg-slate-50 py-3 text-center text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                    <span className="shrink-0 text-sm font-medium text-slate-500">월</span>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="DD"
                      onChange={(e) => setBirthDay(e.target.value.replace(/[^0-9]/g, ""))}
                      value={birthDay}
                      className="w-16 rounded-xl border border-slate-200 bg-slate-50 py-3 text-center text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                    <span className="shrink-0 text-sm font-medium text-slate-500">일</span>
                  </div>
                </div>
              </div>

              <div className="flex w-full justify-center">
                <div className="flex w-full max-w-sm flex-col gap-2">
                  <label htmlFor="phone-first" className="text-sm font-semibold text-slate-700">
                    전화번호 <span className="text-blue-600">*</span>
                  </label>
                  <div className="flex w-full items-center gap-2">
                    <input
                      id="phone-first"
                      type="text"
                      inputMode="numeric"
                      value={phoneFirst}
                      onChange={(e) => setPhoneFirst(e.target.value)}
                      placeholder="010"
                      maxLength={3}
                      className="w-20 rounded-xl border border-slate-200 bg-slate-50 py-3 text-center text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                    <span className="shrink-0 text-slate-400">-</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={phoneMiddle}
                      onChange={(e) => setPhoneMiddle(e.target.value)}
                      placeholder="1234"
                      maxLength={4}
                      className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 text-center text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                    <span className="shrink-0 text-slate-400">-</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={phoneLast}
                      onChange={(e) => setPhoneLast(e.target.value)}
                      placeholder="5678"
                      maxLength={4}
                      className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 text-center text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <button
              type="submit"
              disabled={!isFormValid}
              className={`group mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-base font-bold text-white shadow-lg transition-all ${
                isFormValid
                  ? "bg-blue-600 shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98]"
                  : "cursor-not-allowed bg-slate-300 shadow-none"
              }`}
            >
              <span>회원가입 완료하기</span>
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
        </section>

        <div className="relative z-10 mt-6 w-full max-w-2xl pl-2">
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

