import express from 'express';
import { check } from 'express-validator/check';
import { signin } from '../controllers/signin';
import { signout } from '../controllers/signout';
import { signup } from '../controllers/signup';
import { requireAuth } from '../middleware/require-auth';

const router = express.Router();

//@route    POST /api/signin
//@desc     Authenticates user
//@access   Public
router.post(
	'/api/signin',
	[
		check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
		check('password', 'Please enter the correct passwords')
			.isLength({ min: 5 })
			.notEmpty()
			.withMessage('Password should be atleast 5 characters')
			.trim(),
	],
	signin
);

//@route    POST /api/signout
//@desc     Logs out
//@access   Private
router.post('/api/signout', requireAuth, signout);

//@route    POST /api/signup
//@desc     Handles new register
//@access   Public
router.post(
	'/api/signup',
	[
		check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
		check('name', 'Please enter a valid email').notEmpty().trim(),
		check(
			'password',
			'Please enter a password with more than 5 characters composed of only numbers and letters'
		)
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim(),
		check(
			'confirmPassword',
			'Please enter a password with more than 5 characters composed of only numbers and letters'
		)
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim(),
	],
	signup
);

export { router as authRouter };
