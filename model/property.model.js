const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
   
    user_id: {
        type: String,
    },
    address: {
        type: String,
    },
    projectName: {
        type: String,
    },
    price: {
        type: Number,
    }, 
    property_image: {
        type: Array
    }, 
    propertyLife: {
        type: String,
    },
    size: {
        type: String,   
    },
    facilities: {
        type: Array
    },
    carpet_area: {
        type: String
    },
    super_built_up:{
        type: String
    },
    built_up_area: {
        type: String
    },
    project_area:{
        type: String,
    },
    booking_amount:{
        type: String
    },
    furnishing: {
        type: String
    },
    property_floor: {
        type: String 
    },
    landmark: {
        type: String
    },
    builder_details:{
        type: String
    },
    owner_info:{
        type: String
    },
    location: {
        type:String
    },
    scale_type:{
        type: String
    },
    disclaimer:{
        type: String
    },
    active: {
        type: Number,
        default: 0
    },
    category:{
        type:String,
    },
    type:{
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
    },
    residentType:{
        type:String,
    },
    saletype:{
        type:String,
    },
    possession:{
        type:String,
    }, 
    facing:{
        type:String,
    },
     bathroom:{
        type:Number,
    },
    listedby:{
        type:String,
    },
    leasttype:{
        type:String,
    },
    available:{
        type:String,
    },
    powerbackup:{
        type:String,
    },
    pincode:{
        type:String,
    }


},
{
    collection: "property",
    timestamps: true
});  

var property= mongoose.model('property', propertySchema);
module.exports =property;