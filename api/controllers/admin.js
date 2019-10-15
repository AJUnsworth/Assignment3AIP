const Post = require("../models/post");
const User = require("../models/user");

const errors = require("../services/errors");

exports.admin_check = async (req, res) => {
    if (req.decoded.isAdmin) {
        return res.sendStatus(200);
    } else {
        return res.status(403).json({ error: errors.INVALID_PERMISSIONS });
    }
};

exports.post_approve = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.decoded.id;

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
    post
        .save()
        .then(() => res.sendStatus(200))
        .catch(() => res.status(500).json({ error: errors.SERVER_ERROR }));
};

exports.posts_flagged_get = async (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;

    const postCount = await Post.countDocuments({ flagged: true });

    Post.find({ flagged: true })
        .limit(10)
        .skip(skippedPosts)
        .sort({ createdAt: -1 })
        .exec(function (err, posts) {
            if (err) return res.status(500).json({ error: errors.SERVER_ERROR });
            return res.json({ posts: posts, postCount: postCount });
        });
}