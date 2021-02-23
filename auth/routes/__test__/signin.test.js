const request = require('supertest');
const app = require('../../../src/app');

it('fails when a email that does not exist is supplied', async () => {
	await request(app)
		.post('/api/signin')
		.send({
			email: 'test@test.com',
			name: 'name',
			password: 'password',
		})
		.expect(400);
});

it('fails the signin when a wrong password is provided', async () => {
	// send a post request to signup a user
	await request(app)
		.post('/api/signup')
		.send({
			email: 'test@test.com',
			name: 'name',
			password: 'password',
		})
		// returns a 201
		.expect(201);

	// send a post request to signin with the wrong password
	await request(app)
		.post('/api/signup')
		.send({
			email: 'test@test.com',
			password: 'wrong',
		})
		// returns a 400
		.expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
	// send a post request to signup a user
	await request(app)
		.post('/api/signup')
		.send({
			email: 'test@test.com',
			name: 'name',
			password: 'password',
		})
		// returns a 201
		.expect(201);

	// send a post request to signin with valid credentials
	await request(app)
		.post('/api/signin')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		// returns a 400
		.expect(200);
});
