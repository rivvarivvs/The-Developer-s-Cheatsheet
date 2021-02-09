import express from 'express';
import body from 'express-validator/check';
import { requireAuth } from '../middleware/require-auth';
import { itemController } from '../../controllers/menu';

const Router = express.Router();

//@route    GET api/item/add
//@desc     Renders submission page
//@access   Public
Router.get('/add', itemController.getAddItem);

//@route    GET api/item
//@desc     Loads all cheathsheets
//@access   Public
Router.get('/', itemController.getAllItems);

//@route    GET api/item/:id
//@desc     Gets a cheatsheet
//@access   Public
Router.get('/:id', itemController.getItem);

//@route    GET api/item/:id/edit
//@desc     Update a cheatsheet
//@access   Private
Router.get('/:id/edit', isAuth, itemController.getAllItems);

//@route    POST api/item/:id/edit
//@desc     Update a cheatsheet
//@access   Private
Router.put(
	'/:id/edit',
	[
		body('title').isAlphanumeric().isLength({ min: 3 }).trim(),
		body('body').trim(),
	],
	requireAuth,
	itemController.postUpdateItem
);

//@route    POST api/item
//@desc     Create an item
//@access   Public
Router.post(
	'/',
	[body('title').isString().isLength({ min: 3 }).trim(), body('body').trim()],
	requireAuth,
	itemController.postAddItem
);

//@route    POST api/item/:id/delete
//@desc     Delete an item
//@access   Private
Router.post('/:id/delete', requireAuth, itemController.postDeleteProduct);

module.exports = Router;
