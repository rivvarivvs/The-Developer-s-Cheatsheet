const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const config = require('../config');

let mongo;

beforeAll(async () => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

	await mongoose.connect(db_test, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

afterEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.connection.close();
});

global.signin = async () => {
	const email = 'test@test.com';
	const name = 'name';
	const password = 'password';

	const res = await request(app)
		.post('/users/signup')
		.send({
			email,
			name,
			password,
		})
		.expect(201);

	const cookie = res.get('Set-Cookie');

	return cookie;
};
