const User = require("../models/user");
const Post = require("../models/post")

const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const errors = require("../services/errors");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

//Register and login routes are based on a tutorial by Rishi Prasad
//See https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669
exports.user_create = async (req, res) => {
    const { validationErrors, isValid } = await validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(validationErrors);
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
                .catch(() => res.status(500).json({ errors: errors.SERVER_ERROR }));
        });
    });
};

exports.user_login = async (req, res) => {
    const { validationErrors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(validationErrors);
    }

    const username = req.body.username;
    const password = req.body.password;

    user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ password: errors.INCORRECT_USERNAME_OR_PASSWORD });
    }

    const isMatch = bcrypt.compare(password, user.password);
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
    const lastIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (!(user.lastLoggedIn >= dayAgo && user.lastIpAddress === lastIpAddress) || !user.isAdmin) {
        const users = await User.find({ lastIpAddress: lastIpAddress }).where("_id").ne(user._id);
        let matchingUsersCount = 1;

        for (let i = 0; i < users.length; i++) {

            //Flag potential sock puppets when account was last logged in less than a day ago
            if (users[i].lastLoggedIn >= dayAgo) {
                matchingUsersCount++;
                if (matchingUsersCount >= 3) {
                    return res.status(405).json({ error: errors.POTENTIAL_SOCKPUPPET });
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

    // Sign token
    const token = jwt.sign(
        payload,
        process.env.SECRET_OR_KEY,
        {
            expiresIn: 43200 // 12 hours in seconds
        },
    );

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
            return res.status(500).json({ errors: errors.SERVER_ERROR });
        }
    });
};

exports.user_logout = (req, res) => {
    return res.clearCookie("token").sendStatus(200);
};

exports.user_get_current = (req, res) => {
    return res.json(req.decoded);
};

exports.user_reaction_get = (req, res) => {
    const postId = req.query.post_id;
    const userId = req.params.userId;

    User.findOne({ _id: userId }).then(user => {
        if (!user) {
            return res.status(404).json({ error: errors.USER_NOT_FOUND });
        }

        const likedPosts = user.likedPosts;
        const indexOfPost = likedPosts.findIndex(likedPost => likedPost.post == postId);

        //Only return reactionType when a likedPost exists for a user
        if (indexOfPost != -1) {
            return res.json(likedPosts[indexOfPost].reactionType);
        }
        //Otherwise the user has not reacted to the post
        else {
            return res.json("None selected");
        }
    });
}

exports.user_get = (req, res) => {
    const userId = req.params.userId;

    User.findOne({ _id: userId }).populate({ path: "posts", match: { flagged: false } }).then(user => {
        if (!user) {
            return res.status(404).json({ error: errors.USER_NOT_FOUND });
        }

        var reactionCount = 0;
        const postCount = user.posts.length;

        for (var post of user.posts) {
            reactionCount += post.totalReactions;
        }

        return res.json({ reactionCount, postCount, ...user.toJSON() });
    })
        .catch(() => res.status(500).json({ error: errors.SERVER_ERROR }));
};

exports.user_latest_get = (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const userId = mongoose.Types.ObjectId(req.params.userId);

    Post.aggregate([
        { '$match': { 'user': userId, 'flagged': false } },
        { '$sort': { 'createdAt': -1 } },
        {
            $facet: {
                metadata: [{ $count: "totalCount" }],
                results: [{ $skip: skippedPosts }, { $limit: 10 }]
            }
        }])
        .exec(function (err, posts) {
            if (err) return res.status(500).json({ error: errors.SERVER_ERROR });
            return res.json(posts[0]);
        });
};

exports.user_popular_get = (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const userId = mongoose.Types.ObjectId(req.params.userId);

    Post.aggregate([
        { '$match': { 'user': userId, 'flagged': false } },
        {
            '$addFields': { 'totalReactions': { '$sum': ['$reactions.like', '$reactions.wow', '$reactions.tears', '$reactions.laugh', '$reactions.love', '$reactions.angry'] } }
        },
        { '$sort': { 'totalReactions': -1 } },
        {
            $facet: {
                metadata: [{ $count: "totalCount" }],
                results: [{ $skip: skippedPosts }, { $limit: 10 }]
            }
        }])
        .exec(function (err, posts) {
            if (err) return res.status(500).json({ error: errors.SERVER_ERROR });
            return res.json(posts[0]);
        });
};