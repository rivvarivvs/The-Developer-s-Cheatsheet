const express = require('express');
const { body } = require('express-validator');

const requireAuth = require('../middleware/require-auth');
const update = require('../controllers/update');
const show = require('../controllers/show');
const showAll = require('../controllers/showAll');
const postNew = require('../controllers/postNew');
const destroy = require('../controllers/destroy');

const router = express.Router();

//@route    GET api/item
//@desc     Loads all cheathsheets
//@access   Public
router.get('/api/item', showAll.showAll);

//@route    GET api/item/:id
//@desc     Gets a cheatsheet
//@access   Public
router.get('/api/item/:id', show.show);

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
	update.update
);

//@route    POST api/item
//@desc     Create an item
//@access   Private
router.post(
	'/api/item/',
	[body('title').isString().isLength({ min: 3 }).trim(), body('body').trim()],
	requireAuth.requireAuth,
	postNew.postNew
);

//@route    POST api/item/:id/delete
//@desc     Delete an item
//@access   Private
router.post('/api/item/:id/delete', requireAuth.requireAuth, destroy.destroy);

module.exports = router;
