import express from 'express';
import { check } from 'express-validator/check';
import { signin } from '../controllers/signin';
import { signout } from '../controllers/signout';
import { signup } from '../controllers/signup';
import { requireAuth } from '../middleware/require-auth';

const Router = express.Router();

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
	signin
);

//@route    POST /auth/logout
//@desc     Logs out
//@access   Private
Router.post('/api/logout', requireAuth, logout);

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
	signup
);

module.exports = Router;
