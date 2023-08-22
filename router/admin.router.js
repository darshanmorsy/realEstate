const router = require("express").Router()
const admin_token = require("../middleware/admin.middleware")
var image_upload=require('../helper/multer.helper')
var cities = require("../model/city.model")
const {
  loginpage,
  login,
  admin,
  contacts,
  city,
  user,
  deletecity,
  contact_property,
  contactdelete,
  propertDetails
} = require("../controller/admin.controller")


router.get('/login',loginpage)
router.get('/', admin_token, admin)
router.post("/login", login)

router.get("/contacts", contacts)
router.get("/user", admin_token, user)
router.post("/city", admin_token, city)

router.get("/deletecity/:id", admin_token, deletecity)
router.get("/contactdelete/:id", admin_token, contactdelete)
router.post(
  "/propertyDetails", admin_token,
  image_upload.array("property_image"),
  propertDetails
)

router.get("/city", async (req, res) => {
  var city = await cities.find({})
  res.json(city)
})

router.post("/logout", async (req, res) => {
  try {
    console.log(req.cookies)
    res.cookie("jwt", "", { maxAge: 1 })
    // const token = req.headers.authorization
    res.status(200).json({ message: "logout successfully" })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
