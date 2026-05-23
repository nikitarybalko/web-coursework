# Foodie (Фуді) | Food Delivery Platform

[🇺🇦 Українська версія нижче](#-українська-версія)

Foodie is a modern, full-stack food delivery web application that connects users with their favorite local restaurants. It features a responsive client-facing interface for browsing menus and ordering food, as well as a comprehensive admin dashboard for restaurant management.

## Key Features

### For Users (Client App)
* **Global Search:** Fast and intuitive search for dishes across all available restaurants.
* **Dynamic Menus:** Browse restaurant-specific menus organized by categories.
* **Special Offers:** Interactive carousel featuring the latest promotions and discounts.
* **Responsive Design:** Seamless experience across desktop, tablet, and mobile devices.

### For Restaurant Owners (Admin Dashboard)
* **Menu Management:** Create, update, and delete dishes with an intuitive form.
* **Media Handling:** Upload and manage high-quality images for dishes and promotions.
* **Category Control:** Group dishes logically for better user navigation.
* **Promotions:** Launch and manage time-limited special offers.

## Tech Stack

**Frontend:**
* [Next.js](https://nextjs.org/) (App Router)
* [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/) & shadcn/ui
* Embla Carousel (for interactive promo sliders)

**Backend:**
* [Java](https://www.java.com/) & [Spring Boot](https://spring.io/projects/spring-boot)
* Spring Data JPA & Spring Security
* [PostgreSQL](https://www.postgresql.org/) (Database)

## Getting Started

### Prerequisites
Make sure you have installed:
* Node.js (v18+)
* Java 17+
* PostgreSQL

### Running Locally

1. **Clone the repository**
```bash
   git clone https://github.com/nikitarybalko/web-coursework
```

2. Start the Backend (Spring Boot)
* Update `application.yml` with your local database credentials.
* Run the application via your IDE or Maven

In /backend/food-delivery folder:
```bash
./mvnw spring-boot:run
```

3. Start the Frontend (Next.js)

In /frontend/food-delivery-ui folder:
```bash
npm install
npm run dev
```
* The app will be available at http://localhost:3000.

### Exposing Localhost with ngrok
If you need to test the application on mobile devices or share it with others, you can use ngrok to create public URLs for your local servers.

1. **Install and authenticate ngrok.**

2. **Expose the URL:**
Open a terminal and run:

```Bash
   ngrok http 3000
```
(Copy the generated `https://xyz.ngrok-free.app` URL).

3. **⚠️ Crucial Configuration Steps:**
* **Frontend:** Update your .env or .env.local file in the Next.js project to point to the new backend ngrok URL (e.g., NEXTAUTH_URL=https://xyz.ngrok-free.app/api).
* **Google Cloud Console:** Create a new project and add JWT credentials at https://console.cloud.google.com/apis/credentials.

# 🇺🇦 Українська версія
Фуді — це сучасний full-stack веб-додаток для доставки їжі, який об'єднує користувачів та їхні улюблені заклади. Проєкт складається зі зручного клієнтського інтерфейсу для замовлення страв та повноцінної панелі адміністратора для управління рестораном.

## Головний функціонал

### Для клієнтів
* **Глобальний пошук:** Швидкий пошук страв одразу по всіх ресторанах платформи.
* **Динамічні меню:** Зручний перегляд меню закладів з розбивкою по категоріях.
* **Спеціальні пропозиції:** Інтерактивна карусель з актуальними акціями та знижками.
* **Адаптивний дизайн:** Коректне відображення на телефонах, планшетах та ПК.

### Для адміністраторів закладів
* **Управління меню:** Створення, редагування та видалення страв через зручні форми.
* **Робота з медіа:** Завантаження та збереження фотографій для страв і банерів акцій.
* **Категорії:** Гнучке налаштування категорій для логічної структуризації меню.
* **Промо-акції:** Створення та управління тимчасовими спеціальними пропозиціями.

## Стек технологій
**Frontend:**
* [Next.js](https://nextjs.org/) (App Router)
* [React](https://reactjs.org/) і [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/) і shadcn/ui
* Embla Carousel (для інтерактивних промо слайдерів)

**Backend:**
* [Java](https://www.java.com/) і [Spring Boot](https://spring.io/projects/spring-boot)
* Spring Data JPA & Spring Security
* [PostgreSQL](https://www.postgresql.org/) (База даних)

## Як запустити локально
### Вимоги
Переконайтеся, що у вас встановлено:
* Node.js (v18+)
* Java 17+
* PostgreSQL

### Запуск
1. **Клонування репозиторію**
```bash
   git clone https://github.com/nikitarybalko/web-coursework
```

2. Запуск бекенду (Spring Boot)
* Оновіть доступи до бази даних у файлі `application.yml`.
* Запустіть проєкт через IDE або Maven

В директорії /backend/food-delivery:
```bash
./mvnw spring-boot:run
```

3. Запустіть фронтенд (Next.js)

В директорії /frontend/food-delivery-ui:
```bash
npm install
npm run dev
```
* Додаток буде доступний за адресою http://localhost:3000.

### Запуск через ngrok (Публічний доступ)
Якщо вам потрібно протестувати додаток на мобільному телефоні або показати його комусь через інтернет, ви можете використати ngrok для створення публічних посилань на ваші локальні сервери.

1. **Встановіть та авторизуйтесь у ngrok.**

2. **Запуск тунелю для Backend:**
Відкрийте термінал та виконайте:

```Bash
   ngrok http 3000
```
(Скопіюйте ваш URL `https://xyz.ngrok-free.app`).

3. **⚠️ Важливі етапи конфігурації:**
* **Frontend:** Оновіть файл .env або .env.local у проєкті Next.js, щоб він вказував на нову URL-адресу ngrok бекенду (наприклад, NEXTAUTH_URL=https://xyz.ngrok-free.app/api).
* **Google Cloud Console:** Створіть новий проєкт та додайте облікові дані JWT на сторінці https://console.cloud.google.com/apis/credentials.
