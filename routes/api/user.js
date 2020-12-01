const express = require('express')
const Router = express.Router()

//User model
const User = ('../../models/User')

//@route    GET api/user
//@desc     Loads all users
//@access   Public
Router.get('/', (req, res) => {
    Item.find()
        .then(users => res.json(users))
        .catch(e => res.status(400).json(`Err: ${e}`))
})

//@route    POST api/user
//@desc     Create a new user
//@access   Public
Router.post('/', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    })

    newUser.save()
        .then(i => res.json(i))
        .catch(err => res.status(400).json(`Err: ${err}`))
})

//@route    DELETE api/item/:id
//@desc     Delete an user
//@access   Public
Router.delete('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => user.remove().then(() => res.json({ sucess: true  })))
        .catch(err => res.status(404).json({ success: false }))
})

module.exports = Router