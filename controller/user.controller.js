const express=require('express')
const property = require('../model/property.model');

exports.contact=async(req,res)=>{

    console.log(req.body);
    const {
        email,
        mobile,
        name,
        address,
        description
    } = req.body;
  
    if (
        email ==null||
        mobile ==null||
        name ==null||
        address ==null||
        description ==null
    ) {
      res
        .status(404)
        .json({
          message:"email,mobile,name,address,description not found",
        });
    } else {
        var data = await property.create({
            email,
            mobile,
            name,
            address,
            description,
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

