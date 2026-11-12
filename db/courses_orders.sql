BEGIN;

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

COMMIT;
