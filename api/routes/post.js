const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const mongoose = require('mongoose');

const { uploadImage, deleteImage } = require("../services/image-upload");
const checkImageAppropriateness = require("../services/cloud-vision");
const Post = require("../models/post");
const User = require("../models/user");

const singleUpload = uploadImage.single("image");

//The create route is based off a tutorial from Medium.com that can no longer be located
//A similar tutorial can be seen here: https://medium.com/@paulrohan/file-upload-to-aws-s3-bucket-in-a-node-react-mongo-app-and-using-multer-72884322aada
router.post("/create", function (req, res, next) {
    //Upload image to S3 bucket then create a new post if successful
    singleUpload(req, res, function (err) {
        if (err) next(err);

        const newPost = new Post({
            userId: req.body.userId,
            imageUrl: req.file.location,
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
        });
    });
});

router.post("/delete", async function (req, res) {
    const postId = req.body.postId;
    const userId = req.body.userId;

    const post = await Post.findOne({ _id: postId }).populate("replies");
    if (!post) {
        return res.sendStatus(404);
    } else {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.sendStatus(404);
        }

        if (post.userId != userId || !user.isAdmin) {
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
                .then(updatedPost => res.json(updatedPost))
                .catch(() => res.sendStatus(500));
        } else {
            post
                .remove()
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(500));
        }
    }
});

router.post("/approve", async function (req, res) {
    const postId = req.body.postId;
    const userId = req.body.userId;

    const post = await Post.findOne({ _id: postId });
    if (!post) {
        return res.sendStatus(404);
    } else {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.sendStatus(404);
        }

        if (!user.isAdmin) {
            return res.sendStatus(403);
        }
        post.flagged = false;
        post
            .save()
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500));
    }
});

router.post("/edit", function (req, res, next) {
    //Fix later by implementing with Multer
    singleUpload(req, res, function (err) {
        const postId = req.body.postId;
        const userId = req.body.userId;

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
                        .then(updatedPost => res.json(updatedPost))
                        .catch(() => res.sendStatus(500));
                });
            } else {
                return res.sendStatus(405);
            }
        });
    });
});

router.get("/getThumbnails", function (req, res) {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;

    Post.aggregate([
        {
            '$match': {
                'imageUrl': { '$ne': null },
                'replyTo': { '$exists': false }
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

});

router.get("/getPopular", function (req, res) {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;

    Post.aggregate([
        {
            '$match': { 'imageUrl': { '$ne': null }, 'replyTo': { '$exists': false } }
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
});

router.get("/getRecentUserPosts", function (req, res) {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const userId =  mongoose.Types.ObjectId(req.query.userId);
    
    Post.aggregate([  
        {'$match': { 'userId': userId,  'imageUrl': { '$ne': null }}},
        {'$sort': { 'createdAt': -1 }},
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
});

router.get("/getPopularUserPosts", function (req, res) {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const userId =  mongoose.Types.ObjectId(req.query.userId);
    
    Post.aggregate([  
        {'$match': { 'userId': userId,  'imageUrl': { '$ne': null }}},
        {
            '$addFields': { 'totalReactions': { '$sum': ['$reactions.like', '$reactions.wow', '$reactions.tears', '$reactions.laugh', '$reactions.love', '$reactions.angry'] } }
        },
        {'$sort': { 'totalReactions': -1 }},
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
});

router.post("/addReaction", function (req, res) {
    const userId = req.body.userId;
    const postId = req.body.postId;
    const reactionType = req.body.reactionType;

    User.findOne({ _id: userId }).then(user => {
        if (!user) {
            return res.sendStatus(404);
        } else {
            Post.findOne({ _id: postId }).then(post => {
                if (!post) {
                    return res.sendStatus(404);
                } else {
                    const likedPosts = user.likedPosts;
                    const indexOfPost = likedPosts.findIndex(likedPost => likedPost.postId == postId);
                    if (indexOfPost != -1) {
                        //Swap reactionType if user is changing to a different reaction
                        const likedPost = likedPosts[indexOfPost];
                        const originalReactionType = likedPost.reactionType;
                        likedPost.reactionType = reactionType;

                        post.reactions[originalReactionType]--;
                        post.reactions[reactionType]++;
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
                        .catch(() => res.sendStatus(500));;
                }
            });
        }
    });
});

router.get("/repliesRecent", function (req, res) {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const postId =  mongoose.Types.ObjectId(req.query.postId);
    
    Post.aggregate([  
        {'$match': { 'replyTo': postId}},
        {'$sort': { 'createdAt': -1 }},
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
});

router.get("/repliesPopular", function (req, res) {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const postId =  mongoose.Types.ObjectId(req.query.postId);
    
    Post.aggregate([  
        {'$match': { 'replyTo': postId}},
        {'$addFields': { 'totalReactions': { '$sum': ['$reactions.like', '$reactions.wow', '$reactions.tears', '$reactions.laugh', '$reactions.love', '$reactions.angry'] } }
        },
        {'$sort': { 'totalReactions': -1 }},
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
});
    

router.post("/removeReaction", function (req, res) {
    const userId = req.body.userId;
    const postId = req.body.postId;
    const reactionType = req.body.reactionType;

    User.findOne({ _id: userId }).then(user => {
        if (!user) {
            return res.sendStatus(404);
        } else {
            Post.findOne({ _id: postId }).then(post => {
                if (!post) {
                    return res.sendStatus(404);
                } else {
                    const likedPosts = user.likedPosts;
                    const indexOfPost = likedPosts.findIndex(likedPost => likedPost.postId == postId);
                    if (indexOfPost != -1) {
                        //Removing likedPost from user
                        likedPosts.splice(likedPosts[indexOfPost]);
                        post.reactions[reactionType]--;
                    }
                    user
                        .save()
                        .catch(() => res.sendStatus(500));

                    post
                        .save()
                        .then(updatedPost => {
                            return res.json(updatedPost.reactions);
                        })
                        .catch(() => res.sendStatus(500));
                }
            });
        }
    });
});

router.get("/metrics", function (req, res) {
    const postId = req.query.post_id;

    Post.findOne({ _id: postId }).populate("totalReplies").then(post => {
        if (!post) {
            return res.sendStatus(404);
        } else {
            return res.json({
                totalReactions: post.totalReactions,
                totalReplies: post.totalReplies
            });
        }
    });
});

router.get("/getRepliesCount", function (req, res) {
    const postId = req.query.post_id;

    Post.findOne({ _id: postId }).populate("repliesCount").then(post => {
        if (!post) {
            return res.sendStatus(404);
        } else {
            return res.json(post.repliesCount);
        }
    });
});

router.get("/:postId", function (req, res) {
    const postId = req.params.postId;

    Post.findOne({ _id: postId }).populate("userId").then(post => {
        if (!post) {
            return res.sendStatus(404);
        } else {
            return res.json(post);
        }
    });
});

module.exports = router;