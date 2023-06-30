const express = require("express");
const app = express();
ejs = require("ejs");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const mongoose = require("mongoose");
// app.use(flash());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
require("dotenv").config();
app.use(express.static(path.join(__dirname, "assets")));
const db = "mongodb+srv://morsy:morsy@ds.6e7bjag.mongodb.net/realEstate";
mongoose
  .connect(db, {
    // useCreateIndex: true,
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
// require("./db/connection");

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger("dev"));

const userRouter = require("./router/user.router");
const adminRouter = require("./router/admin.router");

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.get("/", (req, res) => {
  res.redirect("/user");
});
app.listen(port, () => {
  console.log(`listing to the port ${port}`);
});
