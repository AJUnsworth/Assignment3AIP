const express = require("express");
const router = express.Router();

const authenticate = require("../services/authenticate");

const AdminController = require("../controllers/admin");
const PostsController = require("../controllers/posts");

/**
 * Allows user create a post/reply
 * Requires an authenticated token.
 * 
 * Path: posts/create
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
 * Path: posts/flagged
 * 
 * Method: Get
 * 
 * Parameters:
 *      skippedPosts: Number of posts skipped
 *      limit: Number of posts to get
 * 
 * Response:
 *      200: Returns flagged posts
 *      404: Cannot find flagged posts
 */ 
router.get("/flagged", authenticate, AdminController.posts_flagged_get);

/**
 * Gets posts sorted by most recent createdAt date 
 * 
 * Path: posts/latest
 * 
 * Method: Get
 * 
 * Parameters: 
 *      skippedPosts: Number of posts skipped
 *      limit: Number of posts to get
 * 
 * Response:
 *      200: Returns posts sorted by most recent createdAt date
 *      500: Issue while getting posts
 */ 
router.get("/latest", PostsController.posts_latest_get);

/**
 * Gets posts sorted by most rections
 * 
 * Path: posts/popular
 * 
 * Method: Get
 * 
 * Parameters: 
 *      skippedPosts: Number of posts skipped
 *      limit: Number of posts to get
 * 
 * Response:
 *      200: Returns posts sorted by most reactions 
 *      500: Issue while getting posts
 */ 
router.get("/popular", PostsController.posts_popular_get);

/**
 * Gets detail of specified post
 * 
 * Path: posts/:postId
 * 
 * Method: Get
 * 
 * Parameters:
 *      postId: Id of the specified post
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
 * Path: posts/edit
 * 
 * Method: Put
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
router.put("/:postId/edit", authenticate, PostsController.post_edit);

/**
 * Allows user delete their own post/reply, only deletes image if there are replies to the post
 * Requires an authenticated token.
 * 
 * Path: posts/delete
 * 
 * Method: Delete
 * 
 * Parameters: 
 *      postId: Id of the current post
 * 
 * Response:
 *      200: Post/Reply deleted successfully
 *      403: User is not authorised to delete post
 *      404: Cannot find post
 *      500: Issue while deleting post
 */ 
router.delete("/:postId/delete", authenticate, PostsController.post_delete);

/**
 * Gets and returns reactions and replies for a post
 * 
 * Path: posts/metrics
 * 
 * Method: Get
 * 
 * Parameters: 
 *      postId: Id of the current post
 * 
 * Response:
 *      200: Returns posts reactions and replies
 *      404: Cannot find post
 */ 
router.get("/:postId/metrics", PostsController.post_metrics);

/**
 * Gets and returns parent posts of a requested reply post
 * 
 * Path: posts/:postId/parents
 * 
 * Method: Get
 * 
 * Parameters: 
 *      postId: Id of the requested reply parents
 * 
 * Response:
 *      200: Returns parent posts of the requested post
 *      404: Requested post not found OR Requested post is not a reply
 *      500: Issue while getting parent posts
 */ 
router.get("/:postId/parents", PostsController.post_reply_parents_get);

/**
 * Allows user to react, edit reaction or delete reaction on a post
 * Requires an authenticated token.
 * 
 * Path: posts/react
 * 
 * Method: Put
 * 
 * Parameters: 
 *      postId: Id of the current post
 *      reactionType: Type of reaction 
 * 
 * Response:
 *      200: Post reacted to successfully 
 *      404: Cannot find post or user
 *      500: Issue while reacting to post
 */ 
router.put("/:postId/react", authenticate, PostsController.post_react);

/**
 * Allows user to report a post
 * Requires an authenticated token.
 * 
 * Path: posts/report
 * 
 * Method: Put
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
router.put("/:postId/report", authenticate, PostsController.post_report);

/**
 * Allows an admin to approve a flagged post
 * Requires an authenticated token.
 * 
 * Path: posts/approve
 * 
 * Method: Put
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
router.put("/:postId/approve", authenticate, AdminController.post_approve);

/**
 * Gets replies sorted by most recent createdAt date
 * 
 * Path: posts/:postId/latest
 * 
 * Method: Get
 * 
 * Parameters: 
 *      postId: Id of requested post
 *      skippedPosts: Number of posts skipped
 *      limit: Number of posts to get
 * 
 * Response:
 *      200: Returns replies sorted by most recent createdAt date 
 *      500: Issue while getting replies
 */ 
router.get("/:postId/latest", PostsController.posts_replies_latest_get);

/**
 * Gets replies sorted by most reactions
 * 
 * Path: posts/:postId/popular
 * 
 * Method: Get
 * 
 * Parameters: 
 *      postId: Id of requested post
 *      skippedPosts: Number of posts skipped
 *      limit: Number of posts to get
 * 
 * Response:
 *      200: Returns replies sorted by most reactions
 *      500: Issue while getting posts
 */ 
router.get("/:postId/popular", PostsController.posts_replies_popular_get);

module.exports = router;