const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const { jwt_key } = config;

const router = express.Router();

//@route    GET /api/currentUser
//@desc     Sends back the user in session
//@access   Public
router.get('/currentUser', (req, res) => {
	if (!req.session.jwt) {
		return res.send({ currentUser: null });
	}

	try {
		const payload = jwt.verify(req.session.jwt, jwt_key);
		res.send({ currentUser: payload });
	} catch (err) {
		res.send({ currentUser: null });
	}
});

module.exports = router;
