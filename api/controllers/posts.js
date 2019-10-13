const Post = require("../models/post");
const User = require("../models/user");

const mongoose = require('mongoose');
const { uploadImage, deleteImage } = require("../services/s3");
const checkImageAppropriateness = require("../services/cloud-vision");

const singleUpload = uploadImage.single("image");

//The create route is based off a tutorial from Medium.com that can no longer be located
//A similar tutorial can be seen here: https://medium.com/@paulrohan/file-upload-to-aws-s3-bucket-in-a-node-react-mongo-app-and-using-multer-72884322aada
exports.post_create = async (req, res, next) => {
    //Upload image to S3 bucket then create a new post if successful
    singleUpload(req, res, async function (err) {
        if (!req.file || req.file === undefined) {
            return res.sendStatus(400);
        }

        if (err) next(err);

        const newPost = new Post({
            userId: req.decoded.id,
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

        //Checks if the post is a reply, otherwise it is a main post
        if (req.body.replyTo) {
            const parentPost = await Post.findOne({ _id: req.body.replyTo });
            if (!parentPost) {
                return res.sendStatus(404);
            }

            newPost.replyTo = req.body.replyTo;
            newPost.depth = req.body.depth;
        }

        checkImageAppropriateness(req.file.location).then(result => {
            if (result) {
                newPost.flagged = true;
            }

            newPost
                .save()
                .then(post => res.json(post))
                .catch(() => res.sendStatus(500));
        })
            .catch(() => res.sendStatus(500));
    });
};

exports.post_edit = async (req, res, next) => {
    //Fix later by implementing with Multer
    singleUpload(req, res, function (err) {
        const postId = req.body.postId;
        const userId = req.decoded.id;

        Post.findOne({ _id: postId }).populate("replies").then(async post => {
            if (!post) {
                return res.sendStatus(404);
            } else if (!post.replies.length && !post.totalReactions) {
                //singleUpload(req, res, function (err) {
                if (err) next(err);

                //User should only be able to delete their posts
                if (post.userId != userId) {
                    return res.sendStatus(403);
                }

                if (post.imageUrl) {
                    //deleteImage only returns error messages if any issues occur
                    const err = await deleteImage(post.imageUrl)
                    if (err) return res.sendStatus(500);
                }

                //Remove only the image if the post has replies to replace with a placeholder
                post.imageUrl = req.file.location;
                checkImageAppropriateness(req.file.location).then(result => {
                    if (result) {
                        post.flagged = true;
                    }

                    post
                        .save()
                        .then(updatedPost => {
                            updatedPost.populate("userId").execPopulate()
                                .then(populatedPost => {
                                    return res.json(populatedPost);
                                });
                        })
                        .catch(() => res.sendStatus(500));
                });
            } else {
                return res.sendStatus(405);
            }
        });
    });
}

exports.post_delete = async (req, res) => {
    const postId = req.body.postId;
    const userId = req.decoded.id;

    const post = await Post.findOne({ _id: postId }).populate("replies");
    if (!post) {
        return res.sendStatus(404);
    }

    if (post.userId != userId) {
        return res.sendStatus(403);
    }

    if (post.imageUrl) {
        //deleteImage only returns error messages if any issues occur
        const err = await deleteImage(post.imageUrl)
        if (err) return res.sendStatus(500);
    }

    if (Array.isArray(post.replies) && post.replies.length) {
        //Remove only the image if the post has replies to replace with a placeholder
        post.imageUrl = null;
        post
            .save()
            .then(updatedPost => {
                updatedPost.populate("userId").execPopulate()
                    .then(populatedPost => {
                        return res.json(populatedPost);
                    });
            })
            .catch(() => res.sendStatus(500));
    } else {
        post
            .remove()
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500));
    }
};

exports.post_report = async (req, res) => {
    const postId = req.body.postId;
    const userId = req.decoded.id;

    const user = await User.findOne({ _id: userId });
    if (!user) {
        return res.sendStatus(404);
    }

    const indexOfPost = user.reportedPosts.findIndex(reportedPost => reportedPost.reportedPost == postId);
    if (indexOfPost != -1) {
        return res.sendStatus(405)
    }

    Post.findOneAndUpdate({ _id: postId }, { $inc: { reports: 1 } }, { new: true }, function (err, post) {
        if (err) {
            return res.sendStatus(400)
        }

        user.reportedPosts.push({ reportedPost: postId });
        user.save().catch(() => res.sendStatus(500));

        if (post.reports >= 20) {
            post.flagged = true
            post.save().then(updatedPost => res.json(updatedPost))
        }
        else {
            return res.sendStatus(200);
        }
    });
};

