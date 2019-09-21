const jwt = require("jsonwebtoken");
// From https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0#f07a
const authenticate = function(req, res, next) {
    //Look for token in request body, query string, headers, or cookie
    const token =
        req.body.token ||
        req.query.token ||
        req.headers["x-access-token"] ||
        req.cookies.token;

    //Check if token is still valid
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    } else {
        jwt.verify(token, process.env.SECRET_OR_KEY, function(err, decoded) {
            if (err) {
                return res
                    .clearCookie("token")
                    .status(401).send("Unauthorized: Invalid token");
            } else {
                req.username = decoded.username;
                next();
            }
        });
    }
}

module.exports = authenticate;