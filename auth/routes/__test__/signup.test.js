const request = require('supertest');
const app = require('../../../app');

it('returns 400 with invalid email', async () => {
	return request(app)
		.post('/users/signup')
		.send({
			email: 'asdasd',
			name: 'name',
			password: 'password',
		})
		.expect(400);
});

it('returns 400 with invalid password', async () => {
	return request(app)
		.post('/users/signup')
		.send({
			email: 'test@test.com',
			name: 'name',
		})
		.expect(400);
});

it('returns 400 with missing inputs', async () => {
	return request(app).post('/api/signup').send({}).expect(400);
});

it('returns a 400 after trying to signup with an existing email', async () => {
	const res = await request(app)
		.post('/users/signup')
		.send({
			email: 'test@test.com',
			name: 'name',
			password: '1',
		})
		.expect(res).;

	await request(app)
		.post('/users/signup')
		.send({
			email: 'test@test.com',
			name: 'name2',
			password: 'password2',
		})
		.expect(400);
});

it('returns a 201 after succesful signup', async () => {
	await request(app)
		.post('/users/signup')
		.send({
			email: 'test@test.com',
			name: 'name',
			password: 'password',
		})
		.expect(201);
});

it('sets up a cookie after successful signup', async () => {
	const res = await request(app)
		.post('/users/signup')
		.send({
			email: 'test@test.com',
			name: 'name',
			password: 'password',
		})
		.expect(201);

	expect(res.get('Set-Cookie')).toBeDefined;
});
