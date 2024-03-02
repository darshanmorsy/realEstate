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
  contactdelete,
  propertDetails,
  updateproperty,
  property
} = require("../controller/admin.controller")


router.get('/login',loginpage)
router.get('/', admin)
router.post("/login", login)

router.get("/contacts", contacts)
router.get("/user", user)
router.post("/city", city)

router.get("/deletecity/:id", deletecity)
router.get("/contactdelete/:id", contactdelete)
router.get('/property',property)
router.post(
  "/propertyDetails",
  image_upload.array("property_image"),
  propertDetails
)
router.post('/submit', (req, res) => {
  // const formData = req.body;
  console.log(req.body,"ppppp");
  // var k = req.bodyx1
  // res.render('admin',{k})
  function objectToTable(data) {
    let tableHTML = '<table>\n<thead>\n<tr><th>Key</th><th>Value</th></tr>\n</thead>\n<tbody>\n';
  
    function createTableRows(obj, parentKey = '') {
      for (const key in obj) {
        const currentKey = parentKey ? `${parentKey}.${key}` : key;
        const value = typeof obj[key] === 'object' ? JSON.stringify(obj[key]) : obj[key];
  
        const displayKey = currentKey.substring(currentKey.indexOf('.') + 1); // Remove portion before dot
        const row = `<tr><td>${displayKey}</td><td>${value}</td></tr>\n`;
        tableHTML += row;
  
        if (typeof obj[key] === 'object') {
          createTableRows(obj[key], currentKey);
        }
      }
    }
  
    createTableRows(data);
  
    tableHTML += '</tbody>\n</table>';
    return tableHTML;
  }
  

  const table = objectToTable(req.body);
  // console.log(table);
  

  res.send(table);

});
router.get("/updateproperty/:id", updateproperty)


router.get("/city", async (req, res) => {
  var city = await cities.find({})
  res.json(city)
})

router.post("/logout", async (req, res) => {
  try {
    console.log(req.cookies)
    res.cookie("jwt", "", { maxAge: 1 })
    // const token = req.headers.authorization
    res.status(200).json({ message: "logout successfully"})
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
