const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../app');

let mongo;

beforeAll(async () => {
	process.env.JWT_KEY = 'asdasd';
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

	mongo = new MongoMemoryServer();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.signin = async () => {
	const email = 'test@test.com';
	const name = 'name';
	const password = 'password';

	const res = await request(app)
		.post('/api/signup')
		.send({
			email,
			name,
			password,
		})
		.expect(201);

	const cookie = res.get('Set-Cookie');

	return cookie;
};
