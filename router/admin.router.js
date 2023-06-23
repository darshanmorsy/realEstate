const router = require("express").Router();
// const manager_token = require("../middleware/manager.middleware");
const image_upload = require("../helper/multer.helper");


const{
    propertDetails,
 }= require("../controller/admin.controller");

  router.post("/propertDetails",image_upload.single("property_image"),propertDetails);

module.exports = router;
