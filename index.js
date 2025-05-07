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

// Connecting to the database when the server starts
db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

async function fetchBooks() {
    // initialize book list with an empty array
    let books = [];
    try {
        // try to fetch books from the database and store returned rows
        const result = await db.query("SELECT * FROM books;");
        // for each row insert the book with all its attributes into the book's array
        result.rows.forEach(row => {
            books.push(row);
        });
    }
    catch (err) {
        // if there is a query issue, the book's array remains empty and an error is logged
        console.log("Error: ", err.stack);
    }
    return books;
}

async function addBook(olid, title, rating, notes, date) {
    try {
        // construct a book's cover URL from the API URL, the Open Library ID and the size, in this case size = L (Large)
        const coverURL = `${API_URL}${olid}-L.jpg`;
        // convert string date to Date type
        date = new Date(date);
        await db.query("INSERT INTO books (olid, title, rating, notes, read_date, cover_url) VALUES ($1, $2, $3, $4, $5, $6)", [olid, title, rating, notes, date, coverURL]); 
    } 
    catch (err) {
        // if an error occurs when trying to insert, log the error stack in the console
        console.log("Error: ", err.stack);
    } 
}

async function findBook(title) {
    let book;
    // try to find a book by title
    try {
        // result will return a single row which contains the book with the matched title
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
    // query the database for book that match the search criteria, for example if sort by recency is selected
    // the second switch clause will be executed as well as it's SELECT query
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
    // try to delete a record from the database with the specified id
    try {
        await db.query("DELETE FROM books WHERE id = $1;", [id]);
    }
    catch (err) {
        console.log("Error: ", err.stack);
    }
}

async function updateBook(id, olid, title, rating, notes, date) {
    // to update a book we need to reconstruct it's URL
    // in case we mistyped it's olid and therefore not getting it's desired book cover
    // econstruct the correct URL with the new olid
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
    // when the root is hit fetch all books on the page with the default filter: all books
    books = await fetchBooks();
    res.render("index.ejs", {
        data: books,
        selectedFilter: "all books"
    });
})

app.post("/books", async (req, res) => {
    let books = [];
    if(req.body.title) {
        // if the user typed in anything before submiting the data via form
        // call the method findBook which will return a book searched by title
        // and set the selected filter to an empty string
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
        // else redirect to the root, and all books will be displayed
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
    // add a book with data coming from an add form
    const { olid, title, rating, notes, date } = req.body;
    await addBook(olid, title, rating, notes, date);
    res.redirect("/");
});

app.post("/update", async (req, res) => {
    // update a book with data coming from an update form
    const {id, olid, title, rating, notes, date} = req.body;
    await updateBook(id, olid, title, rating, notes, date);
    res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
    //delete a book with the id coming as a query param
    const id = req.params.id;
    await deleteBook(id);
    res.redirect("/");
});

app.listen(port, () =>  {
    // make the app listen on port 3000
    console.log(`App is listening on port ${port}`);
});