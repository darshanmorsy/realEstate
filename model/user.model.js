const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mobile: {
        type:String
    },
    password: {
        type:String
    },
},{
    collection: "user",
    timestamps: true
});

const user = mongoose.model("user", userSchema);
module.exports = user;