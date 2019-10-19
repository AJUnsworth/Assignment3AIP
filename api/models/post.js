const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Subdocument containing reactions on a post
const reactionsSchema = new Schema({
    like: {
        type: Number,
        required: true,
        default: 0
    },
    laugh: {
        type: Number,
        required: true,
        default: 0
    },
    love: {
        type: Number,
        required: true,
        default: 0
    },
    wow: {
        type: Number,
        required: true,
        default: 0
    },
    tears: {
        type: Number,
        required: true,
        default: 0
    },
    angry: {
        type: Number,
        required: true,
        default: 0
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
    reactions: {
        type: reactionsSchema,
        default: reactionsSchema
    }
}, {
        timestamps: true,
});

//Virutal populate for getting all replies to a post
//Based on an example by Valeri Karpov
//See https://thecodebarbarian.com/mongoose-virtual-populate
postSchema.virtual("replies", {
    ref: "Post",
    localField: "_id",
    foreignField: "replyTo"
});

//Virtual populate for getting the count of replies on a post
postSchema.virtual("totalReplies", {
    ref: "Post",
    localField: "_id",
    foreignField: "replyTo",
    count: true
});

//Returns the total amount of reactions on a post
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