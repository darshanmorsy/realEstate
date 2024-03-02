const express = require("express");
const property = require("../model/property.model");
const contact = require("../model/contact.model");
const user = require("../model/user.model");
const city = require("../model/city.model");
const basicproperty=require('../model/basicproperty.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
var imgpath = '/upload/'
var fs = require("fs");
const { request } = require("http");
// const { proppatch } = require("../router/user.router");

exports.home = async (req, res,next) => {
  var data = await property.find({ active: 1 });
  var cities = await city.find({})
  var users=''
  if(req.cookies.jwt){ 
    var verify=await jwt.verify(req.cookies.jwt,process.env.SECRET_KEY)
    users=await user.findOne({_id:verify._id})
    if(users==null){
      users=undefined
    }else{
      users="user"
    }
  }
  
  res.render("home",{ data,cities,users})
}

exports.login = async (req, res) => { 
  res.render("login");
}

exports.register = async (req, res) => {
  res.render("register");
}

exports.loginpost = async (req, res) => {
  try {
    const {
      body: { mobile, password },
    } = req;

    const userdata = await user.findOne({ mobile });
    // console.log(req.body);
    // console.log("userdata:__", userdata);

    if (userdata == null) {
      res.status(404).json({
        message: "Sorry! mobile not found",
        status: 404,
      });
    } else {
      const isMatched = await bcrypt.compare(password, userdata.password);
      // console.log("isMatched:__", isMatched);
      if (isMatched) {
        if (userdata.tokens[0] == undefined) {
          console.log("Hello::::");
          const token = await userdata.generateauthtoken();

          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30 * 24 * 3600 * 10000),
            httpOnly: true,
          });
          // console.log("Token:::-", token);

          console.log(`Success! Login Succesfully ${userdata.name}`);

          res.status(200).json({
            message: "Success! Login Succesfully",
            token: token,
            status: 200,
            // id: userData._id,
          });
        } else {
          console.log(`Success! Login Succesfully ${userdata}`);
          token = userdata.tokens[0]["token"];
          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30 * 24 * 3600 * 10000),
          });
          res.status(200).json({
            message: "Success! Login Succesfully",
            token: userdata.tokens[0].token,
            status: 200,
            // id: userData._id,
          });
        }
      } else {
        res.status(401).json({
          message: "Sorry! Password doesn't Match",
          status: 401,
        });
      }
    }
  } catch (error) {
    console.log("userlogin:__", error);

    res.status(500).json({
      message: "Sorry! Something Went Wrong (user login)",
      status: 500,
    });
  }
}

exports.registerpost = async (req, res) => {
  
  console.log(req.body.name);
  const { mobile, name, password } = req.body;
  if (mobile == null || name == null || password == null) {
    console.log("Please enter a mobile or password or name");
  } else {
    const checkOwnerDetails = await user.findOne({ mobile: mobile });

    if (checkOwnerDetails == null) {
      const Hashedpassword = await bcrypt.hash(password, 10);

      const userData = new user({
        name,
        password: Hashedpassword,
        mobile: req.body.mobile,
      })

      const saveData = await userData.save();

      // console.log("saveData (userRegis):__", saveData);

      // we use below code for generate token(JWT)
      // const token = await saveData.generateauthtoken();
      // res.cookie("jwt", token, {
      //     expires: new Date(Date.now() + 30 * 24 * 3600 * 10000),
      //     httpOnly: true,
      // });
      // console.log("Token (userRegis):__", token);

      res.status(200).json({
        message: "Success! user Registered Successfully",
        status: 200,
        data: saveData,
      });
    } else {
      res.status(409).json({
        message: "Sorry! mobile Already Exist!",
        status: 409,
      });
    }
  }
}

exports.loginpostweb = async (req, res) => {
  try {
    const {
      body: { mobile, password },
    } = req;
    // console.log(req.body);
    const userdata = await user.findOne({ mobile });
    // console.log("userdata:__", userdata.mobile);
    if (userdata == null) {
      res.redirect("/user/login");
    } else {
      const isMatched = await bcrypt.compare(password, userdata.password);
      // console.log("isMatched:__", isMatched);
      if (isMatched) {
        if (userdata.tokens[0] == undefined) {
          // console.log("Hello::::");
          const token = await userdata.generateauthtoken();

          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30 * 24 * 3600 * 10000),
          });
          // console.log("Token:::-", token);
          console.log(`Success! Login Succesfully ${userdata}`);
          res.redirect("/user");
        } else {
          token = userdata.tokens[0]["token"];
          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30 * 24 * 3600 * 10000),
          });
          console.log(`Success! Login Succesfully ${userdata}`);
          res.redirect("/user");
        }
      } else {
        res.redirect("/user/login");
        console.log("password not match");
      }
    }
  } catch (error) {
    console.log("userlogin:__", error);
    res.redirect("/user/login");
    console.log("Sorry! Something Went Wrong (user login)");
  }
}

