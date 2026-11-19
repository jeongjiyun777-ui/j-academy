BEGIN;
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS unique_student_subject;
CREATE UNIQUE INDEX IF NOT EXISTS unique_student_subject_class
ON public.applications (student_id, subject, class_name);
COMMIT;