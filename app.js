const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bookRoutes = require("./api/routes/books");
const authorRoutes = require("./api/routes/authors");

mongoose.connect(
  "mongodb+srv://user0:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.y8tfa.mongodb.net/book-shelf?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Prevent CORS error, allow everyone to Access API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.status(200).json();
  }
  next();
});

//Routes to handle requests
app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);

//Handling 404 error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//Handling all other error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
