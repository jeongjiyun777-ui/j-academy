import os
from datetime import date
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pwdlib import PasswordHash
from sqlalchemy import URL, create_engine, text
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Request
from starlette.middleware.sessions import SessionMiddleware
from 챗봇 import make_answer


BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / "config" / ".env"

load_dotenv(dotenv_path=ENV_FILE)


DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    host=os.environ["DB_HOST"],
    port=int(os.environ["DB_PORT"]),
    database=os.environ["DB_NAME"],
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://172.30.1.78:3000",
        "http://172.30.1.93:3000",
        "http://100.100.100.29:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.environ["SESSION_SECRET"],
    same_site="lax",
    https_only=False,
)


ADMIN_NAME = os.environ["ADMIN_NAME"]
ADMIN_USERNAME = os.environ["ADMIN_USERNAME"]
ADMIN_PASSWORD_HASH = os.environ[
    "ADMIN_PASSWORD_HASH"
]
ADMIN_AGE = int(os.environ["ADMIN_AGE"])

password_hasher = PasswordHash.recommended()

class ManagerLogin(BaseModel):
    username: str
    password: str


class StudentRegister(BaseModel):
    name: str = Field(min_length=1, max_length=15)
    username: str = Field(min_length=3, max_length=15)
    password: str = Field(min_length=4)
    birth_date: date
    phone: str = Field(pattern=r"^010\d{8}$")

class ApplicationCreate(BaseModel):
    subject: str
    class_name: str

class FindIdRequest(BaseModel):
    name: str
    phone: str  

class ChatRequest(BaseModel):
    message: str    



@app.post("/register", status_code=201)
def register_student(student_data: StudentRegister):
    today = date.today()
    age = today.year - student_data.birth_date.year

    if (today.month, today.day) < (
        student_data.birth_date.month,
        student_data.birth_date.day,
    ):
        age -= 1

    if not 10 <= age <= 55:
        raise HTTPException(
            status_code=400,
            detail="가입 가능한 연령은 10세부터 55세까지입니다.",
        )

    duplicate_query = text("""
        SELECT 1
        FROM students
        WHERE id = :student_id
    """)

    insert_query = text("""
    
            name,
            username,
            password_hash,
            age,
            birth_date,
            phone
        )
        VALUES (
            :name,
            :username,
            :password_hash,
            :age,
            :birth_date,
            :phone
        )
        RETURNING id, name, username, birth_date, phone, created_at
    """)

    with engine.begin() as connection:
        duplicate = connection.execute(
            duplicate_query,
            {"username": student_data.username},
        ).scalar_one_or_none()

        if duplicate is not None:
            raise HTTPException(
                status_code=409,
                detail="이미 사용 중인 아이디입니다.",
            )

        row = connection.execute(
            insert_query,
            {
                "name": student_data.name,
                "username": student_data.username,
                "password_hash": password_hasher.hash(student_data.password),
                "age": age,
                "birth_date": student_data.birth_date,
                "phone": student_data.phone,
            },
        ).mappings().one()

    return {
        "message": "회원가입이 완료되었습니다.",
        "student": dict(row),
    }



@app.post("/setup/manager",status_code=201)

def create_first_manager():
    select_query = text("""
        SELECT COUNT(*)
        FROM managers
    """)

    insert_query = text("""
        INSERT INTO managers (
            name,
            username,
            password_hash,
            age
        )
        VALUES (
            :name,
            :username,
            :password_hash,
            :age
        )
        RETURNING
            id,
            name,
            username,
            age,
            status,
            created_at
    """)

    manager_data = {
        "name": ADMIN_NAME,
        "username": ADMIN_USERNAME,
        "password_hash": ADMIN_PASSWORD_HASH,
        "age": ADMIN_AGE,
    }

    with engine.begin() as connection:
        manager_count = connection.execute(
            select_query
        ).scalar_one()

        if manager_count > 0:
            raise HTTPException(
                status_code=409,
                detail="관리자 계정이 이미 존재합니다.",
            )

        row = connection.execute(
            insert_query,
            manager_data,
        ).mappings().one()