exports.registerpostweb = async (req, res) => {
  console.log(req.body.name);
  const { mobile, name, password } = req.body;

  if (mobile == null || name == null || password == null) {
    console.log("Please enter a mobile or password or name");
  } else {
    const checkOwnerDetails = await user.findOne({ mobile: mobile });

    if (checkOwnerDetails == null) {
      const Hashedpassword = await bcrypt.hash(password, 10);

      const userData = new user({
        name,
        password: Hashedpassword,
        mobile: req.body.mobile,
      });

      const saveData = await userData.save();

      console.log("saveData (userRegis):__", saveData);

      if(saveData){
        function removeQueryParams(url) {
          const parsedUrl = new URL(url)
          parsedUrl.search = ""
          return parsedUrl.toString()
      }         
      const modifiedUrl = removeQueryParams(req.get('referer'));
      console.log(modifiedUrl);
      console.log(req.get('referer'),"o");
      var link=modifiedUrl+'?openmodal=true'
      res.redirect(link)
      }
  
    } else {
      console.log("mobile already exists")
      res.redirect("/user/register")
    }
  }
}

exports.property = async (req, res) => {

  var data = await property.find({ }).sort({ _id: -1 });
  var cities = await city.find({});
  var users=''
  if(req.user){
    users="user"
  }
  res.render("allproperty",{data,cities,users})

}

exports.sell_page = async (req, res) => {
  var token = req.cookies.jwt;
  const secretKey = process.env.SECRET_KEY;
  var decodedToken = "";
  if (token) {
    decodedToken = jwt.verify(token, secretKey);
  } 

  var users = req.user
  var cities = await city.find({});
  res.render("sellform", {cities,users})
}

exports.singleproperty = async (req, res) => {

  const properties = await property.aggregate([
    { $sample: { size: 2 } }
  ]);
  console.log(properties);
  var data = await property.findOne({ _id:req.params.id});
  // var contacts = await contact.find({});
  var users=''
  if(req.cookies.jwt){ 
    var verify=await jwt.verify(req.cookies.jwt,process.env.SECRET_KEY)
    users=await user.findOne({_id:verify._id})
    if(users==null){
      users=undefined
    }else{
      users="user"
    }
  }
  res.render("singleproperty",{ data,properties,users})
}

// property details form, post method

exports.propertDetails = async (req, res) => {

  // console.log(req.body, "gggggg");

  try {

    const {
      address,
      projectName,
      price,
      propertyLife,
      house_type,
      size,
      facilities,
      carpet_area,
      super_built_up,
      project_area,
      booking_amount,
      bathroom,
      residentType,
      furnishing,
      property_floor,
      landmark,
      builder_details,
      owner_info,
      location,
      disclaimer,
      category,
      facing,
      possession,
      pincode,
      saletype,
      city,
      rooms,
      available,
      built_up_area,
      listedby,
      leasttype,
      powerbackup,
      scale_type,
    } = req.body;

    if (
      projectName ==null ||
      location== null ||
      house_type== null ||
      city== null ||
      rooms== null ||
      category== null
      ) {
      if (req.headers.authorization) {
        res.status(404).json({
          message:
            "address,projectName,residentType,city,price,propertyLife,size,facilities,carpet_area,super_built_up,project_area,booking_amount,furnishing,property_floor,landmark,builder_details,owner_info,location,category not found",
        });

      } else {
        req.flash("success", "some field is required");
        res.redirect("back");
      }

    } else {
        var property_image=''
        console.log(req.user,"p")
        var data = await property.create({
          user_id: req.user._id,
          address,
          projectName,
          price,
          property_image,
          propertyLife,
          size,
          bathroom,
          pincode,
          facilities,
          carpet_area,
          super_built_up,
          project_area,
          available,
          listedby,
          leasttype,
          powerbackup,
          scale_type,
          booking_amount,
          residentType,
          furnishing,
          property_floor,
          landmark,
          builder_details,
          owner_info,
          built_up_area,
          location,
          scale_type,
          facing,
          possession,
          saletype,
          house_type,
          disclaimer,
          rooms,
          city,
          category,
        });

        if (data) {
          // console.log("data added successfully", data);

          if (req.headers.authorization) {
            res.status(200).json({ message: "data added successfully" });
          } else {
            req.flash("success", "property added successfully");
            res.redirect("back");
          }
        } else {
          if (req.headers.authorization){
            // console.log("data not added");

            res.status(200).json({ message: "data not added" });
          }
          req.flash("success", "an error has occurred");
          res.redirect("back");
        }
      }

    
  } catch (error) {
    console.log(error);
  }
}

// contact form post method

