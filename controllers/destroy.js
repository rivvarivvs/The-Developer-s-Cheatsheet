import { Item } from '../models/Item';

exports.destroy = async (req, res) => {
	await Item.findByIdAndRemove(req.params.id)
		.then((result) => res.status(202))
		.catch((err) => res.status(400).json({ msg: `Err: ${err}` }));
};
