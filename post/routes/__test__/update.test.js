const request = require('supertest');
const app = require('../../../app');
const mongoose = require('mongoose');

const { Item } = require('../../models/Item');

it('returns a 401 if the user is not logged in', async () => {
	await request(app)
		.post('/post/api/item/asdaskdjh/edit')
		.send({
			title: 'titletest',
			body: 'ajsdoiahsd',
		})
		.expect(401);
});

it('returns a 401 if the user is not the owner of the ticket', async () => {
	const res = await request(app)
		.post('/post/api/item/')
		.set('Cookie', global.signin())
		.send({
			title: 'titletest',
			body: 'ajsdoiahsd',
		});

	await request(app)
		.post(`/post/api/item/${res.body.id}/edit`)
		.set('Cookie', global.signin())
		.send({
			title: 'asodhasd',
			body: 'aiosdhoai',
		})
		.expect(401);
});

it('returns 400 if the user provides invalid title or body', async () => {
    const cookie = global.signin();

    const res = await request(app)
		.post('/post/api/item/')
		.set('Cookie', cookie)
		.send({
			title: 'titletest',
			body: 'ajsdoiahsd',
		});
    
        await request(app)
		.post(`/post/api/item/${res.body.id}/edit`)
		.set('Cookie', cookie)
		.send({
			title: '',
			body: 'aiosdhoai',
		})
		.expect(400);
    
        await request(app)
		.post(`/post/api/item/${res.body.id}/edit`)
		.set('Cookie', cookie)
		.send({
			title: 'asodhasd',
			body: ,
		})
		.expect(400);
});

it('updates the ticket and returns a 200', async () => {
	const cookie = global.signin();

	const res = await request(app)
		.post('/post/api/item/')
		.set('Cookie', cookie)
		.send({
			title: 'titletest',
			body: 'ajsdoiahsd',
		});

	await request(app)
		.post(`/post/api/item/${res.body.id}/edit`)
		.set('Cookie', cookie)
		.send({
			title: 'asodhasd',
			body: 'aiosdhoai',
		})
		.expect(200);
});
