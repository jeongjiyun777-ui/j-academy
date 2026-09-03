import Link from "next/link";
import Image from "next/image";

export default function ManagePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
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
      
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">
          학생 수강평
        </h1>

            <div className="mt-8 grid gap-6">
              <section className="flex min-h-64 flex-col gap-8 rounded-xl bg-white p-6 shadow md:flex-row">
                {/* 왼쪽: 별점, 사진, 이름 */}
                <div className="grid w-full content-start gap-4 border-b border-slate-200 pb-6 md:w-52 md:shrink-0 md:border-b-0 md:border-r md:pb-0 md:pr-8">
                  <div
                    className="text-center text-xl tracking-wider text-yellow-400"
                    aria-label="별점 5점"
                  >
                    <span className="text-yellow-400">
                      ★★★★★
                    </span>
                  </div>

                  <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-200 text-sm text-slate-500">
                    <Image
                      src="/images/students/student.png"
                      alt="김** 학생"
                      width={320}
                      height={320}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  </div>

                  <h2 className="text-center text-xl font-bold text-slate-900">
                    김**
                  </h2>
                </div>

              {/* 오른쪽: 수강평 */}
              <div className="grid flex-1 grid-rows-[auto_1fr]">
                {/* 선택 과목 영역 */}
                <div className="grid gap-2 border-b border-slate-200 pb-6">
                  <h3 className="text-sm font-semibold text-slate-500">
                    선택한 과목
                  </h3>

                  <p className="text-xl font-bold text-slate-900">
                    영어
                  </p>
                </div>

                {/* 수강평 영역 */}
                <div className="grid content-start gap-3 pt-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    수강평
                  </h3>

                  <p className="text-lg font-semibold leading-8 text-slate-900">
                    기초 문법부터 차근차근 설명해 주셔서 영어에 대한 자신감이 생겼습니다.
                  </p>
                  </div>
                </div>
              </section>
          </div>


          <div className="mt-8 grid gap-6">
            <section className="flex min-h-64 flex-col gap-8 rounded-xl bg-white p-6 shadow md:flex-row">
              {/* 왼쪽: 별점, 사진, 이름 */}
              <div className="grid w-full content-start gap-4 border-b border-slate-200 pb-6 md:w-52 md:shrink-0 md:border-b-0 md:border-r md:pb-0 md:pr-8">
                <div
                  className="text-center text-xl tracking-wider text-yellow-400"
                  aria-label="별점 5점"
                >
                  <span className="text-yellow-400">
                    ★★★★★
                  </span>
                </div>

                <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-200 text-sm text-slate-500">
                    <Image
                      src="/images/students/student.png"
                      alt="박** 학생"
                      width={320}
                      height={320}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                </div>

                <h2 className="text-center text-xl font-bold text-slate-900">
                  박**
                </h2>
              </div>

              {/* 오른쪽: 수강평 */}
              <div className="grid flex-1 grid-rows-[auto_1fr]">
                {/* 선택 과목 영역 */}
                <div className="grid gap-2 border-b border-slate-200 pb-6">
                  <h3 className="text-sm font-semibold text-slate-500">
                    선택한 과목
                  </h3>

                  <p className="text-xl font-bold text-slate-900">
                    중국어
                  </p>
                </div>

                {/* 수강평 영역 */}
                <div className="grid content-start gap-3 pt-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    수강평
                  </h3>

                  <p className="text-lg font-semibold leading-8 text-slate-900">
                    발음과 성조를 반복해서 연습하면서 중국어를 말하는 부담이 줄었습니다.
                  </p>
                  </div>
                </div>
              </section>
          </div>


          <div className="mt-8 grid gap-6">
            <section className="flex min-h-64 flex-col gap-8 rounded-xl bg-white p-6 shadow md:flex-row">
              {/* 왼쪽: 별점, 사진, 이름 */}
              <div className="grid w-full content-start gap-4 border-b border-slate-200 pb-6 md:w-52 md:shrink-0 md:border-b-0 md:border-r md:pb-0 md:pr-8">
                <div
                  className="text-center text-xl tracking-wider text-yellow-400"
                  aria-label="별점 5점"
                >
                  <span className="text-yellow-400">
                    ★★★★★
                  </span>
                </div>

                <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-200 text-sm text-slate-500">
                    <Image
                      src="/images/students/student.png"
                      alt="이** 학생"
                      width={320}
                      height={320}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                </div>

                <h2 className="text-center text-xl font-bold text-slate-900">
                  이**
                </h2>
              </div>

              {/* 오른쪽: 수강평 */}
              <div className="grid flex-1 grid-rows-[auto_1fr]">
                {/* 선택 과목 영역 */}
                <div className="grid gap-2 border-b border-slate-200 pb-6">
                  <h3 className="text-sm font-semibold text-slate-500">
                    선택한 과목
                  </h3>

                  <p className="text-xl font-bold text-slate-900">
                    일본어
                  </p>
                </div>

                {/* 수강평 영역 */}
                <div className="grid content-start gap-3 pt-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    수강평
                  </h3>

                  <p className="text-lg font-semibold leading-8 text-slate-900">
                    어려웠던 일본어 문법을 쉽게 설명해 주셔서 학습 내용을 이해하는 데 도움이 되었습니다.
                  </p>
                  </div>
                </div>
              </section>
          </div>


          
          
          <div className="mt-8 grid gap-6">
            <section className="flex min-h-64 flex-col gap-8 rounded-xl bg-white p-6 shadow md:flex-row">
              {/* 왼쪽: 별점, 사진, 이름 */}
              <div className="grid w-full content-start gap-4 border-b border-slate-200 pb-6 md:w-52 md:shrink-0 md:border-b-0 md:border-r md:pb-0 md:pr-8">
                <div
                  className="text-center text-xl tracking-wider text-yellow-400"
                  aria-label="별점 5점"
                >
                  <span className="text-yellow-400">
                    ★★★★★
                  </span>
                </div>

                <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-200 text-sm text-slate-500">
                    <Image
                      src="/images/students/student.png"
                      alt="정** 학생"
                      width={320}
                      height={320}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                </div>

                <h2 className="text-center text-xl font-bold text-slate-900">
                  정**
                </h2>
              </div>

              {/* 오른쪽: 수강평 */}
              <div className="grid flex-1 grid-rows-[auto_1fr]">
                {/* 선택 과목 영역 */}
                <div className="grid gap-2 border-b border-slate-200 pb-6">
                  <h3 className="text-sm font-semibold text-slate-500">
                    선택한 과목
                  </h3>

                  <p className="text-xl font-bold text-slate-900">
                    스페인어
                  </p>
                </div>

                {/* 수강평 영역 */}
                <div className="grid content-start gap-3 pt-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    수강평
                  </h3>

                  <p className="text-lg font-semibold leading-8 text-slate-900">
                    실생활에서 활용할 수 있는 표현을 중심으로 배워 스페인어 회화가 재미있어졌습니다.
                  </p>
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