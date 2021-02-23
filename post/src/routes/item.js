const express = require('express');
const { body } = require('express-validator');

const requireAuth = require('../middleware/require-auth');
const Item = require('../models/Item');

const router = express.Router();

//@route    GET api/item
//@desc     Loads all cheathsheets
//@access   Public
router.get('/api/item', async (req, res) => {
	const items = await Item.find({});

	res.send(items);
};);

//@route    GET api/item/:id
//@desc     Gets a cheatsheet
//@access   Public
router.get('/api/item/:id', async (req, res) => {
	const item = await Item.findById(req.params.id);

	if (!ticket) {
		throw new Error('Ticket not found');
	}

	res.send(item);
};
);

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
	};
	
);

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
	};
);

//@route    POST api/item/:id/delete
//@desc     Delete an item
//@access   Private
router.post('/api/item/:id/delete', requireAuth.requireAuth, async (req, res) => {
	await Item.findByIdAndRemove(req.params.id)
		.then((result) => res.status(202))
		.catch((err) => res.status(400).json({ msg: `Err: ${err}` }));
};);

module.exports = router;
