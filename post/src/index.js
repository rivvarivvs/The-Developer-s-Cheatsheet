const mongoose = require('mongoose');
const app = require('./app');

const start = async () => {
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined');
	}

	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}

	try {
		await mongoose.connect(process.env.MONGO_URI, {
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
