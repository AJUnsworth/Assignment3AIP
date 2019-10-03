const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.get("/", function (req, res) {
    let limit = parseInt(req.query.limit) || 5;
    Post.aggregate([
      {
        '$addFields': {'totalReaactions': {'$sum': ['$reactions.like', '$reactions.wow', '$reactions.tears', '$reactions.laugh', '$reactions.love', '$reactions.angry']}}
      }, {
        '$group': {'_id': '$userId', 'totalUserReactions': {'$sum': '$totalReaactions'}}
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


/* const members = [
    { name: "Andrew", rank: "#1" },
    { name: "Bela", rank: "#2" },
    { name: "Chloe", rank: "#3" },
    { name: "James", rank: "#4" },
    { name: "Josh", rank: "#5" },
    { name: "Andrew", rank: "#6" },
    { name: "Bela", rank: "#7" },
    { name: "Chloe", rank: "#8" },
    { name: "James", rank: "#9" },
    { name: "Josh", rank: "#10" },
    { name: "Josh", rank: "#11" },
    { name: "Andrew", rank: "#12" },
    { name: "Bela", rank: "#13" },
    { name: "Chloe", rank: "#14" },
    { name: "James", rank: "#15" },
    { name: "Josh", rank: "#16" },
    { name: "Josh", rank: "#17" },
    { name: "Andrew", rank: "#18" },
    { name: "Bela", rank: "#19" },
    { name: "Chloe", rank: "#20" }
];


router.get("/", function (req, res) {
    let start = req.query.start || 0;
    let limit = req.query.limit || 10;
    let topMembers = members.slice(start, limit); //for top limit
    res.json(topMembers);
});
*/
module.exports = router;
