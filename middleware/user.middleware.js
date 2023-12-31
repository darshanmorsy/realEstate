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
                    function removeQueryParams(url) {
                        const parsedUrl = new URL(url)
                        parsedUrl.search = ""
                        return parsedUrl.toString()
                    }         
                    const modifiedUrl = removeQueryParams(req.get('referer'));
                    console.log(modifiedUrl);
                    console.log(req.get('referer'),"o");
                    var link=modifiedUrl+'?openmodal=true'
                    res.redirect(link)
                }
            } else {
                const userData = await user.findById({ _id: verifyUser._id })
                if (userData == null) {
                    if(req.headers.authorization){
                        res.status(403).json({ message:"data is not authorized"})
                    }

                    function removeQueryParams(url) {
                const parsedUrl = new URL(url)
                parsedUrl.search = ""
                return parsedUrl.toString()
            }         
            const modifiedUrl = removeQueryParams(req.get('referer'));
            console.log(modifiedUrl);
            console.log(req.get('referer'),"o");
            var link=modifiedUrl+'?openmodal=true'
            res.redirect(link)
                } else {
                    req.user = userData
                    req.token = Token
                    next()
                }
            }
        } else {

            function removeQueryParams(url) {
                const parsedUrl = new URL(url)
                parsedUrl.search = ""
                return parsedUrl.toString()
            }         
            const modifiedUrl = removeQueryParams(req.get('referer'));
            console.log(modifiedUrl);
            console.log(req.get('referer'),"o");
            var link=modifiedUrl+'?openmodal=true'
            res.redirect(link)

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
