const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { sendMail } = require('../service/nodemailer');
const { JWT_KEY } = require('../../config');

const router = express.Router();

//@route    POST /signup
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

		let user;
		const salt = bcrypt.genSaltSync(12);

		// hash the password and save the user to the db
		await bcrypt.hash(password, salt, async (err, hash) => {
			user = await new User({
				name,
				email,
				password: hash,
			});
			await user.save();

			// build the jwt token
			const userJwt = jwt.sign(
				{
					id: user.id,
					email: user.email,
				},
				JWT_KEY
			);

			// assign it
			req.session.jwt = userJwt;

			await sendMail(
				user.email,
				'You just signed-up',
				'Welcome to the Developers Cheatsheet. Your new account is already available'
			);

			// send back 201 status with the new user obj
			res.status(201).send(user);
		});
	}
);

module.exports = router;
