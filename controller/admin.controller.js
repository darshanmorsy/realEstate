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

exports.request = async (req, res) => {
  var data = await property.find({ active: 0 });
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(200).json({ message: "no request found" });
  }
}

exports.contacts = async (req, res) => {
  var data = await contacts.find({});
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(200).json({ message: "no contacts found" });
  }
}

exports.requestAccept = async (req, res) => {
  // console.log(req.params);
  var accept = await property.findByIdAndUpdate(req.params.id, { active: 1 });
  if (accept) {
    res.status(200).json({ accept, message: "accepted successfully" });
  } else {
    res.status(200).json({ message: "request not accepted" });
  }
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
    res.status(200).json({ message: "city added successfully", data });
  } else {
    res.status(404).json({ message: "city not added" });
  }
}

exports.deletecity = async (req, res) => {
  var data = await city.findByIdAndDelete(req.params.id);
  if (data) {
    res.status(200).json({ message: "city deleted successfully" });
  } else {
    res.status(404).json({ message: "city not deleted" });
  }
}

exports.user = async (req, res) => {
  var data = await user.find({});
  res.json(data);
} 

exports.deactive = async (req, res) => {
  var data = await property.findByIdAndUpdate(req.params.id, { active: 2 });
  if (data) {
    res.status(200).json({ message: "property deactive successfully" });
  } else {
    res.status(404).json({ message: "property not deactive" });
  }
}

exports.active = async (req, res) => {
  var data = await property.findByIdAndUpdate(req.params.id, { active: 0 });
  if (data) {
    res.status(200).json({ message: "property deactive successfully" });
  } else {
    res.status(404).json({ message: "property not deactive" });
  }
}

exports.deactive_property = async (req, res) => {
  var data = await property.find({ active: 2 });
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "property not found" });
  }
}
 
exports.contact_property = async (req, res) => {
  console.log(req.params);

  if (req.params.property_id) {
    var properties = await property.findById(req.params.property_id);
    console.log(properties, "oo");

    if (properties.price) { 
      var owner_info = await user.findById(properties.user_id);
      console.log(owner_info, "oo");

      if (owner_info) {
        console.log("hh");
        res.status(200).json({ owner_info, properties });
        console.log(owner_info, properties);
      } else {
        res.status(200).json({ message: "no such property" });
      }
    } else {
      res.status(200).json({ message: "no such property" });
    }
  } else {
    console.log(req.params);
  }
}

exports.contactdelete = async(req, res) => {

  try {
    
    if(req.params.id){

      var deletes=await contacts.findByIdAndDelete(req.params.id);
      if(deletes){
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
