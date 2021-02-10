import express from 'express';
import body from 'express-validator/check';

import { requireAuth } from '../middleware/require-auth';
import { itemController } from '../../controllers/menu';
import { update } from '../controllers/update';
import { show } from '../controllers/show';
const postNew = require('../controllers/new');
import { destroy } from '../controllers/delete';

const router = express.Router();

//@route    GET api/item/add
//@desc     Renders submission page
//@access   Public
router.get('/add', itemController.getAddItem);

//@route    GET api/item
//@desc     Loads all cheathsheets
//@access   Public
router.get('/', itemController.getAllItems);

//@route    GET api/item/:id
//@desc     Gets a cheatsheet
//@access   Public
router.get('/:id', show);

//@route    GET api/item/:id/edit
//@desc     Update a cheatsheet
//@access   Private
router.get('/:id/edit', requireAuth, itemController.getAllItems);

//@route    POST api/item/:id/edit
//@desc     Update a cheatsheet
//@access   Private
router.put(
	'/:id/edit',
	[
		body('title').isAlphanumeric().isLength({ min: 3 }).trim(),
		body('body').trim(),
	],
	requireAuth,
	update
);

//@route    POST api/item
//@desc     Create an item
//@access   Private
router.post(
	'/',
	[body('title').isString().isLength({ min: 3 }).trim(), body('body').trim()],
	requireAuth,
	postNew
);

//@route    POST api/item/:id/delete
//@desc     Delete an item
//@access   Private
router.post('/:id/delete', requireAuth, destroy);
router.post('/:id/delete', requireAuth);

module.exports = Router;
