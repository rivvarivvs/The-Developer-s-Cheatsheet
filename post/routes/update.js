const express = require('express');
const { body } = require('express-validator');

const Item = require('../models/Item');
const requireAuth = require('../../middleware/require-auth');

const router = express.Router();

//@route    POST api/item/:id/edit
//@desc     Update a cheatsheet
//@access   Private
router.post(
	'/api/item/:id/edit',
	[
		body('title').isAlphanumeric().isLength({ min: 3 }).trim(),
		body('body').trim(),
	],
	requireAuth.requireAuth,
	async (req, res) => {
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
	}
);

module.exports = router;
