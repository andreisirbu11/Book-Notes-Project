import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const port = 3000;
const app = express();
const API_URL = "https://covers.openlibrary.org/b/olid/";
let books = [];

const db = new pg.Client({
    user: "postgres",
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "book_notes"
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

async function fetchBooks() {
    let books = [];
    try {
        const result = await db.query("SELECT * FROM books;");
        result.rows.forEach(row => {
            books.push(row);
        });
    }
    catch (err) {
        console.log("Error: ", err.stack);
    }
    return books;
}

async function addBook(olid, title, rating, notes, date) {
    try {
        const coverURL = `${API_URL}${olid}-L.jpg`;
        date = new Date(date);
        await db.query("INSERT INTO books (olid, title, rating, notes, read_date, cover_url) VALUES ($1, $2, $3, $4, $5, $6)", [olid, title, rating, notes, date, coverURL]); 
    } 
    catch (err) {
        console.log("Error: ", err.stack);
    } 
}

async function findBook(title) {
    let book;
    try {
        const result = await db.query("SELECT * FROM books WHERE LOWER(title) LIKE LOWER('%' || $1 || '%');", [title]);
        book = result.rows[0];
    }
    catch (err) {
        console.log("Error: ", err.stack);
    }
    return book;
}

async function filterBook(filter) {
    let books = [];
    let result;
    try {
        switch(filter) {
            case "all books":
                result = await db.query("SELECT * FROM books;");
                result.rows.forEach(row => {
                    books.push(row);
                });
                break;
            case "recency":
                result = await db.query("SELECT * FROM books ORDER BY read_date DESC;");
                result.rows.forEach(row => {
                    books.push(row);
                });
                break;
            case "rating":
                result = await db.query("SELECT * FROM books ORDER BY rating DESC;");
                result.rows.forEach(row => {
                    books.push(row);
                }); 
                break;
            case "title":
                result = await db.query("SELECT * FROM books ORDER BY title ASC;");
                result.rows.forEach(row => {
                    books.push(row);
                });
                break;
            default:
                result = await db.query("SELECT * FROM books;");
                result.rows.forEach(row => {
                    books.push(row);
                });
        }
    }
    catch (err) {
        console.log("Error: ", err.stack);
    }
    return books;
}

async function deleteBook(id) {
    try {
        await db.query("DELETE FROM books WHERE id = $1;", [id]);
    }
    catch (err) {
        console.log("Error: ", err.stack);
    }
}

async function updateBook(id, olid, title, rating, notes, date) {
    const coverURL = `${API_URL}${olid}-L.jpg`;
    date = new Date(date);
    try {
        await db.query("UPDATE books SET olid = $1, title = $2, rating = $3, notes = $4, read_date = $5, cover_url = $6 WHERE id = $7;", 
            [olid, title, rating, notes, date, coverURL, id]);
    }
    catch (err) {
        console.log("Error: ", err.stack);
    }
}

app.get("/", async (req, res) => {
    books = await fetchBooks();
    res.render("index.ejs", {
        data: books,
        selectedFilter: "all books"
    });
})

app.post("/books", async (req, res) => {
    let books = [];
    if(req.body.title) {
        const result = await findBook(req.body.title);
        if(result) {
            books.push(result);
        }
        else {
            books = [];
        }
        res.render("index.ejs", {
            data: books,
            selectedFilter: ""
        });
    }
    else {
        res.redirect("/");
    }
});

app.post("/filter", async (req, res) => {
    const filter = req.body.filter;
    books = await filterBook(filter);
    res.render("index.ejs", {
        data: books,
        selectedFilter: filter
    });
});

app.post("/add", async (req, res) => {
    const { olid, title, rating, notes, date } = req.body;
    await addBook(olid, title, rating, notes, date);
    res.redirect("/");
});

app.post("/update", async (req, res) => {
    const {id, olid, title, rating, notes, date} = req.body;
    await updateBook(id, olid, title, rating, notes, date);
    res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    await deleteBook(id);
    res.redirect("/");
});

app.listen(port, () =>  {
    console.log(`App is listening on port ${port}`);
});