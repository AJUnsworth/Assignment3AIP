const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    imageUrl: {
        type: String,
        unique: true,
        required: true,
    },
    likeReactions: {
        type: Number,
        required: true,
    },
    laughReactions: {
        type: Number,
        required: true,
    },
    loveReactions: {
        type: Number,
        required: true,
    },
    wowReactions: {
        type: Number,
        required: true,
    },
    tearsReactions: {
        type: Number,
        required: true,
    },
    angryReactions: {
        type: Number,
        required: true,
    }
}, {
        timestamps: true,
});

//Allows for population without writing to MongoDB
postSchema.virtual("replies", {
    ref: "Post",
    localField: "_id",
    foreignField: "replyTo"
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;