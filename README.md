# 📦 ProductVault

> **A robust, full-stack bulk product management system built for performance and data integrity.**

-----

## 📖 Overview

**ProductVault** is a solution designed to handle the complexities of uploading and managing large sets of product images.

Unlike simple CRUD apps, this project focuses on **Bulk Operations**, **Data Consistency**, and **User Experience**. It bridges the gap between structured database records and unstructured file system storage, ensuring that your data never gets out of sync—even when things go wrong.

### 🎯 Key Features

#### 🔌 Backend (Spring Boot)

  * **Smart Bulk Upload:** Handles multiple files simultaneously with a "Partial Success" strategy.
  * **Transaction Management:** Custom rollback logic to handle the "Atomicity Mismatch" between the Database and the File System.
  * **Structured Storage:** Automatically organizes uploads into `PV-{ID}` folders.
  * **Performance:** Implements **Server-Side Pagination** and **Caching** for instant gallery loading.
  * **Global Error Handling:** Centralized exception handling for clean API responses.

#### 🎨 Frontend (Next.js & TypeScript)

  * **Modern Drag & Drop:** A responsive upload widget that supports multiple files, image previews, and individual cancellation.
  * **TanStack Query:** Sophisticated client-side caching and background refetching.
  * **Optimistic UI:** Smooth pagination and loading overlays (no layout shifts).

-----

## 🏗 Architecture

The system follows a modular architecture using Docker to containerize dependencies.

**The Stack:**

  * **App:** Next.js (Frontend) + Spring Boot (Backend)
  * **Data:** PostgreSQL (Database)
  * **Infra:** Docker Compose (Orchestration)

-----

## 🚀 Getting Started

We use **Docker** to spin up the Database and Cache. This means you **do not** need to manually install PostgreSQL on your machine.

### Prerequisites

  * Java 17+
  * Node.js 18+
  * Docker & Docker Desktop

### 1\. Infrastructure Setup (Docker)

Start the PostgreSQL database instantly:

```bash
# In the project root
docker-compose up -d
```

*This will pull the images and start the services on ports `5432` (DB).*

### 2\. Backend Setup (Spring Boot)

Once Docker is running, start the API:

```bash
# Install dependencies & Run
./mvnw clean install
./mvnw spring-boot:run
```

*The server will start on `http://localhost:8080`*

### 3\. Frontend Setup (Next.js)

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

*The UI will be available at `http://localhost:3000`*

-----

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch paginated list of products. Supports `page`, `size`, `sortBy`. |
| `POST` | `/api/products/upload` | Upload multiple images (`multipart/form-data`). Returns success/failure report. |

**Example Upload Response:**

```json
{
    "successful": [
        { "id": 101, "name": "shoe.jpg", "imageUrl": "..." }
    ],
    "failed": [ "corrupt_file.pdf" ]
}
```

-----

## 🧠 Engineering Decisions

### Why "Partial Success" instead of `@Transactional`?

In a bulk upload of 50 items, if the 50th item fails, a standard `@Transactional` annotation would roll back **all** 50 database entries. However, Spring cannot roll back the **files** created on the disk for the previous 49 items. This leads to "orphaned folders."

I implemented a manual rollback strategy per item. If Item \#50 fails, we manually delete its specific DB row and folder, while keeping Items \#1-4 intact. This is a much better user experience.

### Why Server-Side Pagination?

Fetching 1,000 product images at once consumes massive bandwidth and memory. By using `PageRequest` in Spring Data JPA, we only fetch exactly what the user needs (e.g., 6 items), making the app highly scalable.

-----

## 📸 Screenshots & Demo
Demo video link : https://drive.google.com/file/d/1s3ZJV1vHvwBRSFG5wFT7CweY-o96baE9/view?usp=sharing

<img width="1903" height="928" alt="Screenshot 2025-11-30 at 3 22 20 PM" src="https://github.com/user-attachments/assets/11227a44-1469-4331-beef-88a050f0a40e" />

<img width="1080" height="640" alt="Screenshot 2025-11-30 at 3 22 48 PM" src="https://github.com/user-attachments/assets/283d1bf7-a362-40b8-bf87-2fc4586a8c08" />

<img width="1122" height="401" alt="Screenshot 2025-11-30 at 3 23 53 PM" src="https://github.com/user-attachments/assets/95e9b0d4-d39a-40eb-bdbe-678317a8ee54" />


