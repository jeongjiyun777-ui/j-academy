CREATE TABLE IF NOT EXISTS public.refresh_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    token_hash VARCHAR(64) NOT NULL UNIQUE,

    manager_id INTEGER
        REFERENCES public.managers(id) ON DELETE CASCADE,

    student_id BIGINT
        REFERENCES public.students(id) ON DELETE CASCADE,

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CHECK (
        (manager_id IS NOT NULL AND student_id IS NULL)
        OR
        (manager_id IS NULL AND student_id IS NOT NULL)
    )
);