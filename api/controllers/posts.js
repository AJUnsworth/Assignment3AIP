const Post = require("../models/post");
const User = require("../models/user");

const mongoose = require("mongoose");
const { uploadImage, deleteImage } = require("../services/s3");
const checkImageAppropriateness = require("../services/cloud-vision");
const errors = require("../services/errors");

const singleUpload = uploadImage.single("image");

/* Allows user to upload a post, and is based off a tutorial from Medium.com that can no longer be located
* A similar tutorial can be seen here: https://medium.com/@paulrohan/file-upload-to-aws-s3-bucket-in-a-node-react-mongo-app-and-using-multer-72884322aada
* 
* Also checks if image is appropriate and flags the post if it contains sensitive content or text
*/
exports.post_create = (req, res) => {
    //Upload image to S3 bucket then create a new post if successful
    singleUpload(req, res, async err => {
        if (!req.file || req.file === undefined || err) {
            return res.status(400).json({ error: errors.CANNOT_UPLOAD_IMAGE });
        }

        const newPost = new Post({
            user: req.decoded.id,
            imageUrl: req.file.location
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

            //Check if file contains adult content, text or violence and returns true if found, or false if not
            const isFlagged = await checkImageAppropriateness(req.file.location);
            newPost.flagged = isFlagged;

            const post = await newPost.save();
            return res.json(post);
        } catch {
            return res.status(500).json({ error: errors.SERVER_ERROR });
        }
    });
};

//Deletes old post image and replaces it with a new image uploaded by a user
//Also checks appropriateness of new image and flags the post if inappropriate
exports.post_edit = async (req, res) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findOne({ _id: postId }).populate("replies");

        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });

        //User can only edit if there are no replies and reactions on post
        } else if (!post.replies.length && !post.totalReactions) { 

            //Upload new image to S3 bucket
            singleUpload(req, res, async err => {
                if (err) return res.status(500).json({ error: errors.SERVER_ERROR });

                const userId = req.decoded.id;

                //User should only be able to edit their posts
                if (post.user != userId) {
                    return res.status(403).json({ error: errors.INVALID_USER });
                }

                //Deletes original image if it is not a placeholder
                if (post.imageUrl) {
                    await deleteImage(post.imageUrl);
                }

                post.imageUrl = req.file.location;

                //Check if file contains adult content or violence and returns true if found, or false if not
                const isFlagged = await checkImageAppropriateness(req.file.location);
                post.flagged = isFlagged;

                const updatedPost = await post.save();

                //Return post with user field replaced with the referenced user object
                const populatedPost = await updatedPost.populate("user").execPopulate();
                return res.json(populatedPost);
            });
        } else {
            return res.status(409).json({ error: errors.CANNOT_EDIT_POST });
        }
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
}

//Deletes post, or if there are replies only deletes the image
exports.post_delete = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.decoded.id;

    try {
        const post = await Post.findOne({ _id: postId }).populate("replies");
        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });
        }

        //Only allow post creator to delete the post
        if (post.user != userId) {
            return res.status(403).json({ error: errors.INVALID_USER });
        }

        //Delete image if it is not a placeholder
        if (post.imageUrl) {
            await deleteImage(post.imageUrl);
        }

        //Remove only the image if the post has replies to replace with a placeholder
        if (Array.isArray(post.replies) && post.replies.length) {
            post.imageUrl = null;
            const updatedPost = await post.save();

            //Return post with user field replaced with the referenced user object
            const populatedPost = await updatedPost.populate("user").execPopulate();
            return res.json(populatedPost);
        } else {
            await post.remove();
            return res.sendStatus(204);
        }
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

