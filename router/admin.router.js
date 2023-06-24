const router = require("express").Router()
// const manager_token = require("../middleware/manager.middleware")
const image_upload = require("../helper/multer.helper")
const{
    request,
    contacts,
    requestAccept,
    requestDecline,
    allproperty,

 }= require("../controller/admin.controller")

 
  router.get('/request',request)
  router.get('/contacts',contacts)
  router.get('/requestAccept/:id',requestAccept)
  router.delete('/requestDecline/:id',requestDecline)
  router.get('/allproperty',allproperty)

module.exports = router;
