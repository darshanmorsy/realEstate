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
    collection: "user",
    timestamps: true
});

const contact = mongoose.model("contact", adminSchema);
module.exports = contact;