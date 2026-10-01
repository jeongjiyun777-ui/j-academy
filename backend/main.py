import os
import re
import io
import pandas as pd
from datetime import date, datetime, timedelta
from pathlib import Path

import jwt
import requests
import math
from dotenv import load_dotenv
from typing import Literal
from fastapi import (
    BackgroundTasks,
    Depends,
    FastAPI,
    HTTPException,
    Request,
    Response,
    status,
    Query,
)

from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, field_validator
from pwdlib import PasswordHash
from sqlalchemy import URL, create_engine, text
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from starlette.middleware.sessions import SessionMiddleware

from 발송시스템 import (
    send_notification_email,
    send_subject_notification_email,
    send_inquiries_email,
)
from 챗봇 import (
    make_answer, 
    is_exit_message,
)

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / "config" / ".env"
ENV_EXAMPLE_FILE = BASE_DIR / "config" / ".env.example"

# Deployment platforms provide process environment variables. For local setup,
# load config/.env when it exists; otherwise use the documented example values.
load_dotenv(
    dotenv_path=ENV_FILE
    if ENV_FILE.exists() and ENV_FILE.read_text(encoding="utf-8").strip()
    else ENV_EXAMPLE_FILE
)


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

# Comma-separated production frontend origins, for example:
# FRONTEND_ORIGINS=https://your-frontend.example.com
production_frontend_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
]
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    *production_frontend_origins,
]

app.add_middleware(
    SessionMiddleware,
    secret_key=os.environ["SESSION_SECRET"],
    same_site="lax",
    https_only=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=(
        r"^http://(localhost|127\.0\.0\.1|"
        r"10(?:\.[0-9]{1,3}){3}|"
        r"192\.168(?:\.[0-9]{1,3}){2}|"
        r"172\.(?:1[6-9]|2[0-9]|3[0-1])(?:\.[0-9]{1,3}){2}|"
        r"100\.100\.100\.[0-9]{1,3}):3000$"
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Content-Disposition"],
)

ADMIN_NAME = os.environ["ADMIN_NAME"]
ADMIN_USERNAME = os.environ["ADMIN_USERNAME"]
ADMIN_PASSWORD_HASH = os.environ["ADMIN_PASSWORD_HASH"]
ADMIN_AGE = int(os.environ["ADMIN_AGE"])

password_hasher = PasswordHash.recommended()


SECRET_KEY = os.environ["SESSION_SECRET"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_student(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        student_id = payload.get("id") or payload.get("student_id")
        role = payload.get("role")

        if not student_id or role != "student":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="학생 권한이 필요합니다.",
            )
        return int(student_id)
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰이 유효하지 않거나 만료되었습니다.",
        )

def get_current_manager(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        manager_id = payload.get("manager_id") or payload.get("id")
        role = payload.get("role")

        if not manager_id or role != "manager":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="관리자 권한이 필요합니다.",
            )
        return int(manager_id)
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰이 유효하지 않거나 만료되었습니다.",
        )


class LoginRequest(BaseModel):
    username: str
    password: str


class StudentRegister(BaseModel):
    name: str = Field(min_length=1, max_length=15)
    username: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=8, max_length=64)
    birth_date: date
    phone: str = Field(pattern=r"^010\d{8}$")

    
    @field_validator("username")
    @classmethod
    def validate_username(cls, username: str) -> str:
        username = username.strip().lower()

        if not re.fullmatch(
            r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$",
            username,
        ):
            raise ValueError("올바른 이메일 형식을 입력해 주세요.")

        return username

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str) -> str:

        if not re.search(r"[A-Za-z]", password):
            raise ValueError("비밀번호에는 영문이 포함되어야 합니다.")

        if not re.search(r"\d", password):
            raise ValueError("비밀번호에는 숫자가 포함되어야 합니다.")

        if not re.search(r"[^A-Za-z0-9]", password):
            raise ValueError("비밀번호에는 특수문자가 포함되어야 합니다.")

        return password

class ApplicationCreate(BaseModel):
    subject: str
    class_name: str

class ApplicationStatusUpdate(BaseModel):
    application_id: int
    status: Literal["승인대기", "승인완료"]

class ApplicationStatusBatchUpdate(BaseModel):
    updates: list[ApplicationStatusUpdate]

