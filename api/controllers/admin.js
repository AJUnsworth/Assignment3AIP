const Post = require("../models/post");
const User = require("../models/user");

exports.admin_check = async (req, res) => {
    if (req.decoded.isAdmin) {
        return res.sendStatus(200);
    } else {
        return res.sendStatus(403);
    }
};

exports.post_approve = async (req, res) => {
    const postId = req.body.postId;
    const userId = req.decoded.id;

    const post = await Post.findOne({ _id: postId });
    if (!post) {
        return res.sendStatus(404);
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
        return res.sendStatus(404);
    }

    if (!user.isAdmin) {
        return res.sendStatus(403);
    }

    post.flagged = false;
    post.reports = 0;
    post
        .save()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
};

exports.posts_flagged_get = async (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;

    const postCount = await Post.countDocuments({ flagged: true });

    Post.find({ flagged: true })
        .limit(10)
        .skip(skippedPosts)
        .sort({ createdAt: -1 })
        .exec(function (err, posts) {
            if (err) return res.status(404);
            return res.json({ posts: posts, postCount: postCount });
        });
}