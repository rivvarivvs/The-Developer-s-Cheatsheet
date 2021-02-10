import { Item } from '../models/Item';

exports.postNew = async (req, res) => {
	const { title, body } = req.body;

	const item = await new Item({
		title: title,
		body: body,
		userId: req.user._id,
	});

	await item.save().catch((err) => {
		console.log(err);
	});

	return res.status(201).send({ item });
};