class AdminStudentResponse(BaseModel):
    student_id: int
    name: str
    username: str
    created_at: datetime
    courses: dict[str, str | None]

class FindIdRequest(BaseModel):
    name: str
    phone: str
    birth_date: date

class ResetPasswordRequest(BaseModel):
    name: str
    username: str
    phone: str
    new_password: str = Field(min_length=8, max_length=64)

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, new_password: str) -> str:

        if not re.search(r"[A-Za-z]", new_password):
            raise ValueError("비밀번호에는 영문이 포함되어야 합니다.")

        if not re.search(r"\d", new_password):
            raise ValueError("비밀번호에는 숫자가 포함되어야 합니다.")

        if not re.search(r"[^A-Za-z0-9]", new_password):
            raise ValueError("비밀번호에는 특수문자가 포함되어야 합니다.")

        return new_password


class AccountCheckRequest(BaseModel):
    name: str
    username: str
    phone: str


class ChatRequest(BaseModel):
    message: str
    subject: str


class StudentSearchRequest(BaseModel):
    name: str = Field(min_length=1, max_length=15)


class InquiryCreate(BaseModel):
    inquiry_type: str
    name: str
    phone: str
    title: str
    content: str


@app.post("/register", status_code=status.HTTP_201_CREATED)
def register_student(
    student_data: StudentRegister,
    background_tasks: BackgroundTasks,
):
    today = date.today()
    age = today.year - student_data.birth_date.year

    if (today.month, today.day) < (
        student_data.birth_date.month,
        student_data.birth_date.day,
    ):
        age -= 1

    if not 10 <= age <= 70:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="가입 가능한 연령은 10세부터 70세까지입니다.",
        )

    duplicate_query = text("""
        SELECT
            EXISTS (
                SELECT 1
                FROM students
                WHERE username = :username
            ) AS username_exists,
            EXISTS (
                SELECT 1
                FROM students
                WHERE phone = :phone
            ) AS phone_exists
    """)

    insert_query = text("""
        INSERT INTO students (
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
        RETURNING
            id,
            name,
            username,
            birth_date,
            phone,
            created_at
    """)

    try:
        with engine.begin() as connection:
            duplicate = connection.execute(
                duplicate_query,
                {
                    "username": student_data.username,
                    "phone": student_data.phone,
                },
            ).mappings().one()

            if duplicate["username_exists"]:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="이미 사용 중인 아이디입니다.",
                )

            if duplicate["phone_exists"]:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        "한 사람당 하나의 계정만 만들 수 있습니다. "
                        "이미 가입한 경우 아이디 찾기를 이용해 주세요."
                    ),
                )

            row = connection.execute(
                insert_query,
                {
                    "name": student_data.name,
                    "username": student_data.username,
                    "password_hash": password_hasher.hash(
                        student_data.password
                    ),
                    "age": age,
                    "birth_date": student_data.birth_date,
                    "phone": student_data.phone,
                },
            ).mappings().one()

    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "이미 사용 중인 아이디 또는 전화번호입니다. "
                "한 사람당 하나의 계정만 만들 수 있습니다."
            ),
        ) from error

    try:
        background_tasks.add_task(
            send_notification_email,
            name=row["name"],
            phone=row["phone"],
        )
    except Exception as error:
        print(
            "[시스템 에러] 메일 발송 모듈 호출 중 "
            f"예외 발생: {error}"
        )

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
def login(login_data: LoginRequest):
    username = login_data.username.strip().lower()
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
            {"username": username},
        ).mappings().one_or_none()
        
        if manager is not None:
            if password_hasher.verify(
                login_data.password,
                manager["password_hash"],
            ):
            
                token_payload = {
                    "sub": manager["username"],
                    "id": manager["id"],
                    "role": "manager"
                }
    
                access_token = create_access_token(token_payload)
                
                return {
                    "message": "관리자 로그인 성공",
                    "access_token": access_token,  
                    "token_type": "bearer",
                    "user": {
                        "name": manager["name"],
                        "username": manager["username"],
                        "role": "manager",
                    },
                }

        student = connection.execute(
            student_query,
            {"username": username},
        ).mappings().one_or_none()

        if student is not None:
            if password_hasher.verify(
                login_data.password,
                student["password_hash"],
            ):
        
                token_payload = {
                    "sub": student["username"],
                    "id": student["id"],
                    "role": "student"
                }
      
                access_token = create_access_token(token_payload)
                
                return {
                    "message": "회원 로그인 성공",
                    "access_token": access_token, 
                    "token_type": "bearer",
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

def get_current_user_payload(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        role = payload.get("role")

        if not user_id or not role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않은 계정 정보입니다.",
            )
        return {"id": int(user_id), "role": role}
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰이 유효하지 않거나 만료되었습니다.",
        )

