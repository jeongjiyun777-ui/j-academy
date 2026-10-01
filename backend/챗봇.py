from pathlib import Path
import os

from dotenv import load_dotenv
from openai import OpenAI


BACKEND_PATH = Path(__file__).resolve().parent
ENV_FILE = BACKEND_PATH / "config" / ".env"
ENV_EXAMPLE_FILE = BACKEND_PATH / "config" / ".env.example"

load_dotenv(
    dotenv_path=ENV_FILE
    if ENV_FILE.exists() and ENV_FILE.read_text(encoding="utf-8").strip()
    else ENV_EXAMPLE_FILE
)


client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)


LEVEL_NAMES = {
    "A반": "초급",
    "B반": "중급",
    "C반": "상급",
}
EXIT_KEYWORDS = {
    "종료"
}

def get_level_name(class_name: str) -> str:
    return LEVEL_NAMES.get(class_name, class_name)


def is_exit_message(question: str) -> bool:
    normalized_question = question.strip().lower()

    return any(
        keyword in normalized_question
        for keyword in EXIT_KEYWORDS
    )



def ask_openai(
    question: str,
    subject: str,
    level: str,
) -> str:
    return (
        f"{subject} {level} 학습 상담을 도와드리겠습니다. "
        "AI 학습 상담 서비스는 현재 준비 중입니다. "
        "담당 상담사가 준비를 완료하면 안내해 드리겠습니다. "
        "종료를 원하시면 '종료'라고 입력해 주세요."
    )

def make_answer(
    question: str,
    subject: str,
    class_name: str,
) -> str:
    level_name = get_level_name(class_name)

    return ask_openai(
        question=question,
        subject=subject,
        level=level_name,
    )
