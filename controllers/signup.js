import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import User from '../models/User'

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: process.env.sendGrid_key,
		},
	})
);

exports.signup = (async (req, res) => {
	const { name, email, password } = req.body;

	const existingUser = await User.findOne({ email });

	// check if the user already exists
	if (existingUser) {
		throw new Error('User already exists');
	}

	// hash the password and save the user to the db
	bcrypt
		.hash(password, 12)
		.then((hashedPassword) => {
			const newUser = await new User({
				name: name,
				email: email,
				password: hashedPassword,
			});
			return newUser.save();
		})
		.catch((err) => {
			throw new Error('Unable to save user');
		});

	// build the jwt token
	const userJwt = jwt.sign(
		{
			_id: user._id,
			email: user.email,
		},
		process.env.JWT_KEY
	);

	// assign it
	req.session = userJwt;

	// user created status
	res.status(201).send(user);
});
