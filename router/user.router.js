const router = require("express").Router()
const image_upload = require("../helper/multer.helper")
const city = require("../model/city.model")
const profile_model = require("../model/user.model")
const properties = require("../model/property.model")
const user_token = require("../middleware/user.middleware")

const {
  login,
  register,
  loginpost,
  registerpost,
  loginpostweb,
  registerpostweb,
  home,
  property,
  singleproperty,
  contact,
  propertDetails, 
  allproperty,
  deleteproperty,
  sell_page,
  user_property,
  profile,
  update_property,
  updateproperty,
  housetype,
  mainfilter,
  basicdetails,
} = require("../controller/user.controller")

router.get("/", home)
router.post("/login",loginpost)
router.post("/register",registerpost)
router.post("/registerpostweb",registerpostweb)
router.post("/loginpostweb",loginpostweb)
router.get("/property",user_token,property)
router.get("/sellpage",user_token,sell_page)
router.get("/property/:id/:sp",user_token,singleproperty)
router.post('/basicdetails',user_token,basicdetails)
router.get("/housetype/:housetype",user_token,housetype)

router.get("/login", login)
router.get("/register", register)

router.post("/propertyDetails",user_token,image_upload.array("property_image"),propertDetails)

router.post("/updateproperty",user_token,image_upload.array("property_image"),update_property)

router.get("/updateproperty/:id", user_token, updateproperty)
router.post("/contact/:id", user_token,contact)
router.get("/allproperty", user_token, allproperty)
router.get("/user_property", user_token, user_property)
router.delete("/deleteproperty/:id", user_token, deleteproperty)
router.get("/deleteproperty/:id", user_token, deleteproperty)
router.get("/profile",user_token,profile)
router.post("/mainfilter",mainfilter)

router.get("/city", async (req, res) => {
  var data = await city.find({})
  res.json(data)
})

router.get('/mainfilter',async(req, res) => {
  res.redirect('/user')
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

router.get("/logout", async (req, res) => {
  try {
    // Clear the JWT cookie on the client side
    res.cookie("jwt", "", { maxAge: 1 });

    // Client-side redirect using JavaScript
   res.redirect('/user');
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during logout")
  }
})

module.exports = router;
