const owner = require("../models/owner.model");
const jwt = require("jsonwebtoken");
const ownerSchema = async (req, res, next) => {
    try {
        const Token = req.headers.authorization;
        console.log(Token);
        if (Token) {
            const verifyOwner = jwt.verify(Token, process.env.SECRET_KEY, (error, data) => {
                // if (error == null) { return error; }
                // else return data;
                return data;
            }
            );
            console.log(verifyOwner);   
            if (verifyOwner == undefined) {
                res.status(404).json({
                    message: "TOKEN CANNOT MATCH!",
                    status: 404,
                });
            } else {
                const ownerData = await owner.findById({ _id: verifyOwner._id });
                if (ownerData == null) {
                    res.status(401).json({
                        message: "UNAUTHORIZED",
                        status: 401,
                    });
                } else {
                    req.owner = ownerData;
                    req.token = Token;
                    next();
                  
                }
            }
        } else {
            res.status(401).json({
                message: "please login to your account",
                status: 500,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500,
        });
    }
};

module.exports = ownerSchema;
