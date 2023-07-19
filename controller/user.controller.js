const express = require("express")
const property = require("../model/property.model")
const contact = require("../model/contact.model")
const user = require("../model/user.model")
const city = require("../model/city.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var cloudinary = require("../helper/cloudinary")
const path = require("path")
const { status } = require("init")

exports.home = async (req, res) => {
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
    //     const textflow = require("textflow.js");
    // textflow.useKey("ZOeuwGcJ25Y4ZOn5HJnC5B97DX7DeSk9bGdBr9Dp3wyM5bk6G6Qz9gpimMpQZsYh");



    // // Awaiting promise inside of async function
    // let result = await textflow.sendSMS("+919106823588", "Dummy message text...");
    // if (result.ok) {
    //   console.log("SUCCESS");
    // } 

    // console.log(result);
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

                    console.log(`Success! Login Succesfully ${userdata.email}`);

                    res.status(200).json({
                        message: "Success! Login Succesfully",
                        token: token,
                        status: 200,
                        // id: userData._id,
                    });
                } else {
                    console.log(`Success! Login Succesfully ${userdata.email}`);
                    token = userdata.tokens[0]['token']
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 30 * 24 * 3600 * 10000)
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
    console.log(req.body);
    const { mobile, name, password } = req.body;
    if (mobile == null || name == null || password == null) {
        console.log("Please enter a mobile or password or name");
    } else {
        const checkOwnerDetails = await user.findOne({ mobile: mobile });

        if (checkOwnerDetails == null) {
            const Hashedpassword = await bcrypt.hash(password,10);

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
        console.log(req.body);
        const userdata = await user.findOne({ mobile });
        console.log("userdata:__", userdata);
        if (userdata == null) {
            res.redirect("/user/login");
        } else {
            const isMatched = await bcrypt.compare(password, userdata.password);
            // console.log("isMatched:__", isMatched);
            if (isMatched) {
                if (userdata.tokens[0] == undefined) {
                    console.log("Hello::::");
                    const token = await userdata.generateauthtoken();

                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 30 * 24 * 3600 * 10000)
                    });
                    // console.log("Token:::-", token);
                    console.log(`Success! Login Succesfully ${userdata}`);
                    res.redirect("/user");
                } else {
                    token = userdata.tokens[0]['token']
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 30 * 24 * 3600 * 10000)
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
    var cities = await city.find({});
    var token = req.cookies.jwt;
    const secretKey = process.env.SECRET_KEY;
    var decodedToken = "";
    if (token) {
        decodedToken = jwt.verify(token, secretKey);
    }
    var profile = await user.findOne({ _id: decodedToken._id });
    res.render("buy", { data, cities, profile });
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
    res, res.render("sellform", { profile, cities });
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
    var profile = await user.findOne({ _id: decodedToken._id });
    var data = await property.findOne({ _id: req.params.id });
    var contacts = await contact.find({});
    res.render("singleproperty", { data, contacts, profile });
}

// property details form, post method

exports.propertDetails = async (req, res) => {
    console.log(req.body,"gggggg");
    try {
        console.log(req.body);
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
            city,
            rooms,
            built_up_area,
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
            residentType==null ||
            bathroom == null ||
            built_up_area == null) {
            if (req.headers.accept == undefined) {
                res.status(404).json({
                    message:
                        "address,projectName,residentType,city,price,propertyLife,size,facilities,carpet_area,super_built_up,project_area,booking_amount,furnishing,property_floor,landmark,builder_details,owner_info,location,category not found",
                });

            } else {
                req.flash('success','some field is required');
                res.redirect('back');
            }
        } else {
            var token = req.headers.authorization || req.cookies.jwt;
            const secretKey = process.env.SECRET_KEY;
            var decodedToken = "";
            if (token) {
                decodedToken = jwt.verify(token, secretKey);
            }
            const files = req.files;
            // console.log(files, "JJJJJJJJjjjjjjjjjjjjjjjj")
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
                    user_id: decodedToken._id,
                    address,
                    projectName,
                    price,
                    property_image,
                    propertyLife,
                    size,
                    bathroom,
                    facilities,
                    carpet_area,
                    super_built_up,
                    project_area,
                    booking_amount,
                    residentType,
                    furnishing,
                    property_floor,
                    landmark,
                    builder_details,
                    owner_info,
                    built_up_area,
                    location,
                    property_image_id,
                    scale_type,
                    house_type,
                    disclaimer,
                    rooms,
                    city,
                    category,
                });

                if (data) {
                    console.log("data added successfully", data);

                    if (req.headers.accept == undefined) {

                        res.status(200).json({ message: "data added successfully" });
                    } else {
                        req.flash('success','property added successfully');
                        res.redirect('back')
                    }
                } else {
                    if (req.headers.accept == undefined) {
                        console.log("data not added");

                        res.status(200).json({ message: "data not added" });
                    }
                    req.flash('success','an error has occurred');
                    res.redirect("back");
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// contact form post method

exports.contact = async (req, res) => {
    console.log(req.body);
    const { email, mobile, name, address, description } = req.body;

    if (
        email == null ||
        mobile == null ||
        name == null ||
        address == null ||
        description == null
    ) {
        if (req.headers.accept == undefined) {
            resp.json({ message: "some field is remaaining" })
        }
        else {
            res.redirect('back');
        }
        res.redirect("back");

    } else {
        console.log(req.params.id);
        var data = await contact.create({
            email,
            mobile,
            name,
            address,
            description,
            property_id: req.params.id,
        });

        if (data) {
            console.log("data added successfully");
            if (req.headers.accept == undefined) {
                res.json({ message: "data added successfully" })
            }
            else {
                req.flash('success', 'data added successfully')
                res.redirect('back');
            }
        } else {
            if (req.headers.accept == undefined) {
                res.json({ message: "data not added" });
            }
            else {
                req.flash('success',"data not added");
                res.redirect('back');
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

// rent sell , get method

exports.sell = async (req, res) => {
    var data = await property.find({ category: "sell" });
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json({ message: "no data found" });
    }
}

// rent property , get method

exports.rent = async (req, res) => {
    var data = await property.find({ category: "rent" });
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json({ message: "no data found" });
    }
}

exports.rent_buy_property = async (req, res) => {
    var data = await property.find({ category:req.params.category, house_type:req.params.house_type});
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
    console.log(token, "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");

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
        var profile = await user.findOne({ _id: decodedToken._id });

        // var userproperties=await property.find({user_id:decodedToken._id});
        console.log(req.headers);
        // console.log(profile);
        res.json(profile);
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
        console.log(profile);
        res.render("profile", { profile, property: propert });
    }
}

exports.deleteproperty = async (req, res) => {
    var id = req.params.id;
    var data = await property.findOne({ _id: req.params.id });
    console.log(data, "Oops!");
    if (id) {
        var cloudinary_id = data.property_image_id;
        for (var i = 0; i < data.property_image.length; i++) {

            cloudinary.uploader.destroy(cloudinary_id[i], function (error, result) {
                if (error) {
                    console.log(error);
                }
                console.log(result);
            });
        }

        var datas = await property.findByIdAndDelete(req.params.id);
        if (datas) {
            res.json({ message: "data deleted successfully" });
            // console.log(data)
        } else {
            res.json({ message: "data deleted successfully" });
            console.log(datas, "not deleted");
        }
    }
}

exports.delete_properties = async (req, res) => {
    var id = req.params.id;
    if (id) {
        var data = await property.findOne({ _id: req.params.id });

        // console.log(data);

        var cloudinary_id = data.property_image_id;

        for (var i = 0; i < data.property_image.length; i++) {
            cloudinary.uploader.destroy(cloudinary_id[i], function (error, result) {
                if (error) {
                    console.log(error);
                }
                console.log(result);
            });
        }

        var data = await property.findByIdAndDelete(req.params.id);
        if (data) {
            req.flash('success','property deleted successfully')
            res.redirect("back");
            // console.log(data)
        } else {
            res.redirect("back");
            console.log(data, "not deleted");
        }
    }
}

exports.update_property = async (req, res) => {

    console.log(req.files, "LLL");
    try {

        var data = await property.findOne({ _id: req.body.id });
        console.log(data, ":::::::");

        var cloudinary_id = data.property_image_id

        const files = req.files;

        if (req.files[0]) {
            for (var i = 0; i < data.property_image.length; i++) {

                cloudinary.uploader.destroy(cloudinary_id[i], function (error, result) {
                    if (error) {
                        console.log(error)
                    }
                    console.log(result)
                });
            }
            var property_image = [];
            var property_image_id = [];
            // var i = 0;
            for (let file of files) {
                let { path } = file;
                const imageLink = path;
                const uploadedProfileImageDetails =
                    await cloudinary.uploader.upload(imageLink, { folder: "userProfile", });
                const farmImages = uploadedProfileImageDetails.secure_url;
                const farmImages_id = uploadedProfileImageDetails.public_id;
                property_image.push(farmImages);
                property_image_id.push(farmImages_id);
            }
            // console.log(data,'LLll',cloudinary_id,"::");


            req.body.property_image = property_image
            req.body.propert_image_id = property_image_id

            var data = await property.findByIdAndUpdate(req.body.id, req.body);
            if (!data) {
                if (req.headers.accept == undefined) {
                    res.json({ message: "not updated" });
                }
                else {
                    req.flash('property not updated');
                    res.redirect('back');
                }
            } else {
                if (req.headers.accept == undefined) {
                    res.json({ message: "updated successfully" })
                }
                else {
                    req.flash('success','property updated successfully')
                    res.redirect('back');
                }
            }
        }
        else {

            var data = await property.findByIdAndUpdate(req.body.id, req.body);
            if (!data) {
                if (req.headers.accept == undefined) {
                    res.json({ message: "not updated" });
                }
                else {
                    req.flash('success','property not updated');
                    res.redirect('back');
                }
            } else {

                if (req.headers.accept == undefined) {
                    res.json({ message: "updated successfully" })
                }
                else {
                    req.flash('success','property updated successfully');
                    res.redirect('back');
                }
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
    res.render('update', { data, cities, profile });

}

exports.housetype=async(req,res)=>{

    var data = await property.find({house_type:req.params.housetype});
    if(data){
        res.status(200).json(data);
    }
}

exports.mainfilter=async(req, res)=>{

    console.log(req.body);
    var data=await property.find({})

}