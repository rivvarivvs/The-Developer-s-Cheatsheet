const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const mongoose = require('mongoose');

const User = require('../models/User');
const { JWT_KEY } = require('../../config');
const { sendMail } = require('../service/nodemailer');

const router = express.Router();

router.post('/reset', async (req, res) => {
	const { email } = req.body;

	// generate token
	const token = await randomBytes(20).toString('hex');

	// find user in the db and error checking
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400);
	}

	// assign token and token exp to the user and save it
	await user.set({
		resetPasswordToken: token,
		resetPasswordExpires: Date.now() + 3600000, // one hour
	});
	// import the transporter and send email

	await sendMail(
		user.email,
		'Password Reset',
		'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			'http://' +
			req.headers.host +
			'/reset/' +
			token +
			'\n\n' +
			'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	);

	// send a success status
	res.status(200);
});

router.get('/reset/:token', async (req, res) => {});

router.post('/reset/:token', async (req, res) => {

	// find the user with the correct token and token exp
	const user = await User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: { $gt: Date.now() }
	});
	// assign new password and empty token fields

	const salt = bcrypt.genSaltSync(12);

	// hash the password and save the user to the db
	bcrypt.hash(password, salt).then(password => {
		await user.set ({
			password,
			resetPasswordExpires = undefined,
			resetPasswordToken = undefined,
		})

		//send success email
		await sendMail(
			user.email, 
			'Your password has been changed', 
			'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
		)

		res.status(202)
	})
});

module.exports = router;
