const router = require("express").Router()
const admin_token = require("../middleware/admin.middleware")
var cities = require("../model/city.model")
const {
  login,
  request,
  contacts,
  requestAccept,
  requestDecline,
  allproperty,
  city,
  user,
  deletecity,
  deactive,
  active,
  deactive_property,
  contact_property,
  contactdelete
} = require("../controller/admin.controller")

router.post("/login",login)
router.get("/request",admin_token,request)
router.get("/contacts",contacts)
router.get("/requestAccept/:id",admin_token,requestAccept)
router.delete("/requestDecline/:id",admin_token,requestDecline)
router.get("/allproperty",admin_token,allproperty)
router.get("/user",admin_token,user)
router.post("/city",admin_token,city)
router.delete("/deletecity/:id",admin_token,deletecity) 
router.get("/deactive/:id",admin_token,deactive)
router.get("/active/:id",admin_token,active)  
router.get("/deactive",admin_token,deactive_property) 
router.get("/contactproperty/:property_id",admin_token,contact_property)
router.delete("/contactdelete/:id",admin_token,contactdelete)

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
