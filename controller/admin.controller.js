const express = require("express");
const property = require("../model/property.model");

exports.propertDetails = async (req, res) => {
  console.log(req.body);
  const {
    address,
    projectName,
    price,
    propertyLife,
    size,
    facilities,
    carpet_area,
    super_built_up,
    project_area,
    booking_amount,
    furnishing,
    property_floor,
    landmark,
    builder_details,
    owner_info,
    location,
    disclaimer,
    category,
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
    scale_type == null
  ) {
    res
      .status(404)
      .json({
        message:
          "address,projectName,price,propertyLife,size,facilities,carpet_area,super_built_up,project_area,booking_amount,furnishing,property_floor,landmark,builder_details,owner_info,location,category not found",
      });
  } else {
    const files = req.files;
    if (files) {
      let property_image = [];
      let property_image_id = [];
      var i = 0;
      for (let file of files) {
        let { path } = file;
        const imageLink = path;
        const uploadedProfileImageDetails = await cloudinary.uploader.upload(
          imageLink,
          {
            folder: "userProfile",
          }
        );
        const farmImages = uploadedProfileImageDetails.secure_url;
        const farmImages_id = uploadedProfileImageDetails.public_id;
        property_image.push(farmImages);
        property_image_id.push(farmImages_id);
      }

      var data = await property.create({
        address,
        projectName,
        price,
        property_image,
        propertyLife,
        size,
        facilities,
        carpet_area,
        super_built_up,
        project_area,
        booking_amount,
        furnishing,
        property_floor,
        landmark,
        builder_details,
        owner_info,
        location,
        property_image_id,
        scale_type,
        disclaimer,
        category,
      });

      if (data) {
        console.log("data added successfully");
        res.status(200).json({ message: "data added successfully" });
      } else {
        console.log("data not added");
        res.status(200).json({ message: "data not added" });
      }
    }
  }
};
