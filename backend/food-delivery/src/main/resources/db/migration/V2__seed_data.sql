INSERT INTO users (email, password, role, full_name, phone_number, provider)
VALUES
    ('customer1@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uKCv1.', 'CUSTOMER', 'Іван Петренко', '+380997778899', 'LOCAL');

INSERT INTO categories (name)
VALUES
    ('Суші'),
    ('Бургери'),
    ('Напої');

INSERT INTO restaurants (owner_id, name, address, tags)
VALUES
    (1, 'Pizza Park', 'вул. Соборна, 15', '{"Піца", "Італійська", "Сімейний"}'),
    (3, 'Sushi Master', 'пр. Миру, 42', '{"Суші", "Японська", "Premium"}');

-- Додаємо страви для Pizza Park
INSERT INTO dishes (restaurant_id, name, description, price, image_path)
VALUES
    (1, 'Маргарита', 'Класична піца з томатами та моцарелою', 185.00, '/uploads/dishes/margarita.jpg'),
    (1, 'Чотири сири', 'Пармезан, дорблю, чедер та моцарела', 245.00, '/uploads/dishes/4cheese.jpg'),
    (1, 'Кока-кола', '0.5л', 45.00, '/uploads/dishes/cola.jpg');

-- Додаємо страви для Sushi Master
INSERT INTO dishes (restaurant_id, name, description, price, image_path)
VALUES
    (2, 'Філадельфія', 'Лосось, крем-сир, огірок', 320.00, '/uploads/dishes/phila.jpg'),
    (2, 'Каліфорнія', 'Краб, авокадо, тобіко', 280.00, '/uploads/dishes/cali.jpg');

-- Прив'язуємо страви до категорій
INSERT INTO dish_categories (dish_id, category_id) VALUES
                                                       (1, 2), (2, 2), (3, 12), (4, 10), (5, 10);

-- Створюємо тестові замовлення для дашборду (щоб бачити статистику продажів)
INSERT INTO orders (customer_id, restaurant_id, status, total_price, created_at)
VALUES
    (4, 1, 'DELIVERED', 430.00, CURRENT_TIMESTAMP - INTERVAL '2 days'),
    (4, 1, 'DELIVERED', 245.00, CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (4, 1, 'PREPARING', 185.00, CURRENT_TIMESTAMP);

-- Деталізація замовлень
INSERT INTO order_items (order_id, dish_id, quantity, price_at_purchase)
VALUES
    (1, 1, 1, 185.00),
    (1, 2, 1, 245.00),
    (2, 2, 1, 245.00),
    (3, 1, 1, 185.00);