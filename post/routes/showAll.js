const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

//@route    GET api/item
//@desc     Loads all cheathsheets
//@access   Public
router.get('/api/item', async (req, res) => {
	const items = await Item.find({});

	res.send(items);
});

module.exports = router;
