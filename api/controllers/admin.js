const Post = require("../models/post");
const User = require("../models/user");

const errors = require("../services/errors");

//Checks if a decoded user token is an administrator, otherwise returns a 403 error
exports.admin_check = (req, res) => {
    if (req.decoded.isAdmin) {
        return res.sendStatus(200);
    } else {
        return res.status(403).json({ error: errors.INVALID_PERMISSIONS });
    }
};

//Allows administrator to approve a flagged post and removes all reports, making it visible to all users
exports.post_approve = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.decoded.id;

    try {
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });
        }

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: errors.USER_NOT_FOUND });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ error: errors.INVALID_PERMISSIONS });
        }

        post.flagged = false;
        post.reports = 0;
        await post.save();

        return res.sendStatus(200);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

//Retrieves a specified amount of latest flagged posts 
exports.posts_flagged_get = async (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    let limit = parseInt(req.query.limit, 10) || 10;

    try {
        const postCount = await Post.countDocuments({ flagged: true });

        const posts = await Post.find({ flagged: true })
            .limit(limit)
            .skip(skippedPosts)
            .sort({ createdAt: -1 });

        return res.json({ posts: posts, postCount: postCount });
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};