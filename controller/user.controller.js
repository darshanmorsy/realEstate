const express = require("express");
const property = require("../model/property.model");
const contact = require("../model/contact.model");
const user = require("../model/user.model");
const city = require("../model/city.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
var imgpath = '/upload/'
var fs = require("fs");
const { request } = require("http");
// const { proppatch } = require("../router/user.router");

exports.home = async (req, res,next) => {
  var token = req.cookies.jwt;
  const secretKey = process.env.SECRET_KEY;
  var decodedToken = "";

  if (token) {
    decodedToken = jwt.verify(token, secretKey);
  }
  var profile = await user.findOne({ _id: decodedToken._id });
  var data = await property.find({ active: 1 });
  var cities = await city.find({});
  res.render("home", { data, cities, profile });

  next();
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
      });

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

      // we use below code for generate token(JWT)
      // const token = await saveData.generateauthtoken();
      // res.cookie("jwt", token, {
      //     expires: new Date(Date.now() + 30 * 24 * 3600 * 10000),
      //     httpOnly: true,
      // });
      // console.log("Token (userRegis):__", token);

      res.redirect("/user/login");
    } else {
      console.log("mobile already exists");
      res.redirect("/user/register");
    }
  }
}

exports.property = async (req, res) => {

  var data = await property.find({ active: 1 });
  // var cities = await city.find({});
  // var token = req.cookies.jwt;
  // const secretKey = process.env.SECRET_KEY;
  // var decodedToken = "";
  // if (token) {
  //   decodedToken = jwt.verify(token, secretKey);
  // }
  // var profile = await user.findOne({ _id: decodedToken._id });
  // res.render("buy", { data, cities, profile });
  res.render("allproperty",{data})
}

exports.buy = async (req, res) => {
  var token = req.cookies.jwt;
  const secretKey = process.env.SECRET_KEY;
  var decodedToken = "";
  if (token) {
    decodedToken = jwt.verify(token, secretKey);
  }
  var profile = await user.findOne({ _id: decodedToken._id });
  var data = await property.find({ category: "sell", active: 1 });
  var cities = await city.find({});

  res.render("buy", { data, cities, profile }); 
}

exports.sell_page = async (req, res) => {
  var token = req.cookies.jwt;
  const secretKey = process.env.SECRET_KEY;
  var decodedToken = "";
  if (token) {
    decodedToken = jwt.verify(token, secretKey);
  } 
  var profile = await user.findOne({ _id: decodedToken._id });
  var cities = await city.find({});
  res.render("sellform", {cities});
}

exports.rents = async (req, res) => {
  var token = req.cookies.jwt;
  const secretKey = process.env.SECRET_KEY;
  var decodedToken = "";
  if (token) {
    decodedToken = jwt.verify(token, secretKey);
  }
  var profile = await user.findOne({ _id: decodedToken._id });
  var data = await property.find({ category: "rent", active: 1 });
  var cities = await city.find({});
  console.log(data.length, "OOOOOOOOOOOOOOOO");
  res.render("rent", { data, cities, profile });
}

exports.singleproperty = async (req, res) => {

  var token = req.cookies.jwt;
  const secretKey = process.env.SECRET_KEY;
  var decodedToken = "";
  if (token) {
    decodedToken = jwt.verify(token, secretKey);
  }
  // var profile = await user.findOne({ _id: decodedToken._id });
  var data = await property.findOne({ _id:req.params.id});
  // var contacts = await contact.find({});
  res.render("singleproperty",{ data});
}

// property details form, post method

