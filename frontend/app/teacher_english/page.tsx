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
            <div className="grid w-full gap-4 md:w-72 md:shrink-0">
              <Image
                src="/images/teachers/english-teacher.png"
                alt="영어 선생님"
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
                    前) 뉴욕 프렙 스쿨 영문학 및 글쓰기 전임 교사
                    (3년)
                  </li>

                  <li>
                    前) 강남 어학원 SAT 및 고급 비즈니스 영어 강사
                    (4년)
                  </li>

                  <li>
                    現) 제이 외국어 온라인학원 고급 비즈니스 영어 및
                    영문학 통합 클래스 대표 강사
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
                    Columbia University 영문학과 학사
                    (B.A. in English Literature)
                  </li>

                  <li>
                    New York University 응용언어학 및 TESOL 석사
                    (M.A. in Applied Linguistics &amp; TESOL)
                  </li>
                </ol>
              </div>
            </div>

            {/* 오른쪽: 선생님 말씀 */}
            <div className="flex flex-1 flex-col">

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Theodore McKenzie 선생님
              </h2>

              <div className="mt-8 flex flex-1 flex-col justify-center rounded-xl border-l-4 border-blue-500 bg-blue-50 p-8 md:p-10">
                <h3 className="text-2xl font-bold tracking-wide text-slate-900 md:text-3xl">
                  선생님 말씀
                </h3>

                <blockquote className="mt-8 space-y-8 font-serif text-xl leading-10 tracking-wide text-slate-700 md:text-2xl md:leading-[3rem]">
                  <p
                    lang="en"
                    className="italic"
                  >
                    “My goal is to help you build true confidence in English.
                    From foundational grammar to expressive writing, we will
                    take every step together naturally and effectively.”
                  </p>


                  <p>
                    “단순한 암기가 아닌, 영어가 자연스럽게 느껴지도록
                    돕겠습니다. 기초 문법부터 논리적인 글쓰기까지 여러분이
                    확실한 자신감을 갖도록 탄탄한 실력을 함께 만들어 갑니다.”
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