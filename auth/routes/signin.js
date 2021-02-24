const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../../config');

const router = express.Router();
const { jwt_key } = config;

//@route    POST /api/signin
//@desc     Authenticates user
//@access   Public
router.post(
	'/signin',
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
		const user = await User.findOne({ email });

		if (!user) {
			throw new Error('Invalid credentials');
		}

		// compare stored password with the body one
		bcrypt
			.compare(password, user.password)
			.then((resolve) => {
				// write the JWT payload
				const userJwt = jwt.sign(
					{
						id: user.id,
						email: user.email,
					},
					jwt_key
				);

				// assign it to the current session
				req.session.jwt = userJwt;

				// return the 200 code and the user object
				res.status(200).send(user);
			})
			.catch((err) => {
				console.log(err);
			});
	}
);

module.exports = router;
