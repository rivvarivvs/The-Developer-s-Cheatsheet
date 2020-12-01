const express = require('express')
const Router = express.Router()

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
//@access   Public
Router.post('/', (req, res) => {
    const newItem = new Item({
        title: req.body.title,
        body: req.body.body
    })

    newItem.save().then(i => res.json(i))

})

//@route    DELETE api/item/:id
//@desc     Delete an item
//@access   Public
Router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({ sucess: true  })))
        .catch(err => res.status(404).json({ success: false }))
})

module.exports = Router     