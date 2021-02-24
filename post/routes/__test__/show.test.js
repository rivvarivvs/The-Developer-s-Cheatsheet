const request = require('supertest');
const app = require('../../../app');

it('returns a 404 if not found', async () => {
	await request(app).get(`/post/api/item/asdfghjklkjh`).send().expect(404);
});

it('it returns the ticket if its found', async () => {
	const title = 'titletest';
	const body =
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet ultricies justo, nec laoreet dui. Aenean dictum efficitur diam vel sagittis. Nullam lacinia nisi augue, ac condimentum odio scelerisque sit amet. Aliquam quis suscipit purus. Integer et quam sed ex fermentum blandit in non velit. Pellentesque eget augue posuere, mattis erat sit amet, accumsan purus. Mauris sodales elit ut ipsum sodales imperdiet. Maecenas malesuada porta semper. Aliquam eleifend eleifend luctus. Maecenas a pretium mauris, sed dignissim metus. Donec commodo est libero. Morbi sed odio nec mi sollicitudin dictum eu et dui. Cras tempor erat vitae metus vulputate aliquet.';

	const res = await request(app)
		.post('/post/api/item')
		.set('Cookie', global.signin())
		.send({
			title,
			body,
		})
		.expect(201);

	const itemResponse = await request(app)
		.get(`/post/api/item/${res.body.id}`)
		.send()
		.expect(200);

	expect(itemResponse.body.title).toEqual(title);
	expect(itemResponse.body.body).toEqual(body);
});
