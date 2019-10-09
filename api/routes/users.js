const express = require("express");
const router = express.Router();

const authenticate = require("../services/authenticate");

const AdminController = require("../controllers/admin");
const LeaderboardController = require("../controllers/leaderboard");
const UsersController = require("../controllers/users");

router.post("/register", UsersController.user_create);

router.post("/login", UsersController.user_login);

router.post("/logout", UsersController.user_logout);

router.get("/checkToken", authenticate, UsersController.user_check_token);

router.get("/checkAdmin", authenticate, AdminController.admin_check);

router.get("/getCurrentUser", authenticate, UsersController.user_get_current);

router.get("/getPostReaction", authenticate, UsersController.user_reaction_get);

router.get("/leaderboard", LeaderboardController.leaderboard_get);

router.get("/:userId", UsersController.user_get);

module.exports = router;