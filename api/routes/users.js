const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("../services/auth");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const User = require("../models/user");

//From https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669
// @route POST api/users/register
// @desc Register user
// @access Public
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

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
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
                    id: user._id
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

module.exports = router;
