const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { jwt } = require('jsonwebtoken');

const requireAuth = require('../middleware/require-auth');
const currentUser = require('../middleware/current-user');

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
	async (req, res) => {
		// destructure the body obj
		const { email, password } = req.body;

		// check for user in db
		const user = await User.find({ email });

		// compare stored password with the body one
		const check = bcrypt.compare(password, user.password);

		// error handling
		if (!user || !check) {
			throw new Error('Invalid credentials');
		}

		// write the JWT payload
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			process.env.JWT_KEY
		);

		// assign it to the current session
		req.session = { userJwt };

		// return the 200 code and the user object
		res.status(200).send(user);
	}
);

//@route    POST /api/signout
//@desc     Logs out
//@access   Private
router.post('/api/signout', requireAuth.requireAuth, (req, res) => {
	// clear current session
	req.session = null;

	res.status(200).send({});
});

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
	async (req, res) => {
		const { name, email, password } = req.body;

		const existingUser = await User.findOne({ email });

		// check if the user already exists
		if (existingUser) {
			throw new Error('User already exists');
		}

		let newUser;

		// hash the password and save the user to the db
		bcrypt.hash(password, 12, async (err, hash) => {
			newUser = await new User({
				name: name,
				email: email,
				password: hash,
			});
			await newUser.save();

			// build the jwt token
			const userJwt = jwt.sign(
				{
					_id: newUser._id,
					email: newUser.email,
				},
				process.env.JWT_KEY
			);

			// assign it
			req.session = { userJwt };
		});

		// send back 201 status with the new user obj
		res.status(201).send(newUser);
	}
);

//@route    GET /api/currentUser
//@desc     Sends back the user in session
//@access   Public
router.get('/api/currentUser', currentUser.currentUser, (req, res) => {
	res.send({ currentUser: req.currentUser });
});

module.exports = router;
