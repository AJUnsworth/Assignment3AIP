const express = require("express");
const router = express.Router();

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

router.get("/latest", PostsController.posts_latest_get);

router.get("/popular", PostsController.posts_popular_get);

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
router.post("/:postId/edit", authenticate, PostsController.post_edit);

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
router.post("/:postId/delete", authenticate, PostsController.post_delete);

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
router.get("/:postId/metrics", PostsController.post_metrics);

router.get("/:postId/parents", PostsController.post_reply_parents_get);

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
router.post("/:postId/react", authenticate, PostsController.post_react);

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
router.post("/:postId/report", authenticate, PostsController.post_report);

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
router.post("/:postId/approve", authenticate, AdminController.post_approve);

router.get("/:postId/latest", PostsController.posts_replies_latest_get);

router.get("/:postId/popular", PostsController.posts_replies_popular_get);

module.exports = router;