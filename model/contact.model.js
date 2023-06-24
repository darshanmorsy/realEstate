const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    
    email: {
        type:String
    },
    mobile: {
        type:String
    },
    name: {
        type:String
    },
    address:{
        type:String
    },
    description:{
        type:String
    }
},{
    collection: "contact",
    timestamps: true
});

module.exports =  mongoose.model("contact", contactSchema);