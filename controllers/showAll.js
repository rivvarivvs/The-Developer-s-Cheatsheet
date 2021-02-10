import { Item } from '../models/Item';

exports.showAll = async (req, res) => {
	const items = await Ticket.find({});

	res.send(items);
};
