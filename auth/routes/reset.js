const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { JWT_KEY } = require('../../config');
const { sendMail } = require('../service/nodemailer');

const router = express.Router();

router.post('/reset', async (req, res) => {
	// generate token
	// find user in the db
	// assign token and token exp to the user
	// save the user
	// import the transporter and send email
	await sendMail(subject, text);
	// send a success status
});

router.post('/reset/:token', async (req, res) => {
	// find the user with the correct token and token exp
	// assign new password and empty token fields
	// save user
	// import the transporter and send success email
});

module.exports = router;
