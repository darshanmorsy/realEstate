const express = require("express")
const property = require("../model/property.model")
const contact = require("../model/contact.model")
const city = require("../model/city.model")

var cloudinary = require("../helper/cloudinary")
const path = require("path")

exports.home=async (req, res) =>{

    var data = await property.find({ active: 1 })
    var cities=await city.find({})
    res.render('home',{data,cities})

}
exports.property=async (req, res) =>{

    var data = await property.find({active:1})
    var cities=await city.find({})
   
    res.render('buy',{data,cities})

}
exports.buy=async (req, res) =>{

    var data = await property.find({category:'sell', active:1})
    var cities=await city.find({})
   
    res.render('buy',{data,cities})

}

exports.sell_page=async(req,res)=>{

    res,res.render('sellform')

}

exports.rents=async (req, res) =>{

    var data = await property.find({category:'rent', active:1})
    var cities=await city.find({});
    console.log(data.length,"OOOOOOOOOOOOOOOO");
    res.render('rent',{data,cities});

}

exports.singleproperty=async (req, res) =>{

    var data = await property.findOne({ _id:req.params.id})

    res.render('singleproperty',{data})

}


// property details form, post method

exports.propertDetails = async (req, res) => {
    try {
        console.log(req.body)
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
            furnishing,
            property_floor,
            landmark,
            builder_details,
            owner_info,
            location,
            disclaimer,
            category,
            city,
            rooms,
            scale_type,
        } = req.body

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
            rooms==null 
        ) {
            res.status(404).json({
                message:
                    "address,projectName,city,price,propertyLife,size,facilities,carpet_area,super_built_up,project_area,booking_amount,furnishing,property_floor,landmark,builder_details,owner_info,location,category not found",
            })
        } else {
            const files = req.files
            // console.log(files, "JJJJJJJJjjjjjjjjjjjjjjjj")
            if (files) {
                let property_image = []
                let property_image_id = []
                var i = 0
                for (let file of files) {
                    let { path } = file
                    const imageLink = path
                    const uploadedProfileImageDetails = await cloudinary.uploader.upload(
                        imageLink,
                        {
                            folder: "userProfile",
                        }
                    )
                    const farmImages = uploadedProfileImageDetails.secure_url
                    const farmImages_id = uploadedProfileImageDetails.public_id
                    property_image.push(farmImages)
                    property_image_id.push(farmImages_id)
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
                    house_type,
                    disclaimer,
                    rooms,
                    city,
                    category,
                })

                if (data) {
                    console.log("data added successfully", data);
                    // res.status(200).json({ message: "data added successfully" })
                } else {
                    console.log("data not added")
                    // res.status(200).json({ message: "data not added" })
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

// contact form post method

exports.contact = async (req, res) => {
    console.log(req.body)
    const { email, mobile, name, address, description } = req.body

    if (
        email == null ||
        mobile == null ||
        name == null ||
        address == null ||
        description == null
    ) {
        res.status(404).json({
            message: "email,mobile,name,address,description not found",
        })
    } else {
        var data = await contact.create({
            email,
            mobile,
            name,
            address,
            description,
        })

        if (data) {
            console.log("data added successfully")
            res.status(200).json({ message: "data added successfully" })
        } else {
            console.log("data not added")
            res.status(200).json({ message: "data not added" })
        }
    }
}

// property details , get method

exports.allproperty = async (req, res) => {
    var data = await property.find({ active: 1 })
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}

// rent sell , get method

exports.sell = async (req, res) => {
   
    var data = await property.find({ category: "sell" })
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}

// rent property , get method

exports.rent = async (req, res) => {
    var data = await property.find({ category:"rent"})
    if (data) {
        res.status(200).json(data);
    
    } else {
        res.status(404).json({ message: "no data found" })
    }
}

// 

exports.rent_flat = async (req, res) => {
    var data = await property.find({ category: "rent",house_type:'bunglow'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}



exports.rent_shop = async (req, res) => {
    var data = await property.find({ category: "rent",house_type:'shop'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}



exports.rent_office = async (req, res) => {
    var data = await property.find({ category: "rent",house_type:'office'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}


exports.rent_bungalow = async (req, res) => {
    var data = await property.find({ category: "rent",house_type:'bungalow'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}



exports.rent_openplot = async (req, res) => {
    var data = await property.find({ category: "rent",house_type:'openplot'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}



exports.rent_rowhouse = async (req, res) => {

    var data = await property.find({ category: "rent",house_type:'rowhouse'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}


exports.rent_industrial = async (req, res) => {

    var data = await property.find({ category: "rent",house_type:'industrial'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}


exports.rent_farm = async (req, res) => {

    var data = await property.find({ category: "rent",house_type:'farm'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }

}


exports.sell_flat = async (req, res) => {
    var data = await property.find({ category: "sell",house_type:'bunglow'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}



exports.sell_shop = async (req, res) => {
    var data = await property.find({ category: "sell",house_type:'shop'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}



exports.sell_office = async (req, res) => {
    var data = await property.find({ category: "sell",house_type:'office'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}


exports.sell_bungalow = async (req, res) => {
    var data = await property.find({ category: "sell",house_type:'bungalow'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}



exports.sell_openplot = async (req, res) => {
    var data = await property.find({ category: "sell",house_type:'openplot'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}



exports.sell_rowhouse = async (req, res) => {

    var data = await property.find({ category: "sell",house_type:'rowhouse'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}


exports.sell_industrial = async (req, res) => {

    var data = await property.find({ category: "rent",house_type:'industrial'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }
}


exports.sell_farm = async (req, res) => {

    var data = await property.find({ category: "sell",house_type:'farm'})
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).json({ message: "no data found" })
    }

}

exports.filter = async (req, res) => {

    var data = await property.find({city:req.params.city,category:req.params.category,house_type:req.params.house_type});
    if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "no data found" })
        }

}

exports.frontfilter = async (req, res) => {

    var data = await property.find({city:req.params.city,category:req.params.category,house_type:req.params.house_type});
    if (data) {
           res.json(data);

        } else {

            console.log("no data found");

        }

}
exports.filterpost = async (req, res) => {

    // console.log(req.body);
    var data = await property.find({city:req.body.city,category:req.body.category,house_type:req.body.house_type});
    if (data) {
        // console.log(data);
           res.render('filter',{data});

        } else {

            console.log("no data found");

        }

}