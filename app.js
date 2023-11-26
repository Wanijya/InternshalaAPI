require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

// cors
const cors = require("cors");
app.use(cors({ credentials: true, origin: true }));

//db connection
require("./models/database").connectDatabase();

//logger
const logger = require("morgan");
app.use(logger("tiny"));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //activeted

//session and cookie
const session = require("express-session");
const cookieparser = require("cookie-parser");
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(cookieparser());

// express file-upload
const fileupload = require("express-fileupload");
app.use(fileupload());

//Routes
app.use("/", require("./routes/indexRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));
app.use("/employe", require("./routes/employeRoutes"));

//error handling
const ErrorHandler = require("./utils/errorHandler");
const { genetatedErrors } = require("./middlewares/errors");
const cookieParser = require("cookie-parser");
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404));
});
app.use(genetatedErrors);

app.listen(
  process.env.PORT,
  console.log(`server running on port ${process.env.PORT}`)
);
