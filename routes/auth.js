const express = require('express');
const { body } = require('express-validator');

const signin = require('../controllers/signin');
const signout = require('../controllers/signout');
const signup = require('../controllers/signup');
const requireAuth = require('../middleware/require-auth');

const router = express.Router();

//@route    POST /api/signin
//@desc     Authenticates user
//@access   Public
router.post(
	'/api/signin',
	[
		body('email')
			.isEmail()
			.normalizeEmail()
			.withMessage('Please enter a valid email'),
		body('password')
			.isLength({ min: 5 })
			.notEmpty()
			.withMessage('Password should be atleast 5 characters')
			.trim(),
	],
	signin.signin
);

//@route    POST /api/signout
//@desc     Logs out
//@access   Private
router.post('/api/signout', requireAuth.requireAuth, signout.signout);

//@route    POST /api/signup
//@desc     Handles new register
//@access   Public
router.post(
	'/api/signup',
	[
		body('email')
			.isEmail()
			.normalizeEmail()
			.withMessage('Please enter a valid email'),
		body('name').notEmpty().trim().withMessage('Please enter a valid email'),
		body('password')
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim()
			.withMessage(
				'Please enter a password with more than 5 characters composed of only numbers and letters'
			),
		body('confirmPassword')
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim()
			.withMessage(
				'Please enter a password with more than 5 characters composed of only numbers and letters'
			),
	],
	signup.signup
);

module.exports = router;
