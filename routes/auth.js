const express = require("express");
const Router = express.Router();
const { check } = require("express-validator/check");

//User model
const UserModel = require("../models/User");

//Auth controllers and middleware
const authController = require("../controllers/auth");
const isAuth = require("../middleware/auth");

//@route    GET /auth/register
//@desc     Renders register page
//@access   Public
Router.get("/register", authController.getSignup);

//@route    GET /auth/login
//@desc     Authenticates user
//@access   Public
Router.get("/login", authController.getLogin);

//@route    GET /auth/reset
//@desc     Reset password
//@access   Public
Router.get("/reset", authController.getReset);

//@route    GET /auth/reset/:token
//@desc     Renders a page to set a new password
//@access   Public
Router.get("/reset/:token", authController.getNewPassword);

//@route    POST /auth/login
//@desc     Authenticates user
//@access   Public
Router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail().normalizeEmail(),
    check(
      "password",
      "Please enter the correct passwords"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .isEmpty()
      .trim(),
  ],
  authController.postLogin
);

//@route    POST /auth/logout
//@desc     Logs out
//@access   Private
Router.post("/logout", isAuth, authController.postLogout);

//@route    POST /auth/register
//@desc     Handles new register
//@access   Public
Router.post(
  //TO DO NAME FIELD VALIDATION
  "/register",
  [
    check("email", "Please enter a valid email").isEmail().normalizeEmail(),
    check(
      "password",
      "Please enter a password with more than 5 characters composed of only numbers and letters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    check("confirmPassword")
      .custom((value, { req }) => {
        User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "Email already exists, pick a different one!"
            );
          }
        });
      })
      .trim(),
  ],
  authController.postSignup
);

//@route    POST /auth/reset
//@desc     Sends token for password reset
//@access   Public
Router.post("/reset", authController.postReset);

//@route    POST /auth/new-password
//@desc     Resets +asswprd
//@access   Public
Router.post("/new-password", authController.postNewPassword);

module.exports = Router;
