const express = require('express')
const Router = express.Router()
const auth = require('../../middleware/auth')

//Item model
const Item = ('../../models/Item')

//@route    GET api/item
//@desc     Loads all cheathsheets
//@access   Public
Router.get('/', (req, res) => {
    Item.find()
        .then(items => res.json(items))
        .catch(e => res.status(400).json(`Err: ${e}`))
})

//@route    POST api/item
//@desc     Create an item
//@access   Private
Router.post('/', auth, (req, res) => {
    const newItem = new Item({
        title: req.body.title,
        body: req.body.body
    })

    newItem.save().then(i => res.json(i))

})

//@route    DELETE api/item/:id
//@desc     Delete an item
//@access   Private
Router.delete('/:id', auth, (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({ sucess: true  })))
        .catch(err => res.status(404).json({ success: false }))
})

module.exports = Router     