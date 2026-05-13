TRUNCATE TABLE order_items, orders RESTART IDENTITY ;

ALTER TABLE orders
    DROP COLUMN courier_id,
    ADD COLUMN delivery_address VARCHAR(255);