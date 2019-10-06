const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.get("/", function (req, res) {
    let limit = parseInt(req.query.limit) || 5;
    Post.aggregate([
      {
        '$addFields': {'totalReactions': {'$sum': ['$reactions.like', '$reactions.wow', '$reactions.tears', '$reactions.laugh', '$reactions.love', '$reactions.angry']}}
      }, {
        '$group': {'_id': '$userId', 'totalUserReactions': {'$sum': '$totalReactions'}}
      }, {'$sort': {'totalUserReactions': -1}
      },  {'$lookup': {'from': 'users', 'localField': '_id', 'foreignField': '_id', 'as': 'users'}
      }, {'$unwind': {'path': '$users'}
      }, {'$project': {'totalUserReactions': 1, 'users': {'username': 1}}
      },{'$limit': parseInt(limit)}
    ])
    
        .exec(function (err, members) {
            if (err) return res.status(404);
            return res.json(members);
        });
});


module.exports = router;
