import User from '../models/User';

exports.signin(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.find({ email });
	if (!user) {
		throw new Error('Invalid credentials');
	}

	const password = bcrypt.compare(password, user.password);
	if (!password) {
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
});
