import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import { validationResult } from 'express-validator';

const User = require('../models/User');

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: process.env.sendGrid_key,
		},
	})
);

exports.getLogin((req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('/login', {
		path: 'auth/login',
		pageTitle: 'Login',
		errorMessage: message,
		oldInput: { email: '', password: '' },
		validationErrors: [],
	});
});

exports.getSignup = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('register', {
		path: 'auth/register',
		pageTitle: 'Signup',
		errorMessage: message,
		oldInput: { name: '', email: '', password: '', confirmPassword: '' },
	});
};

exports.getReset = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/reset', {
		path: '/reset',
		pageTitle: 'Reset Password',
		errorMessage: message,
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
		.then((user) => {
			let message = req.flash('error');
			if (message.length > 0) {
				message = message[0];
			} else {
				message = null;
			}
			res.render('auth/new-password', {
				path: '/new-password',
				pageTitle: 'New password',
				errorMessage: message,
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postLogin(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.find({ email });
	if (!user) {
		throw new Error('Invalid credentials');
	}

	const password = bcrypt.compare(password, user.password);
	if (!password) {
		throw new Error('Invalid credentials');
	}

	const userJwt = jwt.sign(
		{
			_id: user._id,
			email: user.email,
		},
		process.env.JWT_KEY
	);

	req.session = userJwt;
	res.status(200).send(user);
});

exports.postLogout((req, req, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
});

exports.postSignup((req, res) => {
	const { name, email, password, confirmPassword } = req.body;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).render('register', {
			path: 'auth/register',
			pageTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
			oldInput: { name, email, password, confirmPassword },
		});
	}

	bcrypt
		.hash(password, 12)
		.then((hashedPassword) => {
			const newUser = new User({
				name: name,
				email: email,
				password: hashedPassword,
			});
			return newUser.save();
		})
		.then((result) => {
			res.redirect('/login');
			return transporter.sendMail({
				to: email,
				from: 'admin@complete.com',
				subject: "You're registered!",
				html: '<h1>You signed up!</h1>',
			});
		})
		.catch((err) => {
			throw new Error('Unable to save user');
		});
});
