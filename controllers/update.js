import { Item } from '../models/Item';

exports.update = async (req, res) => {
	const { title, body } = req.body

    await Item.findById(req.params.id)
        .then((item) => {
            item.title = title;
            item.body = body;

            return await item
                .save()
                .then((result) => {
                    res.status(202).send({item})
                })
                .catch((err) => console.log(err));
        });  
};