exports.contact = async (req, res) =>{

  console.log(req.body);
  const {mobile, name, address} = req.body;
  if (
    mobile == null ||
    name == null ||
    address == null
  ) {
    req.flash('success','some field is empty')
    res.redirect("back");
  } else {
    console.log(req.params.id);
    var data = await contact.create({
      mobile,
      name,
      address,
      property_id: req.params.id,
    });

    if (data) {
      console.log("data added successfully");
      if (req.headers.authorization) {
        res.json({ message: "form submited successfully" });
      } else {
        req.flash("success", "form submited successfully");
        res.redirect("back");
      }
    } else {
      if (req.headers.authorization) {
        res.json({ message: "data not added" });
      } else {
        req.flash("success", "forn not submited");
        res.redirect("back");
      }
    }
  }
}

// property details , get method

exports.allproperty = async (req, res) => {

  var data = await property.find({ active: 1 }).sort({ _id: -1 })
  if (data) {
    if(req.headers.authorization){
      res.status(200).json(data);
    }
  } else {
    res.status(404).json({ message: "no data found" });
  }
}

exports.frontfilter = async (req, res) => {
  // console.log(req.params);

  var data = await property.find({
    city: req.params.city,
    category: req.params.category,
    house_type: req.params.house_type,
    price: { $gt: req.params.lessrange, $lt: req.params.greaterrange },
  });
  if (data) {
    res.status(200).json(data);
    console.log(data, req.params);
  } else {
    res.status(404).json({ message: "no data found" });
  }
}

exports.user_property = async (req, res) => {
  
  var token = req.cookies.jwt || req.headers.authorization;
  if (token) {
    const secretKey = process.env.SECRET_KEY;
    var decodedToken = "";
    if (token) {
      decodedToken = jwt.verify(token, secretKey);
    }
    // var profile = await user.findOne({ _id: decodedToken._id });
    var userproperties = await property.find({ user_id: decodedToken._id });

    if (userproperties) {
      res.json(userproperties);
      // console.log(profile);
    } else {
      res.json({});
    }
  } else {
    console.log("token is not found");
  }
}

exports.profile = async (req, res) => {


    
    console.log(req.user,"p");
    // console.log(profile);
    if(req.headers.authorization){ 
      var profile =req.user
      res.json(profile);
      
    }else{
      var profile =req.user
      var users='user'
    var propert = await property.find({ user_id: req.user.id});
      res.render("profile", { profile, property:propert,user:req.user,users})

    }
}

exports.deleteproperty = async (req, res) => {

  var data = await property.findOne({ _id: req.params.id });

  if (data) {

    for (var i = 0; i < data.property_image.length; i++) {
 
      fs.unlinkSync(path.join(__dirname, '../', 'upload/', data.property_image[i]), () => {
        console.log("property delete success");
      })
    }

 
    var contactdelete =await contact.deleteMany({property_id:req.params.id});
    var datas = await property.findByIdAndDelete(req.params.id);
   
    if (datas) {
  
      if(req.headers.authorization){

        res.json({ message: "data deleted successfully" })
        
      }else{

        req.flash('success',"data deleted successfully")
        res.redirect('back')
        
      }
      
    } else {
      
      if(req.headers.authorization){
        
        res.json({ message: "data deleted successfully" })
        console.log(datas, "not deleted");
      }
      else{
        
        req.flash('success',"data deleted")
        res.redirect('back')
     
      }
  
    }
  }
}

exports.delete_properties = async (req, res) => {

  var data = await property.findOne({ _id: req.params.id });
  if (data) {

    for (var i = 0; i < data.property_image.length; i++) {

      fs.unlinkSync(path.join(__dirname, '../', 'upload/', data.property_image[i]), () => {
        console.log("deleted successfully");
      })
    }

    var data = await property.findByIdAndDelete(req.params.id);
    if (data) {
      req.flash("success", "property deleted successfully");
      res.redirect("back");
      // console.log(data)
    } else {
      res.redirect("back");
      console.log(data, "not deleted");
    }
  }
}

