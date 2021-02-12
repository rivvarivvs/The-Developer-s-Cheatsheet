const Item = require('../models/Item');

exports.update = async (req, res) => {
	const { title, body } = req.body;

	const item = await Item.findById(req.params.id).then((item) => {
		item.title = title;
		item.body = body;
	});

	await item
		.save()
		.then((result) => {
			res.status(202).send({ item });
		})
		.catch((err) => console.log(err));
};
