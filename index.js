const mongoose = require('mongoose');
const app = require('./app');

const config = require('./config');

const { db, jwt_key } = config;

const start = async () => {
	if (!db) {
		throw new Error('MONGO_URI must be defined');
	}

	if (!jwt_key) {
		throw new Error('JWT_KEY must be defined');
	}

	try {
		await mongoose.connect(db, {
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
