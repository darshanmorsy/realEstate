const router = require("express").Router();
const image_upload = require("../helper/multer.helper");
const city= require("../model/city.model")
const user_token = require("../middleware/user.middleware");

const {

    login,
    register,
    loginpost,
    registerpost,
    loginpostweb,
    registerpostweb,
    home,
    property,
    buy,
    rents,
    singleproperty,
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
     sell_flat,
     sell_bungalow,
     sell_shop,
     sell_office,
     sell_openplot,
     sell_rowhouse,
     sell_industrial,
     sell_farm,
     frontfilter,
     filterpost,
    sell_page,
    user_property,
    profile,
    profile_front,


  } = require("../controller/user.controller");


  router.get('/',home);
  router.post('/login',loginpost);
  router.post('/register',registerpost);
  router.post('/registerpostweb',registerpostweb);
  router.post('/loginpostweb',loginpostweb);
  router.get('/property',user_token,property);
  router.get('/buy',user_token,buy);
  router.get('/rents',user_token,rents);
  router.get('/sellpage',user_token,sell_page);
  router.get('/singleproperty/:id',user_token,singleproperty);
  router.post('/filters',user_token,filterpost);
  
  
  
  router.get('/login',login)
  router.get('/register',register)
  router.post("/propertyDetails",image_upload.array("property_image"),propertDetails);
  router.post("/contact/:id",contact);
  router.get("/allproperty",allproperty);
  router.get('/rent',rent);
  router.get('/sell',sell);
  router.get('/rent_flat',rent_flat);
  router.get('/rent_office',rent_office);
  router.get('/rent_shop',rent_shop);
  router.get('/rent_banglow',rent_bungalow);
  router.get('/rent_openplot',rent_openplot);
  router.get('/rent_rowhouse',rent_rowhouse);
  router.get('/rent_industrial',rent_industrial);
  router.get('/rent_farm',rent_farm);
 

  router.get('/sell_flat',sell_flat);
  router.get('/sell_office',sell_office);
  router.get('/sell_shop',sell_shop);
  router.get('/sell_banglow',sell_bungalow);
  router.get('/sell_openplot',sell_openplot);
  router.get('/sell_rowhouse',sell_rowhouse);
  router.get('/sell_industrial',sell_industrial);
  router.get('/sell_farm',sell_farm);

  router.get('/filter/:city/:category/:house_type/:lessrange/:greaterrange',frontfilter);
router.get('/user_property',user_token,user_property);
router.get('/profile',user_token,profile);
router.get('/profile_front',user_token,profile_front);
  router.get('/city',async(req,res)=>{
    var data=await city.find({})
    res.json(data);
  });


module.exports = router;
