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
    likedPosts: [likedPostSchema],
}, {
        timestamps: true,
    });

const User = mongoose.model("User", userSchema);

module.exports = User;