const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likedPostSchema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    reactionType: {
        type: String
    }
});

const reportedPostSchema = new Schema({
    reportedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
})

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    lastIpAddress: {
        type: String
    },
    lastLoggedIn: {
        type: Date
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    reportedPosts: [reportedPostSchema],
    likedPosts: [likedPostSchema],
}, {
    timestamps: true
});

userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "userId"
});

const User = mongoose.model("User", userSchema);

module.exports = User;