"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";


export default function ApplicationPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [resultMessage, setResultMessage] = useState("");

async function handleApplication(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const apiBaseUrl = `http://${window.location.hostname}:8000`;

  try {
    const response = await fetch(`${apiBaseUrl}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        subject: selectedSubject,
        class_name: selectedClass,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setResultMessage("수강신청이 완료되었습니다.");
      setSelectedSubject("");
      setSelectedClass("");
    } else {
      setResultMessage(data.detail ?? "수강신청에 실패했습니다.");
    }
  } catch {
    setResultMessage("서버에 연결하지 못했습니다.");
  }
}

  return (
    <main className="min-h-screen bg-slate-100 p-6">

      <header className="flex items-center gap-3">
        <Image
          src="/j-academy-logo-main-v2.png"
          alt="제이 외국어 온라인 학원 로고"
          width={48}
          height={48}
          priority
        />

        <div>
          <p className="text-xs font-semibold text-blue-600">
            온라인 입시 학원 관리 서비스
          </p>

          <h1 className="text-xl font-bold text-slate-900">
            제이 외국어 온라인 학원
          </h1>
        </div>
      </header>


      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-slate-900">
          수강 신청
        </h1>

        <p className="mt-2 text-slate-600">
          수강할 외국어와 반을 선택해 주세요.
        </p>

        <form className="mt-8" onSubmit={handleApplication}>
            {/* 첫 번째 섹션: 외국어 선택 */}
            <section>
              <label
                htmlFor="subject"
                className="text-sm font-semibold text-slate-700"
            >
              외국어 선택
            </label>

            <select
              id="subject"
              name="subject"
              value={selectedSubject}
              onChange={(event) => {
                setSelectedSubject(event.target.value);
                setSelectedClass("");
              }}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
              required
            >
              <option value="">
                외국어를 선택해 주세요
              </option>

              <option value="영어">
                영어
              </option>

              <option value="스페인어">
                스페인어
              </option>

              <option value="일본어">
                일본어
              </option>

              <option value="중국어">
                중국어
              </option>
            </select>
          </section>

          {/* 두 번째 섹션: 반 선택 */}
          {selectedSubject && (
            <section className="mt-8">
              <h2>{selectedSubject} 반 선택</h2>

              <div className="mt-4 flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="class_level"
                    value="A반"
                    onChange={(event) =>
                      setSelectedClass(event.target.value)
                    }
                  />
                  A반
                </label>

                <label>
                  <input
                    type="radio"
                    name="class_level"
                    value="B반"
                    onChange={(event) =>
                      setSelectedClass(event.target.value)
                    }
                  />
                  B반
                </label>

                <label>
                  <input
                    type="radio"
                    name="class_level"
                    value="C반"
                    onChange={(event) =>
                      setSelectedClass(event.target.value)
                    }
                  />
                  C반
                </label>
              </div>
            </section>
          )}
          
        <button
          type="submit"
          disabled={!selectedSubject || !selectedClass}
          className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          수강 신청하기
        </button>
        </form>

        {resultMessage && (
          <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-800">
            {resultMessage}
          </div>
        )}

        <Link
          href="/"
          className="mt-6 inline-block font-semibold text-blue-600"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
