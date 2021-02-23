const jwt = require('jsonwebtoken');

const config = require('../config');

const { jwt_key } = config;

exports.currentUser = (req, res, next) => {
	if (!req.session.jwt) {
		return next();
	}

	try {
		const payload = jwt.verify(req.session.jwt, jwt_key);
		req.currentUser = payload;
	} catch (err) {}

	next();
};