@app.get("/me")
def get_current_user(
    current_user: dict = Depends(get_current_user_payload),
):
    return {
        "user": {
            "id": current_user["id"],
            "role": current_user["role"],
        },
    }

@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "로그아웃되었습니다."}


@app.post("/applications")
def apply_course(
    application: ApplicationCreate,
    background_tasks: BackgroundTasks,
    student_id: int = Depends(get_current_student),
):
    target_subject = application.subject.strip()
    target_class = application.class_name.strip()

    with engine.begin() as connection:
        find_query = text("""
            SELECT name
            FROM students
            WHERE id = :student_id
        """)

        student = connection.execute(
            find_query,
            {"student_id": student_id},
        ).mappings().one_or_none()

        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="학생 정보를 찾을 수 없습니다.",
            )


        find_application_query = text("""
            SELECT id, class_name
            FROM applications
            WHERE student_id = :student_id
            AND subject = :subject
        """)

        existing_application = connection.execute(
            find_application_query,
            {
                "student_id": student_id,
                "subject": target_subject,
            },
        ).mappings().one_or_none()


        if existing_application is None:
            insert_query = text("""
                INSERT INTO applications (
                    student_id,
                    subject,
                    class_name
                )
                VALUES (
                    :student_id,
                    :subject,
                    :class_name
                )
                RETURNING id, student_id, subject, class_name, created_at
            """)

            row = connection.execute(
                insert_query,
                {
                    "student_id": student_id,
                    "subject": target_subject,
                    "class_name": target_class,
                },
            ).mappings().one()

        elif existing_application["class_name"] == target_class:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="이미 가입한 과목과 반입니다.",
            )

        else:
            update_query = text("""
                UPDATE applications
                SET
                    class_name = :class_name,
                    status = '승인대기',
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = :application_id
                RETURNING
                    id,
                    student_id,
                    subject,
                    class_name,
                    status,
                    created_at,
                    updated_at
            """)

            row = connection.execute(
                update_query,
                {
                    "application_id": existing_application["id"],
                    "class_name": target_class,
                },
            ).mappings().one()
    background_tasks.add_task(
        send_subject_notification_email,
        name=student["name"],
        subject=row["subject"],
        class_name=row["class_name"],
    )

    return {
        "message": "수강신청이 완료되었습니다.",
        "student": dict(row),
    }

@app.get("/admin/applications")
def get_admin_applications(
    page: int = Query(default=1, ge=1),
    manager_id: int = Depends(get_current_manager),
):
    limit = 20
    offset = (page - 1) * limit

    count_query = text("""
        SELECT COUNT(*)
        FROM applications
        WHERE status = '승인대기'
    """)

    query = text("""
        SELECT
            a.id AS application_id,
            s.name,
            a.subject,
            a.class_name,
            a.status,
            a.updated_at
        FROM applications AS a
        JOIN students AS s
            ON s.id = a.student_id
        WHERE a.status = '승인대기'
        ORDER BY a.updated_at DESC
        LIMIT :limit
        OFFSET :offset
    """)

    with engine.connect() as connection:
        total_count = connection.execute(
            count_query
        ).scalar_one()

        applications = connection.execute(
            query,
            {
                "limit": limit,
                "offset": offset,
            },
        ).mappings().all()

    total_pages = max(
        1,
        (total_count + limit - 1) // limit,
    )

    return {
        "applications": [
            dict(application)
            for application in applications
        ],
        "page": page,
        "total_pages": total_pages,
        "total_count": total_count,
    }

