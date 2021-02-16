const Item = require('../models/Item');

const showAll = async (req, res) => {
	const items = await Item.find({});

	res.send(items);
};

exports.showAll = showAll;
