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
                src="/images/teachers/chinese-teacher.png"
                alt="중국어 선생님"
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
                    前) 베이징 소재 어학원 외국인 전담 중국어 강사
                    (2년)
                  </li>

                  <li>
                    前) 글로벌 대기업 임원진 비즈니스 중국어
                    전담 트레이너 (2년)
                  </li>

                  <li>
                    現) 제이 외국어 온라인학원 HSK 자격증 대표 강사
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
                      Beijing University
                    </span> 
                    <span className="block">      
                     대외한어과 학사 (B.A. in TCSOL) 
                    </span>
                  </li>
                </ol>
              </div>
            </div>

            {/* 오른쪽: 선생님 말씀 */}
            <div className="flex flex-1 flex-col">
              <h2
                lang="zh-CN"
                className="mt-2 text-3xl font-bold text-slate-900"
              >
                张雨桐 선생님
              </h2>

              <div className="mt-8 flex flex-1 flex-col justify-center rounded-xl border-l-4 border-blue-500 bg-blue-50 p-8 md:p-10">
                <h3 className="text-2xl font-bold tracking-wide text-slate-900 md:text-3xl">
                  선생님 말씀
                </h3>

                <blockquote className="mt-8 space-y-8 font-serif text-xl leading-10 tracking-wide text-slate-700 md:text-2xl md:leading-[3rem]">
                  <p
                    lang="zh-CN"
                    className="italic"
                  >
                    “用最高效的方法，带你掌握精准地道的中文。
                    从正确发音到高阶表达，让你的汉语学习事半功倍！”
                  </p>

                  <p>
                    “가장 명쾌하고 효율적인 전략으로 체계적인 중국어를
                    완성해 드리겠습니다. 정확한 성조 발음부터 고득점 시험과
                    비즈니스 회화까지, 여러분의 노력이 배의 결실을 맺도록
                    이끌겠습니다.”
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