@app.get("/admin/students")
def get_admin_students(
    page: int = Query(default=1, ge=1),
    manager_id: int = Depends(get_current_manager),
):
    limit = 20
    offset = (page - 1) * limit

    count_query = text("SELECT COUNT(*) FROM students")

    query = text("""
        WITH paged_students AS (
            SELECT
                s.id,
                s.name,
                s.username,
                s.created_at,
                MAX(a.updated_at) AS latest_application_updated_at
            FROM students AS s
            LEFT JOIN applications AS a
                ON a.student_id = s.id
            GROUP BY
                s.id,
                s.name,
                s.username,
                s.created_at
            ORDER BY
                MAX(a.updated_at) DESC NULLS LAST,
                s.created_at DESC
            LIMIT :limit
            OFFSET :offset
        )
        SELECT
            ps.id AS student_id,
            ps.name,
            ps.username,
            ps.created_at,
            a.subject,
            a.class_name,
            a.status
        FROM paged_students AS ps
        LEFT JOIN applications AS a
            ON a.student_id = ps.id
        ORDER BY
            ps.latest_application_updated_at DESC NULLS LAST,
            ps.created_at DESC,
            a.updated_at DESC
    """)

    with engine.connect() as connection:
        total_count = connection.execute(count_query).scalar()
        
        rows = connection.execute(
            query,
            {
                "limit": limit,
                "offset": offset,
            },
        ).mappings().all()

    students_by_id = {}

    for row in rows:
        student_id = row["student_id"]

        if student_id not in students_by_id:
            students_by_id[student_id] = {
                "student_id": student_id,
                "name": row["name"],
                "username": row["username"],
                "created_at": row["created_at"],
                "courses": {
                    "영어": None,
                    "스페인어": None,
                    "일본어": None,
                    "중국어": None,
                },
            }

        if row["subject"] is not None:
            if row["status"] == "승인대기":
                students_by_id[student_id]["courses"][row["subject"]] = (
                    f'{row["class_name"]} (승인대기)'
                )
            else:
                students_by_id[student_id]["courses"][row["subject"]] = (
                    row["class_name"]
                )

    total_pages = math.ceil(total_count / limit) if total_count > 0 else 1

    return {
        "page": page,
        "total_pages": total_pages, 
        "total_count": total_count, 
        "students": list(students_by_id.values()),
    }


@app.get("/admin/students/export")
def export_admin_students(
    manager_id: int = Depends(get_current_manager),
):
    query = text("""
        SELECT
            s.id AS student_id,
            s.name,
            s.username,
            s.created_at,
            a.subject,
            a.class_name,
            a.updated_at,
            a.status
        FROM students AS s
        LEFT JOIN applications AS a
            ON a.student_id = s.id
        ORDER BY
            a.updated_at DESC NULLS LAST,
            s.created_at DESC
    """)

    with engine.connect() as connection:
        rows = connection.execute(query).mappings().all()

    students_by_id = {}
    student_number = 1

    for row in rows:
        student_id = row["student_id"]

        if student_id not in students_by_id:
            students_by_id[student_id] = {
                "번호": student_number,
                "이름": row["name"],
                "아이디": row["username"],
                "영어": "X",
                "스페인어": "X",
                "일본어": "X",
                "중국어": "X",
                "가입 날짜": (
                    row["created_at"].strftime("%Y-%m-%d %H:%M:%S")
                    if row["created_at"] is not None
                    else ""
                ),
            }
            student_number += 1

        if row["subject"] is not None:
            if row["status"] == "승인대기":
                students_by_id[student_id][row["subject"]] = (
                    f'{row["class_name"]} (승인대기)'
                )
            else:
                students_by_id[student_id][row["subject"]] = (
                    row["class_name"]
                )

    dataframe = pd.DataFrame(list(students_by_id.values()))

    output = io.BytesIO()

    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        dataframe.to_excel(
            writer,
            index=False,
            sheet_name="학생 목록",
        )

    output.seek(0)

    return StreamingResponse(
        output,
        media_type=(
            "application/"
            "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ),
        headers={
            "Content-Disposition": (
                f'attachment; filename="students_{datetime.now():%Y%m%d_%H%M%S}.xlsx"'
            )
        },
    )


@app.patch("/admin/applications/status")
def update_admin_application_status(
    request: ApplicationStatusBatchUpdate,
    manager_id: int = Depends(get_current_manager),
):
    if not request.updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="변경할 수강신청 상태가 없습니다.",
        )

    update_query = text("""
        UPDATE applications
        SET
            status = :status,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = :application_id
        RETURNING id, status
    """)

    with engine.begin() as connection:
        updated_applications = []

        for update in request.updates:
            row = connection.execute(
                update_query,
                {
                    "application_id": update.application_id,
                    "status": update.status,
                },
            ).mappings().one_or_none()

            if row is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"수강신청 번호 {update.application_id}을 찾을 수 없습니다.",
                )

            updated_applications.append(dict(row))

    return {
        "message": "수강신청 상태가 변경되었습니다.",
        "applications": updated_applications,
    }

