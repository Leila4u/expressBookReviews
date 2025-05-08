const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        if (books && books.length > 0) {
            resolve(books);
        } else {
            reject(new Error("No books found")); 
        }
    });
    getBooks.then((booksData) => {
            return res.status(200).json(booksData);
        })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
    const book = books.find(book => book.isbn === isbn); 

        if (book) {
            resolve(book);
        } else {
            reject(new Error("Book not found")); 
        }
    });

    getBookByISBN.then((book) => {
            return res.status(200).json(book); 
        })
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.author === author);

        if (filteredBooks.length > 0) {
            resolve(filteredBooks); 
        } else {
            reject(new Error("No books found by this author"));
        }
    });

    getBooksByAuthor.then((filteredBooks) => {
            return res.status(200).json(filteredBooks); 
        })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.title === title);

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject(new Error("No books found with this title"));
        }
    });

    getBooksByTitle.then((filteredBooks) => {
            return res.status(200).json(filteredBooks);
        })
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book && book.reviews) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Reviews not found for this book" });
    }
  });

module.exports.general = public_users;
