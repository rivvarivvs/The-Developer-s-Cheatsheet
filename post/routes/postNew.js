const express = require('express');
const { body } = require('express-validator');

const Item = require('../models/Item');
const requireAuth = require('../../middleware/require-auth');

const router = express.Router();

//@route    POST api/item
//@desc     Create an item
//@access   Private
router.post(
	'/api/item/',
	[body('title').isString().isLength({ min: 3 }).trim(), body('body').trim()],
	requireAuth.requireAuth,
	async (req, res) => {
		const { title, body } = req.body;

		const item = await new Item({
			title: title,
			body: body,
			userId: req.currentUser._id,
		});

		await item.save().catch((err) => {
			throw new Error(err);
		});

		return res.status(201).send({ item });
	}
);

module.exports = router;