exports.update_property = async (req, res) => {

  // console.log(req.files, "LLL");
  try {
    
    console.log(req.body);
    // console.log(req.body.id,"oooooo");
    var data = await property.findOne({ _id: req.body.id });
    // console.log(data, ":::::::");
    const files = req.files;
    console.log(files,"ooooooooooooooooooooooooooooooooooooo");
    if(data){

      if (files.length == 0) {

        var data = await property.findByIdAndUpdate(req.body.id, req.body);
       
        if (!data) { 
  
          if (req.headers.authorization) {
  
            res.json({ message: "not updated" });
  
          } else {
  
            req.flash("success", "property not updated");
            res.redirect("back");
  
          }
  
        } else {
  
          if (req.headers.authorization) {
  
            res.json({ message: "updated successfully" });
  
          } else {
  
            req.flash("success", "property updated successfully");
            res.redirect("back");   
  
          }
        }
        
        console.log("****************");
      } else {


        for (var i = 0; i < data.property_image.length; i++) {
  
          fs.unlinkSync(path.join(__dirname, '..', imgpath, data.property_image[i]), () => {
            console.log("deleted successfully");
          })
        }
  
        var property_image = []
  
        for (let file of files) {
  
          property_image.push("/" + file.filename)
  
        }
  
        console.log(property_image)
  
        req.body.property_image = property_image;
  
        var data = await property.findByIdAndUpdate(req.body.id, req.body);
        if (!data) {
  
          if (req.headers.authorization) {
  
            res.json({ message: "not updated" });
  
          } else {
  
            req.flash("property not updated");
            res.redirect("back");
  
          }
        } else {
  
          if (req.headers.authorization) {
  
            res.json({ message: "updated successfully" });
  
          } else {
  
            req.flash("success", "property updated successfully");
            res.redirect("back");
  
          }
        }



      }
    } else {

      if (req.headers.authorization) {
  
        res.json({ message: "not updated" });

      } else {

        req.flash("success", "property not updated");
        res.redirect("back")   

      }

    }

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "An error occurred" });

  }
}

exports.updateproperty = async (req, res) => {
  var token = req.cookies.jwt;
  const secretKey = process.env.SECRET_KEY;
  var decodedToken = "";
  if (token) {
    decodedToken = jwt.verify(token, secretKey);
  }
  var profile = await user.findOne({ _id: decodedToken._id });
  var data = await property.findOne({ _id: req.params.id });
  var cities = await city.find({});
  console.log(data);
  res.render("update", { data, cities, profile });
}

exports.housetype = async (req, res) => {
  var data = await property.find({ house_type: req.params.housetype });
  if (data) {
    res.status(200).json(data);
  }
}

exports.mainfilter = async (req, res) =>{

  console.log(req.body);
  const mongoose = require("mongoose");

  // Assuming you have a mongoose model for your collection
  const Property = mongoose.model("property");
  
  req.body.active = 1;
  const filterFields = req.body;
  
  // Convert string fields to float if they represent numeric values
  const numericFields = [
    "lessrange",
    "greaterrange",
  ];
  numericFields.forEach((field) => {
    if (filterFields[field]) {
      filterFields[field] = parseFloat(filterFields[field]);
    }
  });
  
  // Construct the query object based on non-empty fields in filterFields
  const query = {};
  Object.entries(filterFields).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (key === "lessrange") {
        query["price"] = { ...query["price"], $lte: value };
      } else if (key === "greaterrange") {
        query["price"] = { ...query["price"], $gte: value };
      } else {
        // Check if the value is an array
        if (Array.isArray(value)) {
          // If the value is an array, create a $in query
          query[key] = { $in: value };
        } else {
          // If the value is not an array, use a simple equality query
          query[key] = value;
        }
      }
    }
  });
  
  // Execute the query and get the filtered results
  Property.find(query).sort({ _id: -1 })
    .exec()
    .then(async(filteredProperties) => {
      // Do something with the filteredProperties
      // console.log(filteredProperties);
      // console.log(req.body);
      if(req.headers.authorization){
        res.json(filteredProperties);
      }
      else{
        var data=filteredProperties
        // console.log(data,"PP");
        
        if(req.body.search){
          function filterBySearchTerm(dataArray, searchTerm) {
            return dataArray.filter(obj => {
              for (const key in obj) {
                if (typeof obj[key] === 'string' && obj[key].toLowerCase().includes(searchTerm.toLowerCase())) {
                  return true;
                }
              }
              return false;
            });
          }
          
          // Example array of objects
          const dataArray =data
          
          // Specify the search term
          const searchTerm = req.body.search; // Change this to the search term provided by the user
          
          // Filter the array based on the search term in any property value
          const filteredData = filterBySearchTerm(dataArray, searchTerm);
          
          console.log(filteredData,"search term",dataArray,req.body.search);
        }

        var cities=await city.find({});
        var users=''
        if(req.cookies.jwt){ 
          var verify=await jwt.verify(req.cookies.jwt,process.env.SECRET_KEY)
          users=await user.findOne({_id:verify._id})
          if(users==null){
            users=undefined
          }else{
            users="user"
          }
        }
        res.render('allproperty',{data,cities,users});
      }
    })
    .catch((error) => {
      // Handle the error
      console.error(error);  
    });
  
  
}

exports.basicdetails=async(req,res)=>{

  const{
    mobile,
    projectName,
    location,
    house_type,
    city,
    rooms,
    category
  }=req.body
  console.log(req.body)

  var basicdetails=await basicproperty.create(req.body);
    if (basicdetails){
      if(req.headers.authorization){
        res.status(200).json({message:"property details added"});
      }
      else{
        req.flash('success',"property details added")
        res.redirect('back')
      }
    }

}
