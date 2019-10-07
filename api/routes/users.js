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
router.post("/register", async (req, res) => {
    const { errors, isValid } = await validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

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
            return res.status(404).json({ password: "Username or password is incorrect" });
        } else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    // Create JWT Payload
                    const payload = {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        isAdmin: user.isAdmin
                    };
                    // Sign token
                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_OR_KEY,
                        {
                            expiresIn: 43200 // 12 hours in seconds
                        },
                    );

                    //Based on SO post by Hitesh Anshani on comparing dates in the last 24 hours
                    //See https://stackoverflow.com/questions/51405133/check-if-a-date-is-24-hours-old/51405446
                    //Get a 24 hours in milliseconds
                    const day = 24 * 60 * 60 * 1000;
                    let dayAgo = user.lastLoggedIn - day;

                    //Find users ipAddress and login time for checking if the account is a potential sock puppet
                    //Based on user topkek's answer on how to get a user's IP address in Node
                    //See https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
                    const lastIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                    if ((user.lastLoggedIn >= dayAgo && user.lastIpAddress === lastIpAddress) || user.isAdmin) {
                        user.lastIpAddress = lastIpAddress;
                        user.lastLoggedIn = Date.now();

                        user.save(err => {
                            if (!err) {
                                return res
                                    .cookie("token", token, { httpOnly: true })
                                    .json({
                                        id: user._id,
                                        username: user.username,
                                        email: user.email,
                                        isAdmin: user.isAdmin
                                    });
                            } else {
                                return res.sendStatus(500);
                            }
                        });
                    } else {
                        User.find({ lastIpAddress: lastIpAddress }).where("_id").ne(user._id).then(users => {
                            let matchingUsersCount = 1;

                            for (let i = 0; i < users.length; i++) {

                                //Flag potential sock puppets when account was last logged in less than a day ago
                                if (users[i].lastLoggedIn >= dayAgo) {
                                    matchingUsersCount++;
                                    if (matchingUsersCount >= 3) {
                                        return res.sendStatus(405);
                                    }
                                }
                            }

                            user.lastIpAddress = lastIpAddress;
                            user.lastLoggedIn = Date.now();

                            user.save(err => {
                                if (!err) {
                                    return res
                                        .cookie("token", token, { httpOnly: true })
                                        .json({
                                            id: user._id,
                                            username: user.username,
                                            email: user.email,
                                            isAdmin: user.isAdmin
                                        });
                                } else {
                                    return res.sendStatus(500);
                                }
                            });
                        });
                    }
                } else {
                    return res.status(404).json({ password: "Username or password incorrect" });
                }
            });
        }
    });
});

router.post("/logout", function (req, res) {
    res.clearCookie("token").sendStatus(200);
});

//CheckToken route is based on tutorial by Faizan Virani from Medium.com
//See https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0
router.get("/checkToken", authenticate, function (req, res) {
    return res.sendStatus(200);
});

router.get("/checkAdmin", authenticate, async function (req, res) {
    if (req.decoded.isAdmin) {
        return res.sendStatus(200);
    } else {
        return res.sendStatus(403);
    }
});

router.get("/getCurrentUser", authenticate, function (req, res) {
    return res.json(req.decoded);
});

router.get("/getPostReaction", authenticate, function (req, res) {
    const postId = req.query.post_id;
    const userId = req.decoded.id;

    User.findOne({ _id: userId }).then(user => {
        if (!user) {
            return res.sendStatus(404);
        } else {
            const likedPosts = user.likedPosts;
            const indexOfPost = likedPosts.findIndex(likedPost => likedPost.postId == postId);

            //Only return reactionType when a likedPost exists for a user
            if (indexOfPost != -1) {
                return res.json(likedPosts[indexOfPost].reactionType);
            }
            //Otherwise the user has not reacted to the post
            else {
                return res.json("None selected");
            }
        }
    });
});

router.get("/:userId", function (req, res) {
    const userId = req.params.userId;

    User.findOne({ _id: userId }).populate({ path: "posts", match: { flagged: false } }).then(user => {
        if (!user) {
            return res.sendStatus(404);
        } else {
            var reactionCount = 0;
            const postCount = user.posts.length;

            for (var post of user.posts) {
                reactionCount += post.totalReactions;
            }

            return res.json({ reactionCount, postCount, ...user.toJSON() });
        }
    })
        .catch(() => res.sendStatus(404));
});

module.exports = router;