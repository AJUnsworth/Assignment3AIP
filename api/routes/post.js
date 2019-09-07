const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const upload = require("../services/image-upload");
const Post = require("../models/post");

const singleUpload = upload.single("image");

router.post("/create", function(req, res) {
    //Upload image to S3 bucket then create a new post if successful
    singleUpload(req, res, function(err) {
        if (err) throw err;
        
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
            .catch(err => console.log(err));
    });
});

module.exports = router;