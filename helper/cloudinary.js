const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: 'dybxrjyq0',
    api_key: '158742562778146',
    api_secret: '6EbevDxPQeG5uRmZZ-EXM6gJTQI',
});

module.exports = cloudinary;