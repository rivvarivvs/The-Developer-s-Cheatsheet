import { Item } from '../models/Item';

//NOT FINISHED
exports.show = async (req, res) => {
	const { itemId } = req.params;
	Item.findById(req.params.id)
		.then((item) => {
			res.render('/menu/details', {
				title,
				body,
			});
		})
		.catch((err) => console.log(err));
};
