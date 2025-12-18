# 📚 Course Management Platform

A full-stack Course Management application built with **React**, **NestJS**, **PostgreSQL**, and **Prisma**. This platform allows instructors to manage courses and lessons, while students can browse and consume course content.

---

## 🚀 Tech Stack

* **Frontend:** React, TypeScript, Tailwind CSS, React Router, React Hook Form, Zod
* **Backend:** NestJS, TypeScript, Prisma ORM
* **Database:** PostgreSQL (via Docker)
* **Authentication:** JWT (HttpOnly Cookies)

---

## 🛠️ Prerequisites

Before you begin, make sure you have the following installed:

* [Node.js](https://nodejs.org/) (v16 or higher)
* [Docker & Docker Compose](https://www.docker.com/)
* [Git](https://git-scm.com/)

---

## 🏁 Getting Started

Follow the steps below to run the project locally.

---

## 1️⃣ Clone the Repository

```bash
git clone <YOUR_REPO_URL_HERE>
cd <YOUR_PROJECT_DIRECTORY_NAME>
```

---

## 2️⃣ Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Configuration

Create a `.env` file from the example file:

```bash
cp .env.example .env
```

> **Note:** Open the `.env` file and verify that the database credentials match your Docker configuration if you have modified any defaults.

---

### Database Setup (Docker)

Start the PostgreSQL container:

```bash
docker-compose up -d
```

> **Note:** Ensure Docker is running before executing this command.

---

### Prisma Migration

Apply database migrations and generate tables:

```bash
npx prisma migrate dev --name init
```

---

### Start Backend Server

```bash
npm run start:dev
```

✅ Backend will be available at: **[http://localhost:3000](http://localhost:3000)**

---

## 3️⃣ Frontend Setup

Open a new terminal and navigate to the frontend directory.

### Install Dependencies

```bash
cd ../frontend
npm install
```

### Environment Configuration

Create a `.env` file from the example file:

```bash
cp .env.example .env
```

> **Note:** Ensure `VITE_BACKEND_URL` is set to:
>
> ```
> http://localhost:3000
> ```

---

### Start Frontend Server

```bash
npm run dev
```

✅ Frontend will be available at: **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 Testing the Application

1. Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**
2. Register a new user
3. **Instructor Role:**

   * Create courses
   * Add lessons
4. **Student Role:**

   * Browse available courses
   * View lesson content
5. Use the Login page to switch between different accounts

---

## 🤝 Contributing

Contributions are welcome!

* Fork the repository
* Create a new branch
* Submit a pull request

For major changes, please open an issue first to discuss your ideas.

---

## 📄 License

This project is licensed under the **MIT License**.
