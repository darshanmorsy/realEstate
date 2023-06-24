const mongoose = require('mongoose');
// mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1/RealEstate")
    .then(()=>{
        console.log("connection is successfull");
    })
    .catch((err)=>{
        console.log(`Databse not connected ${err}`);
    }) 