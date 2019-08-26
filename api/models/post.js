const Schema = mongoose.schema;

const postSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    }, 
    password: {
        type: String,
        required: true,
    }, 
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;