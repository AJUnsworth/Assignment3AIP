const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Subdocument containing post that a user has liked and the reaction type
const likedPostSchema = new Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    reactionType: {
        type: String
    }
});

//Subdocument containing post that a user has reported
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
        type: Date,
        default: Date.now
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

//Virtual populate for getting posts created by a user
userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "user"
});

const User = mongoose.model("User", userSchema);

module.exports = User;