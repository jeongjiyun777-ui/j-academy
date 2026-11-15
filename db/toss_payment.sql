BEGIN;

ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS toss_order_id VARCHAR(64) NOT NULL
        DEFAULT ('academy-' || replace(gen_random_uuid()::text, '-', '')),
    ADD COLUMN IF NOT EXISTS toss_payment_key VARCHAR(200),
    ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS orders_toss_order_id_uidx ON public.orders (toss_order_id);
CREATE UNIQUE INDEX IF NOT EXISTS orders_toss_payment_key_uidx ON public.orders (toss_payment_key);

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
    CHECK (
        (status = '결제대기' AND toss_payment_key IS NULL AND paid_at IS NULL)
        OR (status = '결제완료' AND toss_payment_key IS NOT NULL AND paid_at IS NOT NULL)
    );

COMMIT;