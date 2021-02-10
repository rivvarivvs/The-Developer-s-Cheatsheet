import express from 'express';
import body from 'express-validator/check';

import { requireAuth } from '../middleware/require-auth';
import { itemController } from '../../controllers/menu';
import { update } from '../controllers/update';
import { show } from '../controllers/show';
import { showAll } from '../controllers/showAll';
import { postNew } from '../controllers/postNew';
import { destroy } from '../controllers/destroy';

const router = express.Router();

//@route    GET api/item
//@desc     Loads all cheathsheets
//@access   Public
router.get('/', showAll);

//@route    GET api/item/:id
//@desc     Gets a cheatsheet
//@access   Public
router.get('/:id', show);

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

module.exports = Router;
