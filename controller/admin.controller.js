const express = require("express");
const property = require("../model/property.model");
const contacts = require("../model/contact.model");
var cloudinary = require("../helper/cloudinary");
var city = require("../model/city.model");
const user = require("../model/user.model");

// shows request, get method

exports.request = async (req, res) => {
  var data = await property.find({ active: 0 });
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(200).json({ message: "no request found" });
  }
};

exports.contacts = async (req, res) => {
  var data = await contacts.find({});
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(200).json({ message: "no contacts found" });
  }
};

exports.requestAccept = async (req, res) => {
  // console.log(req.params);
  var accept = await property.findByIdAndUpdate(req.params.id, { active: 1 });
  if (accept) {
    res.status(200).json({ accept, message: "accepted successfully" });
  } else {
    res.status(200).json({ message: "request not accepted" });
  }
};     

exports.requestDecline = async (req, res) => {
  console.log(req.params);
  var properties = await property.findOne({ _id: req.params.id });

  // console.log(properties);

  var cloudinary_id = properties.property_image_id;
  var property_images = properties.property_image;

  console.log(property_images.length, "oooooooooooooooo", property);

  for (var i = 0; i < property_images.length; i++) {
    cloudinary.uploader.destroy(cloudinary_id[i], function (error, result) {
      if (error) {
        console.log(error);
      }
      console.log(result);
    });
  }
  var accept = await property.findByIdAndDelete(req.params.id);
  if (accept) {
    res.status(200).json(accept);
  } else {
    res.status(200).json({ message: "request not accepted" });
  }
};

exports.allproperty = async (req, res) => {
  var data = await property.find();
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "no data found" });
  }
};

exports.city = async (req, res) => {
  var data = await city.create({ city: req.body.city });
  if (data) {
    res.status(200).json({ message: "city added successfully", data });
  } else {
    res.status(404).json({ message: "city not added" });
  }
};

exports.deletecity = async (req, res) => {
  var data = await city.findByIdAndDelete(req.params.id);
  if (data) {
    res.status(200).json({ message: "city deleted successfully" });
  } else {
    res.status(404).json({ message: "city not deleted" });
  }
};

exports.user = async (req, res) => {
  var data = await user.find({});
  res.json(data);
};

exports.deactive = async (req, res) => {
  var data = await property.findByIdAndUpdate(req.params.id, { active: 2 });
  if (data) {
    res.status(200).json({ message: "property deactive successfully" });
  } else {
    res.status(404).json({ message: "property not deactive" });
  }
};

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
