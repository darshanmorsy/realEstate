const mongoose = require("mongoose");

const flatschema = mongoose.Schema(
  {
    category: {
      type: String,
    },
    name: {
      type: String,
    },
    projectName: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    location: {
      type: String,
    },
    address: {
      type: String,
    },
    property_type: {
      type: String,
    },
    // type: Number,
    // default: 1
    // },
    property_details: {
        property_towers: {},
        property_floors: {},
        property_size: {},
        caste: {},
        
        ammenities: {
            type: Array,
        },
        
        dastavage: {
            
            avage: {
          type: String,
        },
        gst: {
            type: String,
        },
        dastavagekharch: {
            type: String,
        },
        
        extrakharch: {
          meter: {},
          // manually
        },
        bonus: {
            type: String,
            //   bybuilder by owner
        },
        loan: {
            debt: {
              type: Number,
            },
        },
        descriptions: {
            type: String,
        },
        extrawork:{
            type: String,
        }
      },
    },
    contact_details: {
      type: String,
    },
    tower: {
      type: String,
    },
    towersize: {
      a1: {},
    },
    payment_method: {
      type: array,
    },
    city: {
      type: String,
    },
    rooms: {
      type: String,
    },
    property_image: {
      type: String,
    },
  },
  {
    collection: "flat",
    timestamps: true,
  }  
);

var flat = mongoose.model("flat", flatschema)
module.exports = flat;
