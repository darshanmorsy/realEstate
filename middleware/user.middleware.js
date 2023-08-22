const user = require("../model/user.model");
const jwt = require("jsonwebtoken");

const userSchema = async (req, res, next) => {
    try {
        console.log(req.headers);
        const Token = req.cookies.jwt || req.headers.authorization;

        console.log(Token,"pppp");
        if (Token) {
            const verifyUser = jwt.verify(Token, process.env.SECRET_KEY, (error, data) => {
                // if (error == null) { return error; }
                // else return data;
                return data;
            });
            console.log(verifyUser);
         
            if (verifyUser == undefined) {
                if(req.headers.authorization){

                    res.status(404).json({
                        message: "TOKEN CANNOT MATCH!",
                        status: 404,
                    });
                }else{
                    res.redirect('/user/login')
                }
            } else {
                const userData = await user.findById({ _id: verifyUser._id })
                if (userData == null) {
                    if(req.headers.authorization){
                        res.status(403).json({ message:"data is not authorized"})
                    }
                    res.redirect('/user/login')
                } else {
                    req.user = userData
                    req.token = Token
                    next()
                }
            }
        } else {
            res.redirect('/user/login')
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500,
        });
    }
};

module.exports = userSchema;
