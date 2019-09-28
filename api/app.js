const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const postRouter = require("./routes/post");
const usersRouter = require("./routes/users");
const leaderboardRouter = require("./routes/leaderboard");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/post", postRouter);
app.use("/users", usersRouter);
app.use("/leaderboard", leaderboardRouter);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true })
    .catch(err => console.log(err));

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB successfully connected.");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

const port = process.env.PORT || 4000;

module.exports = app.listen(port, () => console.log("Listening on port " + port));
