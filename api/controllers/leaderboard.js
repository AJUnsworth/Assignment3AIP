const Post = require("../models/post");

const errors = require("../services/errors");

//Retrieves a specified amount (limit) of users sorted by the total number of reactions on their posts
//Ordered by users with the most to least amount of reactions, users with 0 reactions do not appear
exports.leaderboard_get = async (req, res) => {
    let limit = parseInt(req.query.limit) || 5;

    try {
        const leaderboardMembers = await Post.aggregate([
            {
                "$addFields": { "totalReactions": { "$sum": ["$reactions.like", "$reactions.wow", "$reactions.tears", "$reactions.laugh", "$reactions.love", "$reactions.angry"] } }
            }, {
                "$match": { "totalReactions": { "$gt": 0 } }
            }, {
                "$group": { "_id": "$user", "totalUserReactions": { "$sum": "$totalReactions" } }
            }, {
                "$sort": { "totalUserReactions": -1 }
            }, {
                "$lookup": { "from": "users", "localField": "_id", "foreignField": "_id", "as": "user" }
            }, {
                "$unwind": { "path": "$user" }
            }, {
                "$project": { "totalUserReactions": 1, "username": "$user.username" }
            }, { "$limit": limit }
        ]);

        return res.json(leaderboardMembers);
    } catch {
        return res.status(500).json({ error: errors.SERVER_ERROR });
    }
}