import Link from "next/link";
import Image from "next/image";

export default function FindpwPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-xl rounded-xl bg-white p-10 shadow">
        <div className="mt-3 flex items-center justify-center gap-3">
          <Image
            src="/j-academy-logo-chat-body.png"
            alt="제이 외국어 온라인 학원 로고"
            width={58}
            height={58}
            priority
          />
          <h1 className="text-4xl font-bold leading-tight text-slate-900">
            제이 외국어 온라인 학원
          </h1>
        </div>



        <form className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              아이디
            </label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="아이디를 입력하세요"
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
              autoComplete="username"
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
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            비밀번호 재설정
          </button>
        </form>

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