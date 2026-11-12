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

CREATE TABLE IF NOT EXISTS public.courses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    subject VARCHAR(20) NOT NULL
        CHECK (subject IN ('영어', '스페인어', '일본어', '중국어')),

    level VARCHAR(20) NOT NULL
        CHECK (level IN ('basic', 'intermediate', 'advanced')),

    price_krw INTEGER NOT NULL CHECK (price_krw > 0),

    UNIQUE (subject, level)
);

CREATE TABLE IF NOT EXISTS public.orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    student_id BIGINT NOT NULL REFERENCES public.students(id),
    course_id BIGINT NOT NULL REFERENCES public.courses(id),

    -- Preserve the price quoted when the order was created.
    amount_krw INTEGER NOT NULL CHECK (amount_krw > 0),

    status VARCHAR(20) NOT NULL DEFAULT '결제대기'
        CHECK (status IN ('결제대기')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.courses (subject, level, price_krw)
SELECT subjects.subject, prices.level, prices.price_krw
FROM (VALUES ('영어'), ('스페인어'), ('일본어'), ('중국어')) AS subjects(subject)
CROSS JOIN (VALUES
    ('basic', 120000),
    ('intermediate', 150000),
    ('advanced', 180000)
) AS prices(level, price_krw)
ON CONFLICT (subject, level) DO NOTHING;
