const Item = require('../models/Item');

exports.show = async (req, res) => {
	const item = await Item.findById(req.params.id);

	if (!ticket) {
		throw new Error('Ticket not found');
	}

	res.send(item);
};