@app.post("/login")
def login(login_data: ManagerLogin, request: Request):
    manager_query = text("""
        SELECT id, name, username, password_hash, status
        FROM managers
        WHERE username = :username
    """)

    student_query = text("""
        SELECT id, name, username, password_hash
        FROM students
        WHERE username = :username
    """)

    with engine.connect() as connection:
        manager = connection.execute(
            manager_query,
            {"username": login_data.username},
        ).mappings().one_or_none()

        if manager is not None:
            if password_hasher.verify(
                login_data.password,
                manager["password_hash"],
            ):
                request.session.clear()
                request.session["role"] = "manager"
                request.session["manager_id"] = manager["id"]

                return {
                    "message": "관리자 로그인 성공",
                    "user": {
                        "name": manager["name"],
                        "username": manager["username"],
                        "role": "manager",
                    },
                }

        student = connection.execute(
            student_query,
            {"username": login_data.username},
        ).mappings().one_or_none()

        if student is not None:
            if password_hasher.verify(
                login_data.password,
                student["password_hash"],
            ):
                request.session.clear()
                request.session["role"] = "student"
                request.session["student_id"] = student["id"]

                return {
                    "message": "회원 로그인 성공",
                    "user": {
                        "name": student["name"],
                        "username": student["username"],
                        "role": "student",
                    },
                }

    raise HTTPException(
        status_code=401,
        detail="아이디 또는 비밀번호가 올바르지 않습니다.",
    )

@app.post("/logout")
def logout(request: Request):
    request.session.clear()
    return{
        "message": "로그아웃되었습니다."
    }



@app.post("/applications")
def apply_course(
    application: ApplicationCreate,
    request: Request,
):
    student_id = request.session.get("student_id")

    if not student_id:
        raise HTTPException(
            status_code=401,
            detail="수강신청은 로그인 후 이용할 수 있습니다.",
        )

    query = text("""
        UPDATE students
        SET
            subject = :subject,
            class_name = :class_name,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = :student_id
        RETURNING id, subject, class_name
    """)

    with engine.begin() as connection:
        row = connection.execute(
            query,
            {
                "student_id": student_id,
                "subject": application.subject,
                "class_name": application.class_name,
            },
        ).mappings().one_or_none()

    return {
        "message": "수강신청이 완료되었습니다.",
        "student": dict(row),
    }



@app.get("/me")
def get_current_user(request: Request):
    role = request.session.get("role")

    if role == "student":
        user_id = request.session.get("student_id")

    elif role == "manager":
        user_id = request.session.get("manager_id")

    else:
        user_id = None

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="로그인 후 이용해 주세요.",
        )

    return {
        "user": {
            "id": user_id,
            "role": role,
        },
    }



@app.get("/find-id")
def find_id(name: str, phone: str):
    query = text("""
        SELECT username
        FROM students
        WHERE name = :name
          AND phone = :phone
    """)

    with engine.connect() as connection:
        student = connection.execute(
            query,
            {"name": name, "phone": phone},
        ).mappings().one_or_none()

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="일치하는 회원 정보를 찾지 못했습니다.",
        )

    return {"username": student["username"]}



def get_chat_student(request: Request):
    role = request.session.get("role")
    student_id = request.session.get("student_id")

    # 로그인 여부와 학생 계정 여부 확인
    if role != "student" or not student_id:
        raise HTTPException(
            status_code=401,
            detail="AI 학습 상담은 학생 로그인 후 이용할 수 있습니다.",
        )

    query = text("""
        SELECT id, subject, class_name
        FROM students
        WHERE id = :student_id
    """)

    with engine.connect() as connection:
        student = connection.execute(
            query,
            {"student_id": student_id},
        ).mappings().one_or_none()

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="학생 정보를 찾을 수 없습니다.",
        )

    subject = (student["subject"] or "").strip()
    class_name = (student["class_name"] or "").strip()

    # 로그인은 했지만 수강신청하지 않은 경우
    if not subject or not class_name:
        raise HTTPException(
            status_code=403,
            detail="AI 학습 상담은 수강신청 회원만 이용할 수 있습니다.",
        )

    return {
        "id": student["id"],
        "subject": subject,
        "class_name": class_name,
    }


@app.get("/chat/access")
def check_chat_access(request: Request):
    student = get_chat_student(request)

    return {
        "allowed": True,
        "subject": student["subject"],
        "class_name": student["class_name"],
    }


@app.post("/chat")
def chat(
    chat_data: ChatRequest,
    request: Request,
):
    student = get_chat_student(request)

    answer = make_answer(
        question=chat_data.message,
        subject=student["subject"],
        class_name=student["class_name"],
    )

    save_chat_history(
        student_id=student["id"],
        subject=student["subject"],
        class_name=student["class_name"],
        question=chat_data.message,
        answer=answer,
    )

    return {
        "answer": answer,
        "subject": student["subject"],
        "class_name": student["class_name"],
    }


def save_chat_history(
    student_id,
    subject,
    class_name,
    question,
    answer,
):
    query = text("""
        INSERT INTO chat_history (
            student_id,
            subject,
            class_name,
            question,
            answer,
            created_at
        )
        VALUES (
            :student_id,
            :subject,
            :class_name,
            :question,
            :answer,
            CURRENT_TIMESTAMP
        )
    """)

    with engine.begin() as connection:
        connection.execute(
            query,
            {
                "student_id": student_id,
                "subject": subject,
                "class_name": class_name,
                "question": question,
                "answer": answer,
            },
        )
