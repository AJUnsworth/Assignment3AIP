const Post = require("../models/post");
const User = require("../models/user");

const mongoose = require('mongoose');
const { uploadImage, deleteImage } = require("../services/s3");
const checkImageAppropriateness = require("../services/cloud-vision");
const errors = require("../services/errors");

const singleUpload = uploadImage.single("image");

//The create route is based off a tutorial from Medium.com that can no longer be located
//A similar tutorial can be seen here: https://medium.com/@paulrohan/file-upload-to-aws-s3-bucket-in-a-node-react-mongo-app-and-using-multer-72884322aada
exports.post_create = (req, res) => {
    //Upload image to S3 bucket then create a new post if successful
    singleUpload(req, res, async err => {
        if (!req.file || req.file === undefined || err) {
            return res.status(400).json({ error: errors.CANNOT_UPLOAD_IMAGE });
        }

        const newPost = new Post({
            user: req.decoded.id,
            imageUrl: req.file.location,
            reports: 0,
            reactions: {
                like: 0,
                laugh: 0,
                love: 0,
                wow: 0,
                tears: 0,
                angry: 0
            }
        });

        try {
            //Checks if the post is a reply, otherwise it is a main post
            if (req.body.replyTo) {
                const parentPost = await Post.findOne({ _id: req.body.replyTo });
                if (!parentPost) {
                    return res.status(404).json({ error: errors.POST_NOT_FOUND });
                }

                newPost.replyTo = req.body.replyTo;
                newPost.depth = req.body.depth;
            }

            const result = await checkImageAppropriateness(req.file.location);
            if (result) {
                newPost.flagged = true;
            }

            const post = await newPost.save();
            return res.json(post);
        } catch (error) {
            return res.status(500).json({ error: errors.SERVER_ERROR });
        }
    });
};

exports.post_edit = async (req, res) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findOne({ _id: postId }).populate("replies");
        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });
        } else if (!post.replies.length && !post.totalReactions) {
            singleUpload(req, res, async err => {
                if (err) return res.status(500).json({ error: errors.SERVER_ERROR });
                const userId = req.decoded.id;

                //User should only be able to delete their posts
                if (post.user != userId) {
                    return res.status(403).json({ error: errors.INVALID_USER });
                }

                if (post.imageUrl) {
                    await deleteImage(post.imageUrl);
                }

                //Remove only the image if the post has replies to replace with a placeholder
                post.imageUrl = req.file.location;

                const result = await checkImageAppropriateness(req.file.location);
                if (result) {
                    post.flagged = true;
                }

                const updatedPost = await post.save();
                const populatedPost = await updatedPost.populate("user").execPopulate();
                return res.json(populatedPost);
            });
        } else {
            return res.status(405).json({ error: errors.CANNOT_EDIT_POST });
        }
    } catch (error) {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
}

exports.post_delete = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.decoded.id;

    try {
        const post = await Post.findOne({ _id: postId }).populate("replies");
        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });
        }

        if (post.user != userId) {
            return res.status(403).json({ error: errors.INVALID_USER });
        }

        if (post.imageUrl) {
            await deleteImage(post.imageUrl);
        }

        if (Array.isArray(post.replies) && post.replies.length) {
            //Remove only the image if the post has replies to replace with a placeholder
            post.imageUrl = null;
            const updatedPost = await post.save();
            const populatedPost = await updatedPost.populate("user").execPopulate();
            return res.json(populatedPost);
        } else {
            await post.remove();
            return res.sendStatus(200);
        }
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

exports.post_report = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.decoded.id;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: errors.USER_NOT_FOUND });
        }

        const indexOfPost = user.reportedPosts.findIndex(reportedPost => reportedPost.reportedPost == postId);
        if (indexOfPost != -1) {
            return res.status(405).json({ error: errors.POST_ALREADY_REPORTED });
        }

        const post = await Post.findOneAndUpdate({ _id: postId }, { $inc: { reports: 1 } }, { new: true });
        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });
        }

        user.reportedPosts.push({ reportedPost: postId });
        await user.save();

        if (post.reports >= 20) {
            post.flagged = true
            const updatedPost = await post.save();
            updatedPost => res.json(updatedPost);
        }
        else {
            return res.sendStatus(200);
        }
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