@app.get("/admin/students/search")
def search_admin_students(
    search_request: StudentSearchRequest = Depends(),
    manager_id: int = Depends(get_current_manager),
):
    target_name = search_request.name.strip()

    query = text("""
        SELECT
            s.id AS student_id,
            s.name,
            s.username,
            s.created_at,
            a.subject,
            a.class_name
        FROM students AS s
        LEFT JOIN applications AS a
            ON a.student_id = s.id
        WHERE s.name = :name
        ORDER BY
            a.updated_at DESC NULLS LAST,
            s.created_at DESC
    """)

    with engine.connect() as connection:
        rows = connection.execute(
            query,
            {"name": target_name},
        ).mappings().all()

    if not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="일치하는 회원이 없습니다.",
        )

    students_by_id = {}

    for row in rows:
        student_id = row["student_id"]

        if student_id not in students_by_id:
            students_by_id[student_id] = {
                "student_id": student_id,
                "name": row["name"],
                "username": row["username"],
                "created_at": row["created_at"],
                "courses": {
                    "영어": None,
                    "스페인어": None,
                    "일본어": None,
                    "중국어": None,
                },
            }

        if row["subject"] is not None:
            students_by_id[student_id]["courses"][row["subject"]] = (
                row["class_name"]
            )

    return {
        "students": list(students_by_id.values()),
    }


@app.post("/find-id")
def find_id(
    name: str,
    phone: str,
    birth_date: date,
):
    query = text("""
        SELECT username
        FROM students
        WHERE name = :name
          AND phone = :phone
          AND birth_date = :birth_date
    """)

    with engine.connect() as connection:
        student = connection.execute(
            query,
            {
                "name": name.strip(),
                "phone": phone.strip(),
                "birth_date": birth_date,
            },
        ).mappings().one_or_none()

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="일치하는 회원 정보를 찾지 못했습니다.",
        )

    username = student["username"]
    email_id, email_domain = username.split("@", 1)

    visible_length = min(
        6,
        max(1, len(email_id) - 1),
    )

    masked_email_id = (
        email_id[:visible_length]
        + "*" * (len(email_id) - visible_length)
    )

    return {
        "username": f"{masked_email_id}@{email_domain}",
    }



def get_chat_student(
    student_id: int = Depends(get_current_student),
):
    query = text("""
        SELECT
            s.id,
            s.name,
            a.subject,
            a.class_name
        FROM students AS s
        JOIN applications AS a
            ON a.student_id = s.id
        WHERE s.id = :student_id
          AND a.status = '승인완료'
        ORDER BY a.created_at ASC
    """)

    try:
        with engine.connect() as connection:
            rows = connection.execute(
                query,
                {"student_id": student_id},
            ).mappings().all()
    except SQLAlchemyError as error:
        print(f"[ERROR] DB 조회 중 에러 발생: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        )

    if not rows:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="수강 승인 완료 학생만 AI 학습 상담을 이용할 수 있습니다.",
        )

    name = (rows[0].get("name") or "학생").strip()

    applications = [
        {
            "subject": row["subject"],
            "class_name": row["class_name"],
        }
        for row in rows
    ]

    subject_text = ", ".join(
        application["subject"]
        for application in applications
    )

    greeting = (
        f"안녕하세요, {name}님! "
        f"현재 상담 가능한 과목은 {subject_text}입니다. "
        "어떤 과목의 상담을 원하십니까? "
        "아래에서 상담할 과목을 클릭해 주세요."
    )

    return {
        "id": rows[0]["id"],
        "name": name,
        "applications": applications,
        "greeting": greeting,
    }

def save_chat_history(
    student_id: int,
    subject: str,
    class_name: str,
    question: str,
    answer: str,
):
    query = text("""
        INSERT INTO chat_history (
            student_id, subject, class_name, question, answer, created_at
        )
        VALUES (
            :student_id, :subject, :class_name, :question, :answer, CURRENT_TIMESTAMP
        )
    """)
    try:
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
    except SQLAlchemyError as e:
        print(f"[ERROR] 채팅 기록 저장 실패: {e}")


