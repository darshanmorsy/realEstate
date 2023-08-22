const mongoose = require('mongoose');

const basicpropertySchema = mongoose.Schema({
   
    user_id: {
        type: String,
    },
    projectName: {
        type: String,
    },
    mobile: {
        type:Number,
    }, 
    location: {
        type:String
    },
    active: {
        type: Number,
        default: 1
    },
    category:{
        type:String,
    },
    house_type:{
        type:String,
    },
    city:{
        type:String,
    },
    rooms:{
        type:String,
    }


},
{
    collection: "basicproperty",
    timestamps: true
});  

var basicproperty= mongoose.model('basicproperty',basicpropertySchema);
module.exports =basicproperty;