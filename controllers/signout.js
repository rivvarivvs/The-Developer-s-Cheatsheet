exports.signout((req, req) => {
	req.session = null;

	res.send({});
});
