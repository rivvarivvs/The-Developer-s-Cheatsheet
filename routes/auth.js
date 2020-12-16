const express = require("express");
const Router = express.Router();
const isAuth = require("../middleware/auth");

//Auth controllers
const authController = require("../controllers/auth");

//@route    GET /auth/register
//@desc     Renders register page
//@access   Public
Router.get("/register", authController.getSignup);

//@route    GET /auth/login
//@desc     Authenticates user
//@access   Public
Router.get("/login", authController.getLogin);

//@route    POST /auth/login
//@desc     Authenticates user
//@access   Public
Router.post("/login", authController.postLogin);

//@route    POST /auth/logout
//@desc     Logs out
//@access   Private
Router.get("/logout", isAuth, authController.postLogout);

//@route    POST /auth/register
//@desc     Handles new register
//@access   Public
Router.get("/register", authController.postSignup);

module.exports = Router;
