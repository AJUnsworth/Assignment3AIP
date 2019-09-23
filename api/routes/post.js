const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const upload = require("../services/image-upload");
const Post = require("../models/post");
const User = require("../models/user");

const singleUpload = upload.single("image");

router.post("/create", function (req, res, next) {
    //Upload image to S3 bucket then create a new post if successful
    singleUpload(req, res, function (err) {
        if (err) next(err);

        const newPost = new Post({
            userId: req.body.userId,
            imageUrl: req.file.location,
            likeReactions: 0,
            laughReactions: 0,
            loveReactions: 0,
            wowReactions: 0,
            tearsReactions: 0,
            angryReactions: 0
        });

        newPost
            .save()
            .then(post => res.json(post))
            .catch(err => {
                console.log(err);
                res.json(err);
            })
        }
    )
});

router.get("/getThumbnails", function (req, res) {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;

    Post.aggregate([{$sort: {
        createdAt: -1
        }},
        {$facet: {
            metadata: [{ $count: "totalCount" }],
            results: [ { $skip: skippedPosts }, { $limit: 10 } ]
        }}])
        .exec(function (err, posts) {
            if (err) return res.status(404);
            return res.json(posts[0]);
        });
    /*Post
        .find({})
        .skip(skippedPosts)
        .limit(10)
        .sort({ createdAt: -1 })
        .exec(function (err, posts) {
            if (err) return res.status(404);
            if (!posts) return res.status(404);
            return res.json(posts);
        });*/
});

router.post("/addReaction", function (req, res) {
    const userId = req.body.userId;
    const postId = req.body.postId;
    const reactionType = req.body.reactionType;

    User.findOne({ _id: userId }).then(user => {
        if (!user) {
            return res.status(404).send();
        } else {
            Post.findOne({ _id: postId }).then(post => {
                if (!post) {
                    return res.status(404).send();
                } else {
                    //For future refactor: Is really inneficient looping through the same array twice
                    //Check if the user has already reacted to the post and is simply changing their desired reaction
                    const likedPosts = user.likedPosts;
                    if (likedPosts.some(likedPost => likedPost.postId == postId)) {
                        for (let likedPost of likedPosts) {
                            if (postId == likedPost.postId) {
                                const originalReactionType = likedPost.reactionType;
                                likedPost.reactionType = reactionType;
                                post[originalReactionType + "Reactions"]--;
                                post[reactionType + "Reactions"]++;
                                break;
                            }
                        };
                    } else {
                        user.likedPosts.push({
                            postId: postId,
                            reactionType: reactionType
                        });
                        post[reactionType + "Reactions"]++;
                    }

                    user
                        .save()
                        .catch(err => console.log(err));;

                    post
                        .save()
                        .then(updatedPost => {
                            return res.json(updatedPost);
                        })
                        .catch(err => console.log(err));;
                }
            });
        }
    });
});

router.post("/removeReaction", function (req, res) {
    const userId = req.body.userId;
    const postId = req.body.postId;
    const reactionType = req.body.reactionType;

    User.findOne({ _id: userId }).then(user => {
        if (!user) {
            return res.status(404).send();
        } else {
            Post.findOne({ _id: postId }).then(post => {
                if (!post) {
                    return res.status(404).send();
                } else {
                    const likedPosts = user.likedPosts;
                    for (let likedPost of likedPosts) {
                        if (postId == likedPost.postId) {
                            likedPosts.splice(likedPosts.indexOf(likedPost));
                            post[reactionType + "Reactions"]--;
                            break;
                        }
                    };

                    user
                        .save()
                        .catch(err => console.log(err));;

                    post
                        .save()
                        .then(updatedPost => {
                            return res.json(updatedPost);
                        })
                        .catch(err => console.log(err));;
                }
            });
        }
    });
});

router.get("/getReactionCount", function (req, res) {
    const postId = req.query.post_id;

    Post.findOne({ _id: postId }).then(post => {
        if (!post) {
            return res.status(404).send();
        } else {
            const count =
                post.likeReactions
                + post.laughReactions
                + post.loveReactions
                + post.wowReactions
                + post.tearsReactions
                + post.angryReactions;

            return res.json({ reactions: count });
        }
    });
});

router.get("/:postId", function (req, res) {
    const postId = req.params.postId;
 
    Post.findOne({ _id: postId}).then(post => {
            if (!post) {
               return res.status(404).send();
            } else {
                return res.json(post);
            }
        });
});

module.exports = router;