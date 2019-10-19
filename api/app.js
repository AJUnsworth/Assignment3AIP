const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();

const postRouter = require("./routes/posts");
const usersRouter = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/api/posts", postRouter);
app.use("/api/users", usersRouter);

//For static website hosting
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

//Connect to testing database if in development or test environment
const uri = process.env.NODE_ENV === "production" ? process.env.ATLAS_URI_PROD : process.env.ATLAS_URI_DEV;

//Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .catch(err => console.log(err));

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB successfully connected.");
});

//Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

//Error handler for if there is no page
app.use(function (err, req, res) {
   res.status(err.status || 500).json({error: err.message});
});

const port = process.env.PORT || 4000;

module.exports = app.listen(port, () => console.log("Listening on port " + port));
