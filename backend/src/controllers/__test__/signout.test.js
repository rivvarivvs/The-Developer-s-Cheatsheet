const request = require('supertest');
const app = require('../../app');

it('clears the cookie after signing out', async () => {
	await request(app)
		.post('/api/signup')
		.send({
			email: 'test@test.com',
			name: 'name',
			password: 'password',
		})
		.expect(201);

	const res = await request(app).post('/api/signout').send({}).expect(200);

	expect(res.get('Set-Cookie')).toBeDefined;
});
