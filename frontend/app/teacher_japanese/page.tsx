import Image from "next/image";
import Link from "next/link";

export default function TeachersPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">

        <div className="mt-3 flex items-center justify-center gap-3">
          <Image
            src="/j-academy-logo-main-v2.png"
            alt="제이 외국어 온라인 학원 로고"
            width={58}
            height={58}
            priority
          />

          <h1 className="text-4xl font-bold leading-tight text-slate-900">
            제이 외국어 온라인 학원
          </h1>
        </div>

        <div className="mt-8 grid gap-6">

          <section className="flex flex-col gap-10 rounded-xl bg-white p-8 shadow md:flex-row">
            {/* 왼쪽: 사진, 경력, 학력 */}
            <div className="grid w-full gap-4 md:w-72 md:shrink-0">
              <Image
                src="/images/teachers/japanese-teacher.png"
                alt="일본어 선생님"
                width={320}
                height={320}
                className="aspect-square w-full rounded-lg object-cover"
              />

              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">
                  경력💼
                </h3>

                <ol
                  type="I"
                  className="mt-3 list-outside space-y-3 pl-6 text-sm leading-6 text-slate-800 marker:font-semibold marker:text-blue-600"
                >
                  <li>
                    前) 도쿄 소재 어학원 일본어 강사 (2년)
                  </li>

                  <li>
                    前) 한일 교류 프로그램 언어·문화 코디네이터
                    (1년)
                  </li>

                  <li>
                    現) 제이 외국어 온라인학원 JLPT 단기 합격반 및
                    EJU 일본어 대표 강사
                  </li>
                </ol>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">
                  학력🎓
                </h3>

                <ol
                  type="I"
                  className="mt-3 list-outside space-y-3 pl-6 text-sm leading-6 text-slate-800 marker:font-semibold marker:text-blue-600"
                >
                  <li>
                    <span className="block">
                      Waseda University
                    </span>
                    <span className="block">
                     교육학부 일본어교육전공 학사
                    </span>
                    <span className="block">
                      (B.A. in Japanese Language Education)
                    </span>
                  </li>
                </ol>
              </div>
            </div>

            {/* 오른쪽: 선생님 말씀 */}
            <div className="flex flex-1 flex-col">

              <h2
                lang="ja"
                className="mt-2 text-3xl font-bold text-slate-900"
              >
                佐藤 陽葵 선생님
              </h2>

              <div className="mt-8 flex flex-1 flex-col justify-center rounded-xl border-l-4 border-blue-500 bg-blue-50 p-8 md:p-10">
                <h3 className="text-2xl font-bold tracking-wide text-slate-900 md:text-3xl">
                  선생님 말씀
                </h3>

                <blockquote className="mt-8 space-y-8 font-serif text-xl leading-10 tracking-wide text-slate-700 md:text-2xl md:leading-[3rem]">
                  <p
                    lang="ja"
                    className="italic"
                  >
                    “日本語の勉強が楽しくなるように、基礎から丁寧に
                    サポートします。私と一緒に一歩ずつ着実に
                    ステップアップしていきましょう！”
                  </p>

                  <p>
                    “일본어 공부가 매일 기다려지고 즐거워질 수 있도록
                    기초부터 친절하고 다정하게 지도해 드리겠습니다.
                    저와 함께 한 걸음씩 확실하게 목표를 달성해 봐요!”
                  </p>
                </blockquote>
              </div>
            </div>
          </section>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block font-semibold text-blue-600"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}