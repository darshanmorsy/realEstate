const express = require("express");
const property = require("../model/property.model");
const contacts = require("../model/contact.model");
// var cloudinary = require("../helper/cloudinary");
var city = require("../model/city.model");
const user = require("../model/user.model");
var bcrypt = require("bcrypt");
const admin = require("../model/admin.model");

exports.loginpage=async(req,res)=>{

  res.render('loginpage')

}

exports.login=async(req, res)=>{

  try {
    const {
      body: { mobile, password },
    } = req;
 
    const admindata = await admin.findOne({ mobile });
    // console.log(req.body);
    // console.log("admindata:__", admindata);

    if (admindata == null) {
      res.redirect('/admin/login')
    } else {
      const isMatched = await bcrypt.compare(password, admindata.password);
      // console.log("isMatched:__", isMatched);
      if (isMatched) {
        if (admindata.tokens[0] == undefined) {
          console.log("Hello::::");
          const token = await admindata.generateauthtoken();

          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30 * 24 * 3600 * 10000),
            httpOnly: true,
          });
          // console.log("Token:::-", token);

          console.log(`Success! Login Succesfully ${admindata.mobile}`);

          res.redirect('/admin');
        } else {
          
          console.log(`Success! Login Succesfully ${admindata}`);
          token = admindata.tokens[0]["token"]
          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30 * 24 * 3600 * 10000),
          })
          
          res.redirect('/admin');
        
        }
      } else {

       res.redirect('/admin/login')
        
      }
    }
  } catch (error) {
    console.log("userlogin:__", error)

    res.status(500).json({
      message: "Sorry! Something Went Wrong (user login)",
      status: 500,
    });
  }

}


exports.admin=async(req,res)=>{

  var cities =await city.find({})
  var contact = await contacts.find({}).sort({ _id: -1 });
  // console.log(contact);
  res.render("admin",{cities,contact})

}

// shows request, get method


exports.contacts = async (req, res) => {
  var contact = await contacts.find({}).sort({ _id: -1 });
  res.render('contacts',{contact})
}



exports.allproperty = async (req, res) => {
  var data = await property.find();
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "no data found" });
  }
}

exports.city = async (req, res) => {

  var data = await city.create({ city: req.body.city });
  if (data) {
    req.flash("city added successfully")
    res.redirect('back')
  } else {
    req.flash("city not added");
    res.redirect('back')
  }
}

exports.deletecity = async (req, res) => {
  var data = await city.findByIdAndDelete(req.params.id);
  if (data) {
    req.flash("success","city deleted successfully");
    res.redirect('back')
  } else {
    req.flash("success","city not deleted")
    res.redirect('back')
  }
}

exports.user = async (req, res) => {
  var users = await user.find({});
  res.render('user',{users});
} 

exports.contactdelete = async(req, res) => {
 
  try { 
    if(req.params.id){
      var deletes=await contacts.findByIdAndDelete(req.params.id);
      if(deletes){
        req.flash('success',"contact deleted successfully")
        res.redirect('back')
      }
    }
  } catch (error) {
    console.log(error);
  }
}

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

      const files = req.files;
      if (files) {

        let property_image = [];
        for (let file of files) {

          property_image.push("/" + file.filename);

        }

        var data = await property.create({
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

exports.property=async(req, res) => {
    var users=[]
    var properties = await property.find({ active:0})

    for (var i = 0; i <properties.length; i++) {

      var find = await user.findOne({ _id: properties[i].user_id })
      if (find) {
        users.push(find)
        }
    }

    if(properties){ 
      res.render("reqproperties",{properties,users})
    }

}