exports.post_react = async (req, res) => {
    const userId = req.decoded.id;
    const postId = req.params.postId;
    const reactionType = req.body.reactionType;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: errors.USER_NOT_FOUND });
        }

        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });
        }

        //Find if user has already liked the post
        const likedPosts = user.likedPosts;
        const indexOfPost = likedPosts.findIndex(likedPost => likedPost.post == postId);

        if (indexOfPost != -1) {
            const likedPost = likedPosts[indexOfPost];
            const originalReactionType = likedPost.reactionType;

            //Check if user is removing reaction, or selecting a new reaction
            if (originalReactionType === reactionType) {
                likedPosts.splice(likedPost);
                post.reactions[reactionType]--;
            } else {
                likedPost.reactionType = reactionType;
                post.reactions[originalReactionType]--;
                post.reactions[reactionType]++;
            }
        } else {
            user.likedPosts.push({
                post: postId,
                reactionType: reactionType
            });
            post.reactions[reactionType]++;
        }

        await user.save();

        const updatedPost = await post.save();
        return res.json(updatedPost.reactions);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

exports.post_metrics = async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findOne({ _id: postId })
            .populate({ path: "totalReplies", match: { flagged: false } });
        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });
        } else {
            return res.json({
                totalReactions: post.totalReactions,
                totalReplies: post.totalReplies
            });
        }
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

exports.posts_latest_get = async (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;

    try {
        const posts = await Post.aggregate([
            {
                '$match': {
                    'replyTo': { '$exists': false },
                    'flagged': false
                }
            }, {
                '$sort': { 'createdAt': -1 }
            },

            {
                $facet: {
                    metadata: [{ $count: "totalCount" }],
                    results: [{ $skip: skippedPosts }, { $limit: 10 }]
                }
            }]);

        return res.json(posts[0]);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

exports.posts_popular_get = async (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;

    try {
        const posts = await Post.aggregate([
            {
                '$match': { 'replyTo': { '$exists': false }, 'flagged': false }
            },
            {
                '$addFields': { 'totalReactions': { '$sum': ['$reactions.like', '$reactions.wow', '$reactions.tears', '$reactions.laugh', '$reactions.love', '$reactions.angry'] } }
            },
            {
                '$sort': { 'totalReactions': -1 }
            },
            {
                $facet: {
                    metadata: [{ $count: "totalCount" }],
                    results: [{ $skip: skippedPosts }, { $limit: 10 }]
                }
            }
        ]);

        return res.json(posts[0]);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

exports.posts_replies_latest_get = async (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const postId = mongoose.Types.ObjectId(req.params.postId);

    try {
        const posts = await Post.aggregate([
            { '$match': { 'replyTo': postId, 'flagged': false } },
            { '$sort': { 'createdAt': -1 } },
            {
                $facet: {
                    metadata: [{ $count: "totalCount" }],
                    results: [{ $skip: skippedPosts }, { $limit: 10 }]
                }
            }
        ]);

        return res.json(posts[0]);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

exports.posts_replies_popular_get = async (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const postId = mongoose.Types.ObjectId(req.params.postId);

    try {
        const posts = await Post.aggregate([
            { '$match': { 'replyTo': postId, 'flagged': false } },
            {
                '$addFields': { 'totalReactions': { '$sum': ['$reactions.like', '$reactions.wow', '$reactions.tears', '$reactions.laugh', '$reactions.love', '$reactions.angry'] } }
            },
            { '$sort': { 'totalReactions': -1 } },
            {
                $facet: {
                    metadata: [{ $count: "totalCount" }],
                    results: [{ $skip: skippedPosts }, { $limit: 10 }]
                }
            }
        ]);

        return res.json(posts[0]);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

exports.post_reply_parents_get = async (req, res) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });
        }

        let replyChain = [post];
        for (let depth = 0; depth < post.depth; depth++) {
            const parentPost = await Post.findOne({ _id: replyChain[0].replyTo });
            if (!parentPost) {
                return res.status(404).json({ error: errors.POST_NOT_FOUND });
            }
            replyChain.unshift(parentPost);
        }

        return res.json(replyChain);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
}

exports.post_get = async (req, res) => {
    const postId = req.params.postId;
    try {
        post = await Post.findOne({ _id: postId }).populate("user").populate("totalReplies");
        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });
        } else {
            const totalReplies = post.totalReplies;
            return res.json({ totalReplies, ...post.toJSON() });
        }
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};