exports.propertDetails = async (req, res) => {

  console.log(req.body, "gggggg");

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
      address == null ||
      projectName == null ||
      price == null ||
      propertyLife == null ||
      size == null ||
      facilities == null ||
      carpet_area == null ||
      super_built_up == null ||
      project_area == null ||
      booking_amount == null ||
      furnishing == null ||
      property_floor == null ||
      landmark == null ||
      builder_details == null ||
      owner_info == null ||
      location == null ||
      category == null ||
      disclaimer == null ||
      scale_type == null ||
      house_type == null ||
      city == null ||
      rooms == null ||
      residentType == null ||
      bathroom == null ||
      listedby == null ||
      leasttype == null ||
      powerbackup == null ||
      scale_type == null ||
      built_up_area == null ||
      available == null ||
      facing == null ||
      possession == null ||
      saletype == null ||
      pincode == null 
    ) {
      if (req.headers.accept == undefined) {
        res.status(404).json({
          message:
            "address,projectName,residentType,city,price,propertyLife,size,facilities,carpet_area,super_built_up,project_area,booking_amount,furnishing,property_floor,landmark,builder_details,owner_info,location,category not found",
        });

      } else {
        req.flash("success", "some field is required");
        res.redirect("back");
      }

    } else {

      var token = req.headers.authorization || req.cookies.jwt;
      const secretKey = process.env.SECRET_KEY;
      var decodedToken = "";
      if (token) {

        decodedToken = jwt.verify(token, secretKey);

      }
      const files = req.files;
      if (files) {

        let property_image = [];
        for (let file of files) {

          property_image.push("/" + file.filename);

        }

        var data = await property.create({
          user_id: decodedToken._id,
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

          if (req.headers.accept == undefined) {
            res.status(200).json({ message: "data added successfully" });
          } else {
            req.flash("success", "property added successfully");
            res.redirect("back");
          }
        } else {
          if (req.headers.accept == undefined) {
            // console.log("data not added");

            res.status(200).json({ message: "data not added" });
          }
          req.flash("success", "an error has occurred");
          res.redirect("back");
        }
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
      if (req.headers.accept == undefined) {
        res.json({ message: "data added successfully" });
      } else {
        req.flash("success", "data added successfully");
        res.redirect("back");
      }
    } else {
      if (req.headers.accept == undefined) {
        res.json({ message: "data not added" });
      } else {
        req.flash("success", "data not added");
        res.redirect("back");
      }
    }
  }
}

// property details , get method

exports.allproperty = async (req, res) => {

  var data = await property.find({ active: 1 });
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "no data found" });
  }
}

exports.rent_buy_property = async (req, res) => {
  var data = await property.find({
    category: req.params.category,
    house_type: req.params.house_type,
  });
  if (data) {
    res.status(200).json(data);
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

exports.filterpost = async (req, res) => {
  // console.log(req.body);
  var token = req.cookies.jwt;
  const secretKey = process.env.SECRET_KEY;
  var decodedToken = "";
  if (token) {
    decodedToken = jwt.verify(token, secretKey);
  }
  var profile = await user.findOne({ _id: decodedToken._id });
  var data = await property.find({
    city: req.body.city,
    category: req.body.category,
    house_type: req.body.house_type,
    price: { $gt: req.body.min, $lt: req.body.max },
  });
  if (data) {
    // console.log(req.body, data);
    res.render("filter", { data, profile });
  } else {
    console.log("no data found");
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
  var token = req.cookies.jwt || req.headers.authorization;
  if (token) {
    const secretKey = process.env.SECRET_KEY;
    var decodedToken = "";
    if (token) {
      decodedToken = jwt.verify(token, secretKey);
    }
    
    console.log(req.headers);
    // console.log(profile);
    if(req.headers.authorization){
      
      var profile = await user.findOne({ _id: decodedToken._id });
      res.json(profile);
    }else{
      
      // var userproperties=await property.find({ user_id:decodedToken._id});
      var profile = await user.findOne({ _id: decodedToken._id });
    var propert = await property.find({ user_id: decodedToken._id });
      res.render("profile", { profile, property: propert });

    }
  }
}

exports.profile_front = async (req, res) => {
  var token = req.cookies.jwt;
  if (token) {
    const secretKey = process.env.SECRET_KEY;
    var decodedToken = "";
    if (token) {
      decodedToken = jwt.verify(token, secretKey);
    }

    var profile = await user.findOne({ _id: decodedToken._id });
    var propert = await property.find({ user_id: decodedToken._id });
    res.render("profile", { profile, property: propert });

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

exports.mainfilter = async (req, res) => {

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
  Property.find(query)
    .exec()
    .then((filteredProperties) => {
      // Do something with the filteredProperties
      // console.log(filteredProperties);
      // console.log(req.body);
      if(req.headers.authorization){
        res.json(filteredProperties);
      }
      else{
        var data=filteredProperties
        // console.log(data,filteredProperties);
        res.render('allproperty',{data});
      }
    })
    .catch((error) => {
      // Handle the error
      console.error(error);  
    });
  
  
}


exports.basicdetails=async(req,res)=>{

  console.log(req.body);

}