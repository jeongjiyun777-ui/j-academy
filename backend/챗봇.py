from pathlib import Path
import os

from dotenv import load_dotenv
from openai import OpenAI


BACKEND_PATH = Path(__file__).resolve().parent
ENV_FILE = BACKEND_PATH / "config" / ".env"

load_dotenv(dotenv_path=ENV_FILE)


client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"]
)


AI_COUNSELORS = {
    "영어": "제이",
    "스페인어": "루나",
    "일본어": "하루",
    "중국어": "메이",
}

EXIT_KEYWORDS = [
    "종료",
]

LEVEL_NAMES = {
    "A반": "초급",
    "B반": "중급",
    "C반": "상급",
}


def get_counselor_name(subject):
    counselor_name = AI_COUNSELORS.get(subject)

    if counselor_name is None:
        raise ValueError(
            f"지원하지 않는 외국어입니다: {subject}"
        )

    return counselor_name


def get_level_name(class_name):
    level_name = LEVEL_NAMES.get(class_name)

    if level_name is None:
        raise ValueError(
            f"지원하지 않는 학습 수준입니다: {class_name}"
        )

    return level_name

def is_exit_message(question):
    normalized_question = question.strip().lower()

    return any(
        keyword in normalized_question
        for keyword in EXIT_KEYWORDS
    )


def ask_openai(
    question,
    subject,
    level,
):
    counselor_name = get_counselor_name(subject)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": f"""
    당신은 제이 외국어 온라인 학원의
    {subject} 학습 AI 상담사 {counselor_name}입니다.

    학생의 현재 학습 수준은 {level}입니다.

    학생의 수준에 맞는 단어와 문법으로 설명하세요.
    답변은 너무 길지 않게 작성하세요.
    짧고 이해하기 쉬운 예문을 1~3개 제공하세요.
    마지막에는 학생이 직접 풀 수 있는 연습 문제를 1개 제시하세요.
    정답은 학생이 요청하기 전까지 먼저 알려주지 마세요.
    {subject} 학습과 무관한 질문에는 답변하지 마세요.
    """,
            },
            {
                "role": "user",
                "content": question,
            },
        ],
        max_tokens=500,
    )

    answer = response.choices[0].message.content

    if not answer:
        return "답변을 생성하지 못했습니다."

    return answer


def make_answer(
    question,
    subject,
    class_name,
):
    level_name = get_level_name(class_name)

    return ask_openai(
        question=question,
        subject=subject,
        level=level_name,
    )