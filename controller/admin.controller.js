const express = require("express");
const property = require("../model/property.model");
const contacts = require("../model/contact.model");
var cloudinary = require('../helper/cloudinary');

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
  var properties = await property.find({ _id: req.params.id });

  console.log(properties[0]);

  var cloudinary_id = properties[0].property_image_id;
  var property_images = properties[0].property_image;

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
  }
  else {
    res.status(404).json({ message: "no data found" });
  }

}

