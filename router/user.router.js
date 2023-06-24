const router = require("express").Router();
const image_upload = require("../helper/multer.helper")
// const manager_token = require("../middleware/manager.middleware");

const {

     contact,
     propertDetails,
     allproperty,
     rent,
     sell,
     rent_flat,
     rent_bungalow,
     rent_shop,
     rent_office,
     rent_openplot,
     rent_rowhouse,
     rent_industrial,
     rent_farm,



  } = require("../controller/user.controller");

  router.post("/propertyDetails",image_upload.array("property_image"),propertDetails);
  router.post("/contact",contact);
  router.get("/allproperty",allproperty);
  router.get('/rent',rent);
  router.get('/sell',sell);
  router.get('/rent_flat',rent_flat);
  router.get('/rent_office',rent_office);
  router.get('/rent_shop',rent_shop);
  router.get('/rent_banglow',rent_bungalow);
  router.get('/open_plot',rent_openplot);
  router.get('/rent_rowhouse',rent_rowhouse);
  router.get('/rent_industrial',rent_industrial);
  router.get('/rent_farm',rent_farm);


module.exports = router;
