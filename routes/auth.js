import express from 'express';
import { check } from 'express-validator/check';
import { authController } from '../controllers/auth';
import { isAuth } from '../middleware/auth';

const Router = express.Router();

//@route    GET /auth/register
//@desc     Renders register page
//@access   Public
Router.get('/api/register', authController.getSignup);

//@route    GET /auth/login
//@desc     Authenticates user
//@access   Public
Router.get('/api/login', authController.getLogin);

//@route    GET /auth/reset
//@desc     Reset password
//@access   Public
Router.get('/api/reset', authController.getReset);

//@route    GET /auth/reset/:token
//@desc     Renders a page to set a new password
//@access   Public
Router.get('/api/reset/:token', authController.getNewPassword);

//@route    POST /auth/login
//@desc     Authenticates user
//@access   Public
Router.post(
	'/api/login',
	[
		check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
		check('password', 'Please enter the correct passwords')
			.isLength({ min: 5 })
			.not()
			.isEmpty()
			.withMessage('Password should be atleast 5 characters')
			.trim(),
	],
	authController.postLogin
);

//@route    POST /auth/logout
//@desc     Logs out
//@access   Private
Router.post('/api/logout', isAuth, authController.postLogout);

//@route    POST /auth/register
//@desc     Handles new register
//@access   Public
Router.post(
	'/api/register',
	[
		check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
		check('name', 'Please enter a valid email').not().isEmpty().trim(),
		check(
			'password',
			'Please enter a password with more than 5 characters composed of only numbers and letters'
		)
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim(),
		check('confirmPassword')
			.custom((value, { req }) => {
				User.findOne({ email: value }).then((user) => {
					if (user) {
						return Promise.reject(
							'Email already exists, pick a different one!'
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
Router.post('/reset', authController.postReset);

//@route    POST /auth/new-password
//@desc     Resets password
//@access   Public
Router.post('/new-password', authController.postNewPassword);

module.exports = Router;
