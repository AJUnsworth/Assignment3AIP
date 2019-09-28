const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticate = require("../services/authenticate");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const User = require("../models/user");

//Register and login routes are based on a tutorial by Rishi Prasad
//See https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669
router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ username: req.body.username }).then(user => {
        if (user) {
            return res.status(400).json({ username: "Username is already registered" });
        } else {
            User.findOne({ email: req.body.email }).then(user => {
                if (user) {
                    return res.status(400).json({ email: "Email is already registered" });
                } else {
                    const newUser = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                    });

                    // Hash password before saving in database
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err));
                        });
                    });
                }
            });
        }
    });
});

router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username }).then(user => {
        if (!user) {
            return res.status(404).json({ username: "Username not found" });
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // Create JWT Payload
                const payload = {
                    id: user._id,
                    username: user.username,
                    email: user.email
                };
                // Sign token
                const token = jwt.sign(
                    payload,
                    process.env.SECRET_OR_KEY,
                    {
                        expiresIn: 3600 // 1 hour in seconds
                    },
                );
                return res
                    .cookie("token", token, { httpOnly: true })
                    .json({id: user._id, username: user.username, email: user.email})
                    .sendStatus(200);
            } else {
                return res.status(400).json({ password: "Password incorrect" });
            }
        });
    });
});

router.post("/logout", function(req, res) {
    res.clearCookie("token").sendStatus(200);
});

//CheckToken route is based on tutorial by Faizan Virani from Medium.com
//See https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0
router.get("/checkToken", authenticate, function(req, res) {
    res.sendStatus(200);
});

router.get("/getCurrentUser", authenticate, function(req, res) {
    //Look for token in request body, query string, headers, or cookie
    const token =
        req.body.token ||
        req.query.token ||
        req.headers["x-access-token"] ||
        req.cookies.token;

    //Decode because authenticate middleware has confirmed the token is valid
    const userData = jwt.decode(token);

    res.send(userData);
});

router.get("/getPostReaction", function(req, res) {
    const postId = req.query.post_id;
    const userId = req.query.user_id;

    User.findOne({ _id: userId }).then(user => {
        if (!user) {
            return res.status(404).send();
        } else {
            const likedPosts = user.likedPosts;
            const indexOfPost = likedPosts.findIndex(likedPost => likedPost.postId == postId);

            //Only return reactionType when a likedPost exists for a user
            if(indexOfPost != -1) {
                return res.json({ activeReaction: likedPosts[indexOfPost].reactionType });
            }
            //Otherwise the user has not reacted to the post
            else {
                return res.sendStatus(200);
            }
        }
    });
});

module.exports = router;
