const mongoose = require('mongoose');
const app = require('./app');

const config = require('./config');

const { DB_TEST, JWT_KEY } = config;

const start = async () => {
	if (!DB_TEST) {
		throw new Error('MONGO_URI must be defined');
	}

	if (!JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}

	try {
		await mongoose.connect(DB_TEST, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
	} catch (err) {
		console.log(err);
	}

	app.listen(3000, () => {
		console.log('Listening on port 3000!');
	});
};

start();
