const express = require('express');

const Item = require('../models/Item');
const requireAuth = require('../../middleware/require-auth');

const router = express.Router();

//@route    POST api/item/:id/delete
//@desc     Delete an item
//@access   Private
router.post(
	'/api/item/:id/delete',
	requireAuth.requireAuth,
	async (req, res) => {
		await Item.findByIdAndRemove(req.params.id)
			.then((result) => res.status(202))
			.catch((err) => res.status(400).json({ msg: `Err: ${err}` }));
	}
);

module.exports = router;
