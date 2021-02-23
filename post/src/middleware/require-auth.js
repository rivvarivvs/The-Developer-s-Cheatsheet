exports.requireAuth = (req, res, next) => {
	if (!req.currentUser) {
		throw new Error('Not authorized');
	}

	next();
};
