const express = require("express")
const app = express()
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
const session = require("express-session")
const cors = require("cors")
const mongoose = require("mongoose")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
require("dotenv").config()
app.use(express.static(path.join(__dirname, "assets")))
app.use(express.static(path.join(__dirname, 'upload')))


const flash = require("express-flash")

app.use(flash())

app.use(session({
    secret: 'mysecret', // Replace with your own secret key
    resave: false,
    saveUninitialized:false            
  }))
  



const db = "mongodb+srv://morsy:morsy@ds.6e7bjag.mongodb.net/realEstate"
mongoose
  .connect(db, {
    // useCreateIndex: true,
    // useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err))

const port = process.env.PORT || 3000
// require("./db/connection") 
 
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(logger("dev"))

const userRouter = require("./router/user.router")
const adminRouter = require("./router/admin.router")

app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.get("/", (req, res) => {
  res.redirect("/user")
})

app.listen(port, () => {
  console.log(`listing to the port ${port}`)
})
 