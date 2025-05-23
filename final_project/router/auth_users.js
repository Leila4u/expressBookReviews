const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=> { 
  let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password) => { 
let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
};

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  } 

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ 
        data: password 
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken, username 
    }
    return res.status(200).json({ message: "User successfully logged in." });
  } else {
    return res.status(200).json({ mesage: "Invalid Login. Check username and password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const user = req.session.authorization.username;
    const review = req.body.review;
    const isbn = req.params.isbn;
    if (!review) {
    res.status(400).json({ message: "Review is empty!" });
    } else {
    books[isbn].reviews[user] = review;
    res.status(200).json({ message: "Book review updated." });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    res.status(400).json({ message: "Invalid ISBN." });
  } else if (!books[isbn].reviews[user]) {
    res.status(400).json({ message: `${user} hasn't submitted a review for this book.` });
  } else {
    delete books[isbn].reviews[user];
    res.status(200).json({ message: "Book review deleted." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

