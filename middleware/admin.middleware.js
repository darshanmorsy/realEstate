const { request } = require("../controller/admin.controller");
const admin = require("../model/admin.model")
const jwt = require("jsonwebtoken");
const adminSchema = async (req, res, next) => {
    try {
        const Token = req.headers.authorization || req.cookies.jwt;
        console.log(Token);
        if (Token) {
            const admins = jwt.verify(Token, process.env.SECRET_KEY, (error, data) => {
                // if (error == null) { return error; }
                // else return data;
                return data;
            }
            );
            console.log(admins)
            if (admins == undefined) {
          
                    res.redirect('/admin/login')
                
            } else {
                const adminData = await admin.findById(admins._id)
                if (adminData == null) {
               
                        res.redirect('/admin/login')
                    
                } else {
                    req.admin = adminData;
                    req.token = Token;
                    next();
                  
                }
            }
        } else {
           if(req.headers.authorization){
            res.status(401).json({
                message: "please login to your account",
                status: 500,
            })
           }else{
            res.redirect('/admin/login')
           }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500,
        })
    }
}

module.exports = adminSchema;
