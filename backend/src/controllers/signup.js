const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: process.env.sendGrid_key,
		},
	})
);

exports.signup = async (req, res) => {
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

	// user created status
	res.status(201).send(newUser);
};
