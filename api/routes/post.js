const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Post = require("../models/post");
const User = require("../models/user");

const authenticate = require("../services/authenticate");

const AdminController = require("../controllers/admin");
const PostsController = require("../controllers/posts");

/**
 * Allows user create a post/reply
 * Requires an authenticated token.
 * 
 * Path: post/create
 * 
 * Method: Post
 * 
 * Parameters: 
 *      image: Image file that the user wants to post
 *      replyTo: Post that serves as the reply parent (optional)
 * 
 * Response:
 *      200: Post/Reply uploaded successfully
 *      400: File not found
 *      404: Cannot find parent post for creating reply
 *      500: Issue while saving new post/reply
 */ 
router.post("/create", authenticate, PostsController.post_create);

/**
 * Allows user delete their own post/reply
 * Requires an authenticated token.
 * 
 * Path: post/delete
 * 
 * Method: Post
 * 
 * Parameters: 
 *      postId: ID of the current post
 * 
 * Response:
 *      200: Post/Reply deleted successfully
 *      403: User is not authorised to delete post
 *      404: Cannot find post
 *      500: Issue while deleting post
 */ 
router.post("/delete", authenticate, PostsController.post_delete);

/**
 * Allows an admin to approve a flagged post
 * Requires an authenticated token.
 * 
 * Path: post/approve
 * 
 * Method: Post
 * 
 * Parameters: 
 *      postId: ID of the current post
 * 
 * Response:
 *      200: Flagged post has been successfully approved
 *      403: User is not admin and unauthorised to approve post
 *      404: Cannot find post or user
 *      500: Issue while approving post
 */ 
router.post("/approve", authenticate, AdminController.post_approve);

/**
 * Allows user to report a post
 * Requires an authenticated token.
 * 
 * Path: post/report
 * 
 * Method: Post
 * 
 * Parameters: 
 *      postId: ID of the current post
 * 
 * Response:
 *      200: Post sucessfully reported
 *      400: Post not found
 *      404: Cannot find user
 *      405: Unable to report image that they have already reported
 *      500: Issue while approving post
 */ 
router.post("/report", authenticate, PostsController.post_report);

/**
 * Allows user edit their own post/reply
 * Requires an authenticated token.
 * 
 * Path: post/edit
 * 
 * Method: Post
 * 
 * Parameters: 
 *      postId: ID of the current post
 * 
 * Response:
 *      200: Post edited successfully
 *      403: User is not authorised to edit post
 *      404: Cannot find post
 *      405: Unable to edit post as it has replies/reactions
 *      500: Issue while editing post
 */ 
router.post("/edit", authenticate, PostsController.post_edit);

/**
 * Allows user to react, edit reaction or delete reaction on a post
 * Requires an authenticated token.
 * 
 * Path: post/react
 * 
 * Method: Post
 * 
 * Parameters: 
 *      postId: ID of the current post
 *      reactionType: type of reaction 
 * 
 * Response:
 *      200: Post reacted to sucesffully 
 *      404: Cannot find post or user
 *      500: Issue while reacting to post
 */ 
router.post("/react", authenticate, PostsController.post_react);

/**
 * Find and returns reactions and replies for a post
 * 
 * Path: post/metrics
 * 
 * Method: Get
 * 
 * Parameters: 
 *      postId: ID of the current post
 * 
 * Response:
 *      200: Returns posts reactions and replies
 *      404: Cannot find post
 */ 
router.get("/metrics", PostsController.post_metrics);

/**
 * Find and returns flagged posts
 * Requires an authenticated token.
 * 
 * Path: post/flagged
 * 
 * Method: Get
 * 
 * Response:
 *      200: Returns flagged posts
 *      404: Cannot find flagged posts
 */ 
router.get("/flagged", authenticate, AdminController.posts_flagged_get);

router.get("/reply/parents", PostsController.post_reply_parents_get);

//Rename this route
router.get("/getThumbnails", PostsController.posts_latest_get);

//Rename this route
router.get("/getPopular", PostsController.posts_popular_get);

//Rename this route
router.get("/getRecentUserPosts", PostsController.posts_user_latest_get);

//Rename this route
router.get("/getPopularUserPosts", PostsController.posts_user_popular_get);

//Rename this route
router.get("/repliesRecent", PostsController.posts_replies_latest_get);

//Rename this route
router.get("/repliesPopular", PostsController.posts_replies_popular_get);


/**
 * Gets detail of specified post
 * 
 * Path: post/:postId
 * 
 * Method: Get
 *
 * Response:
 *      200: Returns post details
 *      404: Post cannot be found
 */ 
router.get("/:postId", PostsController.post_get);

module.exports = router;