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

router.post("/react", function(req, res) {
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
                            if(postId == likedPost.postId) {
                                const originalReactionType = likedPost.reactionType;
                                likedPost.reactionType = reactionType;
                                post[originalReactionType + "Reactions"]--;
                                post[reactionType + "Reactions"]++;
                                break;
                            }
                        };
                        //WIP: Determine what to return when saving changes to schemas and then refactor accordingly
                        user
                            .save()
                            .catch(err => console.log(err));;
                        post
                            .save()
                            .catch(err => console.log(err));;
                    } else {
                        user.likedPosts.push({ 
                            postId: postId,
                            reactionType: reactionType
                        });
                        user
                            .save()
                            .then(console.log("user updated"))
                            .catch(err => console.log(err));
                        
                        post[reactionType + "Reactions"]++;
                        post
                            .save()
                            .then(console.log("reaction incremented"))
                            .catch(err => console.log(err));
                    }
                }
            });
        }
    });
});

module.exports = router;