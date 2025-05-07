# 📚 Personal Book Notes App

This is a full-stack web application inspired by [Derek Sivers' book notes](https://sive.rs/book). It allows users to record, view, update, and delete notes on books they've read. Book covers are fetched via the Open Library Covers API. The app uses **Node.js**, **Express.js**, **PostgreSQL**, and **EJS** for templating.

## 🌟 Features

- 📘 Add books with custom notes and ratings.
- 🔍 View your collection with cover images.
- ✏️ Edit or update book details.
- ❌ Delete books from your collection.
- 🔃 Sort books by rating, recency, or title.
- 🌐 Fetch book covers from the [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers).

## 🛠 Tech Stack

- Backend: Node.js, Express.js
- Frontend: HTML, CSS, Bootstrap, JavaScript, EJS
- Database: PostgreSQL
- API: Open Library Covers API

## 📁 Project Structure

```
/public
├── /style/style.css    # Custom CSS styling
├── /script/script.js   # Client-side JavaScript
└── /assets/books.svg   # App logo
/views
└── index.ejs           # Home page
index.js                # Backend server logic
package.json # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/andreisirbu11/Book-Notes-Project.git
   cd Book-Notes-Project

2. Install dependencies:
    npm install

3. Create PostgreSQL database:
    ```bash
    CREATE DATABASE book_notes;

4. Create your schema: 
    ```bash
    CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title TEXT UNIQUE NOT NULL,
        author TEXT NOT NULL,
        rating INTEGER NOT NULL,
        notes TEXT NOT NULL,
        date_read DATE NOT NULL,
        cover_url TEXT NOT NULL
    );

5. Start the development server:
    ```bash
    nodemon index.js

6. Visit:
    http://localhost:3000

## 🐞 Error Handling
- All API and database operations include error handling.
- Errors are logged to the console and appropriate messages can be shown to users.

## 🧠 Planning Notes (Optional for Reviewers)
- Used Open Library Covers API to fetch book thumbnails.
- Routes planned for full CRUD functionality.
- Project includes comments throughout to explain logic.

## 📋 License
This project is open source and available under the [MIT License](LICENSE).