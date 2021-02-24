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

		const item = await Item.findById(req.params.id);

		if (req.currentUser.id !== item.userId) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		await item.set({
			title,
			body,
		});

		res.status(202).send({ item });
	}
);

module.exports = router;
