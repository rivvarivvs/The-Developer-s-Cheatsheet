const User = require('../models/User');

exports.signin = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.find({ email });
	if (!user) {
		throw new Error('Invalid credentials');
	}

	const check = bcrypt.compare(password, user.password);
	if (!check) {
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
};
