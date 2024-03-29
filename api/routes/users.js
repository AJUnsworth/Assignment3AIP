const express = require("express");
const router = express.Router();

const authenticate = require("../services/authenticate");

const AdminController = require("../controllers/admin");
const LeaderboardController = require("../controllers/leaderboard");
const UsersController = require("../controllers/users");

/**
 * Allows user to create an account
 * 
 * Path: users/register
 * 
 * Method: Post
 * 
 * Parameters: 
 *      username: New account name
 *      email: Users email address
 *      password: Password of the user
 *      passwordConf: Password confirmation field
 * 
 * Response:
 *      200: Account created successfully 
 *      400: Validation errors
 *      409: Potential sock puppet detected
 *      500: Issue while saving new user
 */ 
router.post("/register", UsersController.user_create);

/**
 * Allows user to log into their account, updates lastLoggedIn and lastIPAddress of account
 * 
 * Path: users/login
 * 
 * Method: Put
 * 
 * Parameters: 
 *      username: Username of the user
 *      password: Password of the user
 * 
 * Response:
 *      200: Returns authenticated token and users details
 *      400: Validation errors
 */ 
router.put("/login", UsersController.user_login);

/**
 * Allows user to log out of their account by removing their token
 * 
 * Path: users/logout
 * 
 * Method: Get
 * 
 * Response:
 *      200: Deletes token
 */ 
router.get("/logout", UsersController.user_logout);

/**
 * Checks if admin is a user. Requires an authenticated token.
 * 
 * Path: users/checkAdmin
 * 
 * Method: Get
 * 
 * Response:
 *      200: User is admin
 *      401: User has invalid/no token
 */ 
router.get("/checkAdmin", authenticate, AdminController.admin_check);


/**
 * Checks if a current user is logged in. Decodes token to user data.
 * Requires an authenticated token.
 * 
 * Path: users/current
 * 
 * Method: Get
 * 
 * Response:
 *      200: Returns decoded token as user details
 *      401: User has invalid/no token
 */ 
router.get("/current", authenticate, UsersController.user_get_current);

/**
 * Returns top users based on number of reactions
 * 
 * Path: users/leaderboard
 * 
 * Method: Get
 * 
 * Parameters:
 *      limit: Maximum number of users to show on the leaderboard
 *
 * Response:
 *      200: Returns array of top user details
 *      404: Users not found
 */ 
router.get("/leaderboard", LeaderboardController.leaderboard_get);

/**
 * Gets detail of specified user
 * 
 * Path: user/:userId
 * 
 * Method: Get
 * 
 * Parameters:
 *      userId: Id of the specified user
 *
 * Response:
 *      200: Returns user details
 *      404: User cannot be found
 */ 
router.get("/:userId", UsersController.user_get);

/**
 * Checks and returns if user has reacted to a post
 * Requires an authenticated token.
 * 
 * Path: users/reaction
 * 
 * Method: Get
 * 
 * Parameters:
 *      userId: Id of the current user
 *      postId: Id of the current post
 * 
 * Response:
 *      200: Returns reaction type
 *      401: User has invalid/no token
 *      404: User cannot be found
 */ 
router.get("/:userId/reaction", authenticate, UsersController.user_reaction_get);

/**
 * Gets users posts sorted by most recent created date 
 * 
 * Path: users/:userId/posts/latest
 * 
 * Method: Get
 * 
 * Parameters: 
 *      userId: Id of specific user
 *      skippedPosts: Number of posts skipped
 *      limit: Number of posts to get
 * 
 * Response:
 *      200: Returns users posts sorted by most recent created date 
 *      500: Issue while getting posts
 */ 
router.get("/:userId/posts/latest", UsersController.user_latest_get);

/**
 * Gets user posts sorted by most reaction count 
 * 
 * Path: users/:userId/posts/popular
 * 
 * Method: Get
 * 
 * Parameters: 
 *      userId: Id of specific user
 *      skippedPosts: Number of posts skipped
 *      limit: Number of posts to get
 * 
 * Response:
 *      200: Returns users posts sorted by most reaction count
 *      500: Issue while getting posts
 */ 
router.get("/:userId/posts/popular", UsersController.user_popular_get);

module.exports = router;