const Post = require("../models/post");

exports.leaderboard_get = (req, res) => {
    let limit = parseInt(req.query.limit) || 5;
    Post.aggregate([
      {
        '$addFields': {'totalReactions': {'$sum': ['$reactions.like', '$reactions.wow', '$reactions.tears', '$reactions.laugh', '$reactions.love', '$reactions.angry']}}
      }, {
        '$match': {'totalReactions': {'$gt': 0}}
      }, {
        '$group': {'_id': '$userId', 'totalUserReactions': {'$sum': '$totalReactions'}}
      }, {'$sort': {'totalUserReactions': -1}
      }, {'$lookup': {'from': 'users', 'localField': '_id', 'foreignField': '_id', 'as': 'user'}
      }, {'$unwind': {'path': '$user'}
      }, {'$project': {'totalUserReactions': 1, 'username': '$user.username'}
      },{'$limit': parseInt(limit)}
    ])
    
        .exec(function (err, members) {
            if (err) return res.status(404);
            return res.json(members);
        });
}