@app.get("/chat/access")
def check_chat_access(
    student: dict = Depends(get_chat_student),
):
    return {
        "allowed": True,
        **student,
    }

@app.post("/chat")
def chat(
    request: ChatRequest,
    student: dict = Depends(get_chat_student),
):

    question = request.message.strip()
    selected_subject = request.subject


    selected_class_name = "미정"
    for app in student["applications"]:
        if app["subject"] == selected_subject:
            selected_class_name = app["class_name"]
            break

    if is_exit_message(question):
        exit_answer = "상담을 종료합니다. 언제든 다시 찾아주세요!"
        
        save_chat_history(
            student_id=student["id"],
            subject=selected_subject,       
            class_name=selected_class_name,  
            question=question,
            answer=exit_answer,
        )
        return {
            "answer": exit_answer,
            "should_close": True,
        }

    answer = make_answer(
        question=question,
        subject=selected_subject,
        class_name=selected_class_name,     
    )

    save_chat_history(
        student_id=student["id"],
        subject=selected_subject,           
        class_name=selected_class_name,     
        question=question,
        answer=answer,
    )

    return {
        "answer": answer,
        "should_close": False,
    }


@app.post("/reset-password/check-account")
def check_account(request: AccountCheckRequest):
    username = request.username.strip()
    phone = request.phone.strip()
    name = request.name.strip()

    if not username or not phone:
        raise HTTPException(
            status_code=400,
            detail="아이디와 전화번호를 입력해 주세요.",
        )

    params = {
        "username": username,
        "name": name,
        "phone": phone,
    }

    with engine.connect() as connection:
        account_exists = connection.execute(
            text("""
                SELECT EXISTS (
                    SELECT 1
                    FROM students
                    WHERE username = :username
                      AND name = :name
                      AND phone = :phone
                )
            """),
            params,
        ).scalar_one()

    if not account_exists:
        raise HTTPException(
            status_code=404,
            detail="아이디 또는 전화번호가 일치하지 않습니다.",
        )

    return {
        "verified": True,
        "message": "계정이 확인되었습니다.",
    }



@app.post("/reset-password")
def reset_password(request: ResetPasswordRequest):
    username = request.username.strip()
    phone = request.phone.strip()
    name = request.name.strip()
    

    if (
        not username
        or not phone
        or not name
        or not request.new_password
    ):
        raise HTTPException(
            status_code=400,
            detail="모든 항목을 입력해 주세요.",
        )

    hashed_password = password_hasher.hash(
        request.new_password
    )


    params = {
        "username": username,
        "phone": phone,
        "name" : name,
        "password_hash": hashed_password,
    }
    with engine.begin() as connection:
        updated_student = connection.execute(
            text("""
                UPDATE students
                SET
                    password_hash = :password_hash,
                    updated_at = CURRENT_TIMESTAMP
                WHERE
                    username = :username
                    AND phone = :phone
                    AND name = :name
                RETURNING id
            """),
            params,
        ).first()

    if updated_student is None:
        raise HTTPException(
            status_code=404,
            detail="아이디 또는 전화번호가 일치하지 않습니다.",
        )

    return {
        "message": "비밀번호가 변경되었습니다."

    }


@app.get("/lesson/access")
def get_lesson_access(
    student_id: int = Depends(get_current_student),
):
    query = text("""
        SELECT
            s.id,
            s.name,
            a.subject,
            a.class_name,
            a.status,
            a.created_at
        FROM students AS s
        JOIN applications AS a
            ON a.student_id = s.id
        WHERE s.id = :student_id
        AND a.status = '승인완료'
        ORDER BY a.created_at ASC
    """)

    with engine.connect() as connection:
        applications = connection.execute(
            query,
            {"student_id": student_id},
        ).mappings().all()

    if not applications:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="수강신청 완료 후 강의를 이용할 수 있습니다.",
        )

    return {
        "applications": [
            {
                "subject": application["subject"],
                "class_name": application["class_name"],
                "created_at": application["created_at"],
            }
            for application in applications
        ],
    }

