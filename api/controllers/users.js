const User = require("../models/user");
const Post = require("../models/post")

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const errors = require("../services/errors");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");


/* Creates a new user account
*
* Create and login routes are based on a tutorial by Rishi Prasad
* See https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669
*/
exports.user_create = async (req, res) => {
    //Checks if user input contains any validation errors
    const { validationErrors, isValid } = await validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(validationErrors);
    }

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    try {
        // Hash password before saving in database
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt)
        newUser.password = hash;

        const user = await newUser.save();

        return res.json(user);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

//Returns a signed token in a cookie to a user who logs in
exports.user_login = async (req, res) => {
    //Checks if user input contains any validation errors
    const { validationErrors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(validationErrors);
    }

    const username = req.body.username;
    const password = req.body.password;

    try {
        user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ password: errors.INCORRECT_USERNAME_OR_PASSWORD });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ password: errors.INCORRECT_USERNAME_OR_PASSWORD });
        }

        //Based on SO post by Hitesh Anshani on comparing dates in the last 24 hours
        //See https://stackoverflow.com/questions/51405133/check-if-a-date-is-24-hours-old/51405446
        //Get a 24 hours in milliseconds
        const day = 24 * 60 * 60 * 1000;
        let dayAgo = user.lastLoggedIn - day;

        //Find users ipAddress and login time for checking if the account is a potential sock puppet
        //Based on user topkek's answer on how to get a user's IP address in Node
        //See https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
        const lastIpAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        if (!(user.lastLoggedIn >= dayAgo && user.lastIpAddress === lastIpAddress) && !user.isAdmin) {
            const users = await User.find({ lastIpAddress: lastIpAddress }).where("_id").ne(user._id);
            let matchingUsersCount = 1;

            for (let i = 0; i < users.length; i++) {

                //Check how many users have logged in from the same location in the past 24h, and send an error if it is 3 or more
                if (users[i].lastLoggedIn >= dayAgo) {
                    matchingUsersCount++;
                    if (matchingUsersCount >= 3) {
                        return res.status(409).json({ error: errors.POTENTIAL_SOCKPUPPET });
                    }
                }
            }
        }

        user.lastIpAddress = lastIpAddress;
        user.lastLoggedIn = Date.now();

        // Create JWT Payload
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        };

        const token = jwt.sign(
            payload,
            process.env.SECRET_OR_KEY,
            {
                expiresIn: 43200 // 12 hours in seconds
            },
        );

        const updatedUser = await user.save();
        return res
            .cookie("token", token, { httpOnly: true })
            .json({
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin
            });
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

//Removes users token on logout
exports.user_logout = (req, res) => {
    return res.clearCookie("token").sendStatus(204);
};

//Returns user details from a valid decoded token
exports.user_get_current = (req, res) => {
    return res.json(req.decoded);
};

//Returns a users reaction on a specified post
exports.user_reaction_get = async (req, res) => {
    const postId = req.query.post_id;
    const userId = req.params.userId;

    try {
        const user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ error: errors.USER_NOT_FOUND });
        }

        const likedPosts = user.likedPosts;
        const indexOfPost = likedPosts.findIndex(likedPost => likedPost.post == postId);

        //Only return reaction when a likedPost exists for a user
        if (indexOfPost != -1) {
            return res.json(likedPosts[indexOfPost].reactionType);
        }
        //Otherwise the user has not reacted to the post
        else {
            return res.json("None selected");
        }
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
}

//Returns a specified user with the total posts they have created, and reactions earned on posts
exports.user_get = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findOne({ _id: userId }).populate("posts");
        if (!user) {
            return res.status(404).json({ error: errors.USER_NOT_FOUND });
        }

        let reactionCount = 0;
        const postCount = user.posts.length;

        for (let post of user.posts) {
            reactionCount += post.totalReactions;
        }

        return res.json({ reactionCount, postCount, ...user.toJSON() });
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

//Gets a specified amount of user posts in order of newest to oldest
//Shows replies, but does not show flagged posts
exports.user_latest_get = async (req, res) => {
    const skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;
    const userId = mongoose.Types.ObjectId(req.params.userId);

    try {
        const posts = await Post.aggregate([
            { "$match": { "user": userId, "flagged": false } },
            { "$sort": { "createdAt": -1 } },
            {
                $facet: {
                    metadata: [{ $count: "totalCount" }],
                    results: [{ $skip: skippedPosts }, { $limit: limit }]
                }
            }
        ]);

        return res.json(posts[0]);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

//Gets a specified amount of user posts in order of most reactions to least
//Shows replies, but does not show flagged posts
exports.user_popular_get = async (req, res) => {
    const skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;
    const userId = mongoose.Types.ObjectId(req.params.userId);

    try {
        const posts = await Post.aggregate([
            { "$match": { "user": userId, "flagged": false } },
            {
                "$addFields": { "totalReactions": { "$sum": ["$reactions.like", "$reactions.wow", "$reactions.tears", "$reactions.laugh", "$reactions.love", "$reactions.angry"] } }
            },
            { "$sort": { "totalReactions": -1 } },
            {
                $facet: {
                    metadata: [{ $count: "totalCount" }],
                    results: [{ $skip: skippedPosts }, { $limit: limit }]
                }
            }
        ]);

        return res.json(posts[0]);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};