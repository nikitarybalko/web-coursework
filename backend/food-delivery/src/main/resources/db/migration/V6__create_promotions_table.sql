CREATE TABLE promotions
(
    id            BIGSERIAL PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    description   VARCHAR(500),
    image_path    VARCHAR(255),
    restaurant_id BIGINT,
    valid_until   TIMESTAMP,
    is_active     BOOLEAN   DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_promotion_restaurant
        FOREIGN KEY (restaurant_id)
            REFERENCES restaurants (id) ON DELETE CASCADE
);