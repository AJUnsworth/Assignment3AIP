const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Post = require("../models/post");
const User = require("../models/user");

const authenticate = require("../services/authenticate");

const AdminController = require("../controllers/admin");
const PostsController = require("../controllers/posts");

router.post("/create", authenticate, PostsController.post_create);

router.post("/delete", authenticate, PostsController.post_delete);

router.post("/approve", authenticate, AdminController.post_approve);

router.post("/report", authenticate, PostsController.post_report);

router.post("/edit", authenticate, PostsController.post_edit);

router.post("/react", authenticate, PostsController.post_react);

router.get("/metrics", PostsController.post_metrics);

router.get("/flagged", authenticate, AdminController.posts_flagged_get);

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

router.get("/:postId", PostsController.post_get);

module.exports = router;