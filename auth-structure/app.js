// the system configrationsx
require("./configs/set_env");

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const appConfig = require("./configs/app_setting");
const indexRouter = require("./routes/index.router");

const app = express();

// Connect Database
appConfig.connectDataBase();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(compression());
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/", indexRouter);

app.use("/storage", express.static(path.join(__dirname, "uploads")));

// Create Admin user
appConfig.createAdmin();

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ status: (err.status || 500), message: "error: page not found" });
});

module.exports = app;
