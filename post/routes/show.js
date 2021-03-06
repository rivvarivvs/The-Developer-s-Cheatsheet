const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

//@route    GET api/item/:id
//@desc     Gets a cheatsheet
//@access   Public
router.get('/api/item/:id', async (req, res) => {
	const item = await Item.findById(req.params.id);

	if (!item) {
		return res.status(404).json('Ticket not found');
	}

	res.send(item);
});

module.exports = router;
