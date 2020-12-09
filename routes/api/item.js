const express = require('express')
const Router = express.Router()
const auth = require('../../middleware/auth')

//Loading controllers
const itemController = require('../../controllers/menu')

//Item model
const Item = ('../../models/Item')

//@route    GET api/item
//@desc     Loads all cheathsheets
//@access   Public
Router.get('/', itemController.getAllItems)

//@route    GET api/item/:id
//@desc     Gets a cheatsheet
//@access   Public
Router.get('/:id', itemController.getItem)

//@route    GET api/item/:id/edit
//@desc     Update a cheatsheet
//@access   Private
Router.get('/:id/edit', auth, itemController.getAllItems)

//@route    GET api/item/:id/edit
//@desc     Update a cheatsheet
//@access   Private
Router.post('/:id/edit', auth, itemController.postUpdateItem)

//@route    POST api/item
//@desc     Create an item
//@access   Private
Router.post('/', auth, itemController.saveItem)

//@route    POST api/item/:id/delete
//@desc     Delete an item
//@access   Private
Router.post('/:id/delete', auth, itemController.postDeleteProduct)

module.exports = Router     