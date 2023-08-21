const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    
    mobile:{
        type:String
    },
    name: {
        type:String
    },
    address:{
        type:String
    },
    property_id:{
        type:String
    }

},{
    collection: "contact",
    timestamps: true
});

module.exports =  mongoose.model("contact", contactSchema);