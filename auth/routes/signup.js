const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { jwt_key } = require('../../config');

const router = express.Router();

//@route    POST /api/signup
//@desc     Handles new register
//@access   Public
router.post(
	'/signup',
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
		var salt = bcrypt.genSaltSync(12);

		// hash the password and save the user to the db
		await bcrypt.hash(password, salt, async (err, hash) => {
			newUser = await new User({
				name: name,
				email: email,
				password: hash,
			});
			await newUser.save();

			// build the jwt token
			const userJwt = jwt.sign(
				{
					id: newUser.id,
					email: newUser.email,
				},
				jwt_key
			);

			// assign it
			req.session.jwt = userJwt;

			// send back 201 status with the new user obj
			res.status(201).send(newUser);
		});
	}
);

module.exports = router;