@app.get("/applications/me")
def get_my_applications(
    student_id: int = Depends(get_current_student),
):
    query = text("""
        SELECT
            subject,
            class_name,
            status,
            created_at
        FROM applications
        WHERE student_id = :student_id
        ORDER BY created_at ASC
    """)

    with engine.connect() as connection:
        applications = connection.execute(
            query,
            {"student_id": student_id},
        ).mappings().all()

    return {
        "applications": [
            {
                "subject": application["subject"],
                "class_name": application["class_name"],
                "status": application["status"],
                "created_at": application["created_at"],
            }
            for application in applications
        ],
    }


@app.post("/inquiries", status_code=status.HTTP_201_CREATED)
def create_inquiry(
    inquiry: InquiryCreate,
    background_tasks: BackgroundTasks,
):
    inquiry_type = inquiry.inquiry_type.strip()
    name = inquiry.name.strip()
    phone = inquiry.phone.strip()
    title = inquiry.title.strip()
    content = inquiry.content.strip()

    if not all([inquiry_type, name, phone, title, content]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="모든 항목을 입력해 주세요.",
        )

    if inquiry_type not in {"consulting", "payment", "system", "etc"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="올바른 문의 유형을 선택해 주세요.",
        )

    if not re.fullmatch(r"010-?[0-9]{4}-?[0-9]{4}", phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="전화번호는 010-1234-5678 형식으로 입력해 주세요.",
        )

    if len(title) > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="제목은 100자 이하로 입력해 주세요.",
        )

    if len(content) > 700:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="문의 내용은 700자 이하로 입력해 주세요.",
        )

    insert_query = text("""
        INSERT INTO inquiries (
            inquiry_type,
            name,
            phone,
            title,
            content
        )
        VALUES (
            :inquiry_type,
            :name,
            :phone,
            :title,
            :content
        )
        RETURNING id, inquiry_type, name, phone, title, content, created_at
    """)

    with engine.begin() as connection:
        row = connection.execute(
            insert_query,
            {
                "inquiry_type": inquiry_type,
                "name": name,
                "phone": phone,
                "title": title,
                "content": content,
            },
        ).mappings().one()

        inquiry_payload = dict(row)

    try:
        background_tasks.add_task(
            send_inquiries_email,
            inquiry_type=inquiry_payload["inquiry_type"],
            name=inquiry_payload["name"],
            phone=inquiry_payload["phone"],
            title=inquiry_payload["title"],
            content=inquiry_payload["content"],
        )
    except Exception as error:
        print(f"[시스템 에러] 문의 이메일 작업 등록 실패: {error}")

    return {
        "message": "문의가 접수되었습니다.",
        "inquiry": inquiry_payload,
    }


@app.get("/admin/inquiries/export")
def export_admin_inquiries(
    manager_id: int = Depends(get_current_manager),
):
    query = text("""
        SELECT
            inquiry_type,
            name,
            phone,
            title,
            content,
            status,
            created_at
        FROM inquiries
        ORDER BY
            created_at DESC,
            id DESC
    """)

    with engine.connect() as connection:
        rows = connection.execute(
            query
        ).mappings().all()

    if not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="현재 접수된 문의가 없습니다.",
        )

    inquiry_type_labels = {
        "consulting": "수강 및 학습 상담",
        "payment": "결제 및 환불 문의",
        "system": "사이트 이용 및 오류",
        "etc": "기타 문의",
    }

    inquiry_list = []

    for inquiry_number, row in enumerate(rows, start=1):
        inquiry_list.append({
            "번호": inquiry_number,
            "문의 유형": inquiry_type_labels.get(
                row["inquiry_type"],
                row["inquiry_type"],
            ),
            "이름": row["name"],
            "전화번호": row["phone"],
            "제목": row["title"],
            "문의 내용": row["content"],
            "상태": row["status"],
            "문의 날짜": (
                row["created_at"].strftime("%Y-%m-%d %H:%M:%S")
                if row["created_at"] is not None
                else ""
            ),
        })

    dataframe = pd.DataFrame(inquiry_list)

    output = io.BytesIO()

    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        dataframe.to_excel(
            writer,
            index=False,
            sheet_name="문의 목록",
        )

    output.seek(0)

    return StreamingResponse(
        output,
        media_type=(
            "application/"
            "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ),
        headers={
            "Content-Disposition": (
                f'attachment; filename="inquiries_'
                f'{datetime.now():%Y%m%d_%H%M%S}.xlsx"'
            )
        },
    )





