const router = require("express").Router();
const image_upload = require("../helper/multer.helper")
// const manager_token = require("../middleware/manager.middleware");

const {
     contact
  } = require("../controller/user.controller");

  router.post("/contact",contact);

module.exports = router;
