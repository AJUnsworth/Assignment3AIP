const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");

const upload = require("../services/image-upload");
const Post = require("../models/post");
const User = require("../models/user");

const singleUpload = upload.single("image");

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
        if(req.body.replyTo) {
            newPost.replyTo = req.body.replyTo;
        }

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

router.post("/delete", async (req, res, next) => {
    const postId = req.body.postId;
    const userId = req.body.userId;

    Post.findOne({_id: postId}).populate("replies").then(post => {
        if (!post) {
            return res.sendStatus(404);
        } else {
            //User should only be able to delete their posts
            if (post.userId != userId) {
                return res.sendStatus(403);
            }
            const s3 = new aws.S3();
            const key = post.imageUrl.split(".com/")[1];
            
            const params = {
                Bucket: process.env.S3_BUCKET,
                Key: key
            };

            //Delete image to save space in S3 Bucket, then remove the actual image
            s3.deleteObject(params, function (err, data) {
                if (err) {
                    return res.sendStatus(500);
                }

                if (Array.isArray(post.replies) && post.replies.length) {
                    //Remove only the image if the post has replies to replace with a placeholder
                    post.imageUrl = null;
                    post.save();
                } else {
                    post.remove(err => {
                        if(err) {
                            return res.sendStatus(500);
                        }
                    });
                }

                return res.sendStatus(200);
            });
        }
    });
});

router.get("/getThumbnails", function (req, res) {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;

    Post.aggregate([{
        $sort: {
            createdAt: -1
        }
    },
    {
        $facet: {
            metadata: [{ $count: "totalCount" }],
            results: [{
                '$match': {
                  'imageUrl': {
                    '$ne': null
                  }, 
                  'replyTo': {
                    '$exists': false
                  }
                }
              }, { $skip: skippedPosts }, { $limit: 10 }]
        }
    }])
        .exec(function (err, posts) {
            if (err) return res.status(404);
            return res.json(posts[0]);
        });

});

router.get("/getPopular"), function (req, res) {
    let skippedPosts = parseInt(req.query.skippedPosts, 10) || 0;

    Post.aggregate([
        {
            $addFields: {
                'totalReactions': {$sum: [$likeReactions, $wowReactions, $tearsReactions, $laughReactions, $loveReactions, $angryReactions ]
                }
            }
        }, 
        {
            $sort: {'totalReactions': -1 }
        }, 
        {
            $skip: skippedPosts
        }, 
        {
            $limit: 10
        }
    ])

        .exec(function (err, posts) {
            if (err) return res.status(404);
            return res.json(posts[0]);
        });
}

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
                    if(indexOfPost != -1) {
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
                        .catch(err => console.log(err));;

                    post
                        .save()
                        .then(updatedPost => {
                            return res.json(updatedPost.reactions);
                        })
                        .catch(err => console.log(err));;
                }
            });
        }
    });
});

router.get("/replies", function (req, res) {
    const postId = req.query.post_id;

    Post.findOne({ _id: postId }).populate("replies").then(post => {
        if(!post) {
            return res.sendStatus(404);
        } else {
            return res.json(post.replies);
        }
    })
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
                    if(indexOfPost != -1) {
                        //Removing likedPost from user
                        likedPosts.splice(likedPosts[indexOfPost]);
                        post.reactions[reactionType]--;
                    }
                    user
                        .save()
                        .catch(err => console.log(err));;

                    post
                        .save()
                        .then(updatedPost => {
                            return res.json(updatedPost.reactions);
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
            return res.sendStatus(404);
        } else {
            return res.json(post.totalReactions);
        }
    });
});

router.get("/:postId", function (req, res) {
    const postId = req.params.postId;
 
    Post.findOne({ _id: postId}).then(post => {
            if (!post) {
               return res.sendStatus(404);
            } else {
                return res.json(post);
            }
        });
});

module.exports = router;