const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    mobile: {
        type:String
    },
    name:{
          type:String
        },
    password: {  
        type:String
    },
    tokens: [
        {
            token: {
                type: String,
                // required: true,
            }
        }
    ]
},{   
    collection: "user",
    timestamps: true
})

userSchema.methods.generateauthtoken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token;
    } catch (error) {
        console.log("Error(Token Generation:__)", error);
    }
}


const user = mongoose.model("user", userSchema);
module.exports = user;