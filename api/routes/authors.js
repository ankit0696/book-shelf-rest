const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Author = require("../models/authors");

router.get("/", (req, res, next) => {
  Author.find()
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        authors: doc,
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

router.get("/:authorId", (req, res, next) => {
  const id = req.params.authorId;
  Author.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/:authorId", (req, res, next) => {
  const id = req.params.authorId;
  const props = req.body;
  Author.update({ _id: id }, { $set: props })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/", (req, res, next) => {
  const author = new Author({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    dob: req.body.dob,
  });

  author
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Post Request at /Author",
        newAuthor: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(501);
    });
});

module.exports = router;
