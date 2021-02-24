const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { jwt_key } = require('../../config');

const router = express.Router();

router.post('/reset', async (req, res) => {
	// generate token
	// find user in the db
	// assign token and token exp to the user
	// save the user
	// import the transporter and send email
	// send a success status
});

router.post('/reset/:token', async (req, res) => {
	// find the user with the correct token and token exp
	// assign new password and empty token fields
	// save user
	// import the transporter and send success email
});
