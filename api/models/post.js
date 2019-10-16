const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionsSchema = new Schema({
    like: {
        type: Number,
        required: true,
    },
    laugh: {
        type: Number,
        required: true,
    },
    love: {
        type: Number,
        required: true,
    },
    wow: {
        type: Number,
        required: true,
    },
    tears: {
        type: Number,
        required: true,
    },
    angry: {
        type: Number,
        required: true,
    }
});

const postSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    depth: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String
    },
    reports: {
        type: Number,
        default: 0
    },
    flagged: {
        type: Boolean,
        default: false
    },
    reactions: reactionsSchema
}, {
        timestamps: true,
});

//Allows for population without writing to MongoDB
//Based on an example by Valeri Karpov
//See https://thecodebarbarian.com/mongoose-virtual-populate
postSchema.virtual("replies", {
    ref: "Post",
    localField: "_id",
    foreignField: "replyTo"
});

postSchema.virtual("totalReplies", {
    ref: "Post",
    localField: "_id",
    foreignField: "replyTo",
    count: true
});

postSchema.virtual("totalReactions").get(function () {
    return this.reactions.like 
        + this.reactions.laugh 
        + this.reactions.love 
        + this.reactions.wow 
        + this.reactions.tears 
        + this.reactions.angry;
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;