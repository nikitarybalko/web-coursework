ALTER TABLE restaurants
    ADD COLUMN image_path varchar(255),
    ADD COLUMN description varchar(255);

UPDATE restaurants SET description = 'Смачна піца і не тільки' WHERE id = 1;
UPDATE restaurants SET description = 'Суші, роли та гарний настрій :)' WHERE id = 2;
UPDATE restaurants SET image_path = '/uploads/restaurants/pizza-park.png' WHERE id = 1;
UPDATE restaurants SET image_path = '/uploads/restaurants/sushi-master.png' WHERE id = 2;
