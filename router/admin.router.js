const router = require("express").Router()
// const manager_token = require("../middleware/manager.middleware")
const image_upload = require("../helper/multer.helper")
var cities=require("../model/city.model");
const{
    request,
    contacts,
    requestAccept,
    requestDecline,
    allproperty,
    city,
    deletecity,

 }= require("../controller/admin.controller")

 
  router.get('/request',request)
  router.get('/contacts',contacts)
  router.get('/requestAccept/:id',requestAccept)
  router.delete('/requestDecline/:id',requestDecline)
  router.get('/allproperty',allproperty)
  router.post('/city',city)
  router.delete('/deletecity/:id',deletecity);

  router.get('/city', async (req,res)=>{
    var city =await cities.find({});
    res.json(city);
  })

module.exports = router;
