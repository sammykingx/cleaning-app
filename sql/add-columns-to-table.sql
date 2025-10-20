ALTER TABLE bookings
  ADD COLUMN square_order_id VARCHAR(45) AFTER updated_at,
  ADD COLUMN idempotency_key VARCHAR(45) AFTER square_order_id,
  ADD COLUMN charged_amount DECIMAL(10,2) DEFAULT 0.00 AFTER square_order_id,
  ADD COLUMN is_paid BOOLEAN NOT NULL DEFAULT FALSE AFTER charged_amount,
  ADD COLUMN paid_at DATETIME NULL AFTER is_paid;