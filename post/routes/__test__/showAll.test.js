const request = require('supertest');
const app = require('../../../app');

const createSheet = () => {
	return request(app)
		.post('/post/api/item')
		.set('Cookie', global.signin())
		.send({
			title: 'asdasd',
			body:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet ultricies justo, nec laoreet dui. Aenean dictum efficitur diam vel sagittis. Nullam lacinia nisi augue, ac condimentum odio scelerisque sit amet. Aliquam quis suscipit purus. Integer et quam sed ex fermentum blandit in non velit. Pellentesque eget augue posuere, mattis erat sit amet, accumsan purus. Mauris sodales elit ut ipsum sodales imperdiet. Maecenas malesuada porta semper. Aliquam eleifend eleifend luctus. Maecenas a pretium mauris, sed dignissim metus. Donec commodo est libero. Morbi sed odio nec mi sollicitudin dictum eu et dui. Cras tempor erat vitae metus vulputate aliquet. ',
		});
};

it('fetches a list of posts', async () => {
	await createSheet();
	await createSheet();
	await createSheet();

	const res = await request(app).get('post/api/item').send().expect(200);

	expect(res.body.length).toEqual(3);
});
