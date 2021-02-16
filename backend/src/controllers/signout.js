exports.signout = (req, res) => {
	req.session = null;

	res.send({});
};
