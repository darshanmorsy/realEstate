const router = require("express").Router()
// const manager_token = require("../middleware/manager.middleware")
const image_upload = require("../helper/multer.helper")
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
} = require("../controller/admin.controller")

router.post("/login", login)
router.get("/request", request)
router.get("/contacts", contacts)
router.get("/requestAccept/:id", requestAccept)
router.delete("/requestDecline/:id", requestDecline)
router.get("/allproperty", allproperty)
router.get("/user", user)
router.post("/city", city)
router.delete("/deletecity/:id", deletecity) 
router.get("/deactive/:id", deactive)
router.get("/active/:id", active)  
router.get("/deactive", deactive_property) 
router.get("/contactproperty/:property_id", contact_property)

router.get("/city", async (req, res) => {
  var city = await cities.find({})
  res.json(city)
})

module.exports = router
