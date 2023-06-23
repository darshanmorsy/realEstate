const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
   
    owner_id: {
        type: String,
    },
    address: {
        type: String,
    },
    projectName: {
        type: String,
    },
    price: {
        type: String,
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
    builder_details: {
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
    cloudinary_id: {
        type: String,
    },
    active: {
        type: Number,
        default: 0
    },
    property_image_id: {
        type: Array,
    },
    category:{
        type:String,
    },
    location:{
        type:String,
    },
},{
    collection: "user",
    timestamps: true
});

module.exports = mongoose.model('property', propertySchema);