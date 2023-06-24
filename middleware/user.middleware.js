const user = require("../models/user.model");
const jwt = require("jsonwebtoken");

const userSchema = async (req, res, next) => {
    try {
        const Token = req.headers.authorization;
        console.log(Token);
        if (Token) {
            const verifyUser = jwt.verify(Token, process.env.SECRET_KEY, (error, data) => {
                // if (error == null) { return error; }
                // else return data;
                return data;
            }
            );
            console.log(verifyUser);
            if (verifyUser == undefined) {
                res.status(404).json({
                    message: "TOKEN CANNOT MATCH!",
                    status: 404,
                });
            } else {
                const userData = await user.findById({ _id: verifyUser._id });
                if (userData == null) {
                    res.status(401).json({
                        message: "UNAUTHORIZED",
                        status: 401,
                    });
                } else {
                    req.user = userData;
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

module.exports = userSchema;
