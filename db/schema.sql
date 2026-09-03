CREATE TABLE students (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(15) NOT NULL,

    username VARCHAR(15) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    birth_date DATE NOT NULL,

    phone VARCHAR(11) NOT NULL
        CHECK (phone ~ '^010[0-9]{8}$'),

    age INTEGER NOT NULL
        CHECK (age BETWEEN 10 AND 55),

    subject VARCHAR(20) NOT NULL
        DEFAULT '미정'
        CHECK (
            subject IN ('미정', '영어', '스페인어', '일본어', '중국어')
        ),

    class_name VARCHAR(20) NOT NULL
        DEFAULT '미정'
        CHECK (
            class_name IN ('미정', 'a', 'b', 'c')
        )c

    memo TEXT,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE managers (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(15) NOT NULL,

    username VARCHAR(15) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    age INTEGER NOT NULL
        CHECK (age BETWEEN 10 AND 55),


    status VARCHAR(20) NOT NULL
        DEFAULT '관리자',

    memo TEXT,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
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