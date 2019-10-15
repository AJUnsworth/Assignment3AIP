const jwt = require("jsonwebtoken");

const errors = require("../services/errors");

//Based on authentication tutorial by Faizan Virani on Medium.com
//See https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0#f07a
const authenticate = function (req, res, next) {
    //Look for token in request body, query string, headers, or cookie
    const token =
        req.body.token ||
        req.query.token ||
        req.headers["x-access-token"] ||
        req.cookies.token;

    //Check if token is still valid
    if (!token) {
        return res.status(404).json({ error: errors.TOKEN_NOT_FOUND });
    } else {
        jwt.verify(token, process.env.SECRET_OR_KEY, function (err, decoded) {
            if (err) {
                return res
                    .clearCookie("token")
                    .status(401).json({ error: errors.INVALID_TOKEN });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
}

module.exports = authenticate;