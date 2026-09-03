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
                src="/images/teachers/spanish-teacher.png"
                alt="스페인어 선생님"
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
                  className="mt-3 list-outside space-y-3 pl-6 text-sm leading-6 text-slate-800  marker:font-semibold marker:text-blue-600"
                >
                  <li>
                    前) 마드리드 주립 어학원 외국인을 위한
                    스페인어(ELE) 튜터 (2년)
                  </li>

                  <li>
                    前) 외교관 및 기업 임원 대상 스페인어 출강 강사
                    (2년)
                  </li>

                  <li>
                    現) 제이 외국어 온라인학원 DELE 전담 및
                    실전 회화 대표 강사
                  </li>
                </ol>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">
                  학력🎓
                </h3>

                <ol
                  type="I"
                  className="mt-3 list-outside space-y-3 pl-6 text-sm leading-6 text-slate-800  marker:font-semibold marker:text-blue-600"
                >
                  <li>
                    <span className="block">
                      Universidad Complutense de Madrid
                    </span>
                    <span className="block">
                      스페인어문학 학사
                    </span>
                    <span className="block">
                      (B.A. in Hispanic Philology)
                    </span>
                  </li>
                </ol>
              </div>
            </div>

            {/* 오른쪽: 선생님 말씀 */}
            <div className="flex flex-1 flex-col">

              <h2
                lang="es"
                className="mt-2 text-3xl font-bold text-slate-900"
              >
                Sofía Álvarez 선생님
              </h2>

              <div className="mt-8 flex flex-1 flex-col justify-center rounded-xl border-l-4 border-blue-500 bg-blue-50 p-8 md:p-10">
                <h3 className="text-2xl font-bold tracking-wide text-slate-900 md:text-3xl">
                  선생님 말씀
                </h3>

                <blockquote className="mt-8 space-y-8 font-serif text-xl leading-10 tracking-wide text-slate-700 md:text-2xl md:leading-[3rem]">
                  <p
                    lang="es"
                    className="italic"
                  >
                    “¡El español no es difícil, es una aventura maravillosa!
                    En mis clases aprenderás a expresarte con naturalidad y
                    confianza desde el primer día.”
                  </p>

                  <p>
                    “스페인어는 어렵지 않습니다. 즐거운 모험입니다!
                    첫 수업부터 두려움 없이 현지인처럼 자연스럽고 생생하게
                    소통할 수 있도록 몰입감 넘치는 수업을 선물하겠습니다.”
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