//Allows user to report a post, post is flagged if there are 20 or more reports
exports.post_report = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.decoded.id;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: errors.USER_NOT_FOUND });
        }

        //Check if user has already reported the current post
        const indexOfPost = user.reportedPosts.findIndex(reportedPost => reportedPost.reportedPost == postId);
        if (indexOfPost != -1) {
            return res.status(409).json({ error: errors.POST_ALREADY_REPORTED });
        }

        //Finds post and increments reports by 1
        const post = await Post.findOneAndUpdate({ _id: postId }, { $inc: { reports: 1 } }, { new: true });
        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });
        }

        //Save that user has reported the post
        user.reportedPosts.push({ reportedPost: postId });
        await user.save();

        if (post.reports >= 20) {
            post.flagged = true
            const updatedPost = await post.save();
            return res.json(updatedPost);
        }
        else {
            return res.sendStatus(204);
        }
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

//Allows user to toggle reactions on a post
exports.post_react = async (req, res) => {
    const userId = req.decoded.id;
    const postId = req.params.postId;
    let reactionType = req.body.reactionType;

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

        //If user has not already liked post then they are creating a new reaction
        //Otherwise they are changing or removing their reaction
        if (indexOfPost == -1) {
            user.likedPosts.push({
                post: postId,
                reactionType: reactionType
            });
            post.reactions[reactionType]++;
        } else {
            const likedPost = likedPosts[indexOfPost];
            const originalReactionType = likedPost.reactionType;

            //Check if user is removing reaction, otherwise is selecting a new reaction
            if (originalReactionType === reactionType) {
                likedPosts.splice(likedPost);
                post.reactions[reactionType]--;

                //Remove selected reaction type
                reactionType = null;
            } else {
                likedPost.reactionType = reactionType;
                post.reactions[originalReactionType]--;
                post.reactions[reactionType]++;
            }
        }

        await user.save();

        const updatedPost = await post.save();
        return res.json({ 
            reactions: updatedPost.reactions,
            reactionType: reactionType
        });
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

//Gets comment count and reaction count for a post, does not include flagged posts in reply count
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

//Gets a specified amount of posts in order of newest to oldest
//Does not show flagged posts or replies
exports.posts_latest_get = async (req, res) => {
    const skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;

    try {
        const posts = await Post.aggregate([
            {
                "$match": {
                    "replyTo": { "$exists": false },
                    "flagged": false
                }
            }, {
                "$sort": { "createdAt": -1 }
            },

            {
                $facet: {
                    metadata: [{ $count: "totalCount" }],
                    results: [{ $skip: skippedPosts }, { $limit: limit }]
                }
            }]);

        return res.json(posts[0]);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
};

//Gets a specified amount of posts in order of most reactions to least
//Does not show flagged posts or replies
exports.posts_popular_get = async (req, res) => {
    const skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;

    try {
        const posts = await Post.aggregate([
            {
                "$match": { "replyTo": { "$exists": false }, "flagged": false }
            },
            {
                "$addFields": { "totalReactions": { "$sum": ["$reactions.like", "$reactions.wow", "$reactions.tears", "$reactions.laugh", "$reactions.love", "$reactions.angry"] } }
            },
            {
                "$sort": { "totalReactions": -1 }
            },
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

//Gets a specified amount of replies in order of newest to oldest
//Only shows replies to the specified post and does not show flagged posts
exports.posts_replies_latest_get = async (req, res) => {
    const skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;
    const postId = mongoose.Types.ObjectId(req.params.postId);

    try {
        const posts = await Post.aggregate([
            { "$match": { "replyTo": postId, "flagged": false } },
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

//Gets a specified amount of replies in order of most reactions to least
//Only shows replies to the specified post and does not show flagged posts
exports.posts_replies_popular_get = async (req, res) => {
    const skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;
    const postId = mongoose.Types.ObjectId(req.params.postId);

    try {
        const posts = await Post.aggregate([
            { "$match": { "replyTo": postId, "flagged": false } },
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

//Returns an array of parent posts, with the first post being the original one in the thread
exports.post_reply_parents_get = async (req, res) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ error: errors.POST_NOT_FOUND });
        }

        //Loops through parent posts and appends them to the beginning of the replyChain array 
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

//Returns a specified post with user and totalReplies fields populated
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