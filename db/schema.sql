CREATE TABLE students (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(15) NOT NULL,

    username VARCHAR(254) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    birth_date DATE NOT NULL,

    phone VARCHAR(11) NOT NULL UNIQUE
        CHECK (phone ~ '^010[0-9]{8}$'),

    age INTEGER NOT NULL
        CHECK (age BETWEEN 10 AND 70),

    memo TEXT,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE managers (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(15) NOT NULL,

    username VARCHAR(254) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    age INTEGER NOT NULL
        CHECK (age BETWEEN 10 AND 70),

    status VARCHAR(20) NOT NULL
        DEFAULT '관리자',

    memo TEXT,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE applications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    student_id BIGINT NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    subject VARCHAR(20) NOT NULL
        CHECK (
            subject IN ('영어', '스페인어', '일본어', '중국어')
        ),

    class_name VARCHAR(20) NOT NULL
        CHECK (
            class_name IN ('A반', 'B반', 'C반')
        ),

    status VARCHAR(20) NOT NULL
        DEFAULT '승인대기'
        CHECK (
            status IN ('승인대기', '승인완료')
        ),

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_student_subject
        UNIQUE (student_id, subject)
);


CREATE TABLE chat_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    student_id BIGINT NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    subject VARCHAR(20) NOT NULL,

    class_name VARCHAR(20) NOT NULL,

    question TEXT NOT NULL,

    answer TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE inquiries (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    inquiry_type VARCHAR(20) NOT NULL
        CHECK (
            inquiry_type IN (
                'consulting',
                'payment',
                'system',
                'etc'
            )
        ),

    name VARCHAR(30) NOT NULL
        CHECK (btrim(name) <> ''),

    phone VARCHAR(13) NOT NULL
        CHECK (phone ~ '^010-?[0-9]{4}-?[0-9]{4}$'),

    title VARCHAR(100) NOT NULL
        CHECK (btrim(title) <> ''),

    content TEXT NOT NULL
        CHECK (btrim(content) <> ''),

    status VARCHAR(20) NOT NULL
        DEFAULT '접수'
        CHECK (
            status IN ('접수', '답변완료')
        ),

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);