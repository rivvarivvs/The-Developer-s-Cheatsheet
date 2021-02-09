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

exports.postLogin((req, res, next) => {
	const { email, password } = req.body;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).render('login', {
			path: 'auth/login',
			pageTitle: 'Login',
			errorMessage: errors.array()[0].msg,
			oldInput: { email, password },
			validationErrors: errors.array(),
		});
	}

	User.findOne({ email })
		.then((user) => {
			if (!user) {
				return res.status(422).render('login', {
					path: 'auth/login',
					pageTitle: 'Login',
					errorMessage: errors.array()[0].msg,
					oldInput: { email, password },
					validationErrors: [],
				});
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save((err) => {
							console.log(err);
							res.redirect('/');
						});
					}
					return res.status(422).render('login', {
						path: 'auth/login',
						pageTitle: 'Login',
						errorMessage: errors.array()[0].msg,
						oldInput: { email, password },
						validationErrors: [],
					});
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => console.log(err));
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

exports.postReset = (req, res) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			return res.redirect('/reset');
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email })
			.then((user) => {
				if (!user) {
					req.flash('error', 'No account associated with this email');
					return res.redirect('/reset');
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000;
				user.save();
			})
			.then((result) => {
				res.redirect('/');
				transporter.sendMail({
					to: req.body.email,
					from: 'admin@complete.com',
					subject: 'Password reset',
					html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}>link</a> to set a new password</p>
        `,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	});
};

exports.postNewPassword = (req, res) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const token = req.body.passwordToken;
	let resetUser;

	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now(), _id: userId },
	})
		.then((user) => {
			resetUser = user;
			return bcrypt.hash(newPassword, 10);
		})
		.then((hashedPassword) => {
			resetUser.password = hashedPassword;
			resetUser.resetToken = null;
			resetUser.resetTokenExpiration = undefined;
			return resetUser.save();
		})
		.then((result) => res.redirect('/login'))
		.catch((err) => {
			console.log(err);
		});
};
