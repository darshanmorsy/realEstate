const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    city: {
        type:String
    }
});

const city = mongoose.model("city", citySchema);
module.exports = city;