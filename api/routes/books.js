const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Book = require("../models/books");
const Author = require("../models/authors");

router.get("/", (req, res, next) => {
    Book.find()
        .populate('author','name')
        .exec()
        .then((doc) => {
            const response = {
                count: doc.length,
                books: doc,
            };
            res.status(200).json(response);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

router.get("/:bookId", (req, res, next) => {
    const id = req.params.bookId;
    Book.findById(id)
        .populate('author')
        .exec()
        .then((doc) => {
            if(!doc){
                res
                .status(404)
                .json({ message: "No book found for provided ID" });
            }
            console.log("From database", doc);
            res.status(200).json(doc);
        })
        .catch((err) => {
            res
            .status(500)
            .json({ error: err });
        });
});

router.post("/:bookId", (req, res, next) => {
    const id = req.params.bookId;
    const props = req.body;
    Book.update({ _id: id }, { $set: props })
        .exec()
        .then((result) => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch((err) => console.log(err));
});

router.post("/", (req, res, next) => {
    Author.findById(req.body.author).then(
        author => {
            if(!author){
                return res.status(500).json({
                    message: 'Author not found'
                });
            }
            const book = new Book({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                author: req.body.author,
                price: req.body.price,
            });
            return book.save();

        }).then((result) => {
            console.log(result);
            res.status(200).json({
                message: "Post Request at /books",
                newBook: result,
            });
        }).catch(
            err => {
                res.status(500).json({
                    error: err
                });
            }
        );
});

module.exports = router;