exports.post_react = async (req, res) => {
    const userId = req.decoded.id;
    const postId = req.body.postId;
    const reactionType = req.body.reactionType;

    const user = await User.findOne({ _id: userId });
    if (!user) {
        return res.sendStatus(404);
    }

    const post = await Post.findOne({ _id: postId });
    if (!post) {
        return res.sendStatus(404);
    }

    //Find if user has already liked the post
    const likedPosts = user.likedPosts;
    const indexOfPost = likedPosts.findIndex(likedPost => likedPost.postId == postId);

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
            postId: postId,
            reactionType: reactionType
        });
        post.reactions[reactionType]++;
    }

    user
        .save()
        .catch(() => res.sendStatus(500));;

    post
        .save()
        .then(updatedPost => {
            return res.json(updatedPost.reactions);
        })
        .catch(() => res.sendStatus(500));
};

exports.post_metrics = (req, res) => {
    const postId = req.query.post_id;

    Post.findOne({ _id: postId })
        .populate({ path: "totalReplies", match: { flagged: false } })
        .then(post => {
            if (!post) {
                return res.sendStatus(404);
            } else {
                return res.json({
                    totalReactions: post.totalReactions,
                    totalReplies: post.totalReplies
                });
            }
        });
};

exports.posts_latest_get = (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;

    Post.aggregate([
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
        }])
        .exec(function (err, posts) {
            if (err) return res.status(500);
            return res.json(posts[0]);
        });
};

exports.posts_popular_get = (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;

    Post.aggregate([
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
    ])
        .exec(function (err, posts) {
            if (err) return res.status(404);
            return res.json(posts[0]);
        });
};

exports.posts_user_latest_get = (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const userId = mongoose.Types.ObjectId(req.query.userId);

    Post.aggregate([
        { '$match': { 'userId': userId, 'flagged': false } },
        { '$sort': { 'createdAt': -1 } },
        {
            $facet: {
                metadata: [{ $count: "totalCount" }],
                results: [{ $skip: skippedPosts }, { $limit: 10 }]
            }
        }])
        .exec(function (err, posts) {
            if (err) return res.status(404);
            return res.json(posts[0]);
        });
};

exports.posts_user_popular_get = (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const userId = mongoose.Types.ObjectId(req.query.userId);

    Post.aggregate([
        { '$match': { 'userId': userId, 'flagged': false } },
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
            if (err) return res.status(404);
            return res.json(posts[0]);
        });
};

exports.posts_replies_latest_get = (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const postId = mongoose.Types.ObjectId(req.query.postId);

    Post.aggregate([
        { '$match': { 'replyTo': postId, 'flagged': false } },
        { '$sort': { 'createdAt': -1 } },
        {
            $facet: {
                metadata: [{ $count: "totalCount" }],
                results: [{ $skip: skippedPosts }, { $limit: 10 }]
            }
        }])
        .exec(function (err, posts) {
            if (err) return res.status(404);
            return res.json(posts[0]);
        });
};

exports.posts_replies_popular_get = (req, res) => {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const postId = mongoose.Types.ObjectId(req.query.postId);

    Post.aggregate([
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
        }])
        .exec(function (err, posts) {
            if (err) return res.status(404);
            return res.json(posts[0]);
        });
};

exports.post_reply_parents_get = async (req, res) => {
    const postId = req.query.post_id;

    const post = await Post.findOne({ _id: postId });
    if (!post) {
        return res.sendStatus(404);
    }

    let replyChain = [post];
    for (let depth = 0; depth < post.depth; depth++) {
        const parentPost = await Post.findOne({ _id: replyChain[0].replyTo});
        if (!parentPost) {
            return res.sendStatus(404);
        }
        replyChain.unshift(parentPost);
    }

    return res.json(replyChain);
}

exports.post_get = (req, res) => {
    const postId = req.params.postId;

    Post.findOne({ _id: postId }).populate("userId").populate("totalReplies").then(post => {
        if (!post) {
            return res.sendStatus(404);
        } else {
            const totalReplies = post.totalReplies;
            return res.json({ totalReplies, ...post.toJSON() });
        }
    })
        .catch(() => res.sendStatus(404));
};