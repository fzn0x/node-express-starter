const CONFIG = require("./config/app");
const db = require("./core/db.sequelizer");
const morganLogger = require("morgan");
const fileUpload = require("express-fileupload");
const createError = require("http-errors");
const compression = require("compression");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");

// for monolithic app
const web = require("./routes/web");
// for microservices app
const api = require("./routes/api");

const tokenMiddleware = require("./middlewares/token.middleware");

const app = express();

// SECURITY CONFIG
app.use(
  session({
    secret: CONFIG.appKey,
    resave: false,
    saveUninitialized: false,
  })
);
// form csrf
app.use(cors());
// END SECURITY CONFIG

// Fileupload using express
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// Enabling application/json request body
app.use(express.json()); // To parse the incoming requests with JSON payloads
// Enabling form data request body
app.use(express.urlencoded({ extended: true }));

/* TEST DATABASE CONNECTION, FAIL FAST */
db.sequelize
  .authenticate()
  .then(() => {
    console.log("DB CONNECTION WITH: ", CONFIG.dbName, " ESTABILISHED");
  })
  .catch((err) => {
    console.error("Unable to connect to database : ", err);
    process.exit(1);
  });

/*APP BOOTSTRAPPING*/
if (CONFIG.mode === "dev" || CONFIG.mode === "development") {
  console.log("App runs on local development");
  // Logging
  app.use(morganLogger("common"));

  // DATABASE Syncing Model with database model
  // db will table if not exist based on model
  db.sequelize.sync();
}

// Production Options
if (CONFIG.mode === "prod" || CONFIG.mode === "production") {
  console.log("App runs on local production");
  // Add gzip compression
  const compression = require("compression");
  app.use(compression());

  // Add express.js security with HTTP headers.
  // See https://helmetjs.github.io/#how-it-works
  app.use(require("helmet")());

  // Logging :add logging to file
  const fs = require("fs");
  app.use(
    morganLogger("common", {
      stream: fs.createWriteStream("/var/access.log", { flags: "a" }),
    })
  );
}

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/files/*", tokenMiddleware.verify, (req, res, next) => {
  next();
});
app.use("/files", express.static(path.join(__dirname, "files")));

// Set default template engine for api server
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Compress all HTTP responses
app.use(compression());
app.use(express.json());
app.use(cors());

// for monolithic app
app.use("/", web);
// for microservices app
app.use("/api", api);

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
  next();
});

module.exports = app;
