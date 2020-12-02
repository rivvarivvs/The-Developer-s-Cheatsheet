const express = require('express')
const Router = express.Router()
const bcrypt = require('bcryptjs')

//User model
const User = ('../../models/User')

//@route    POST api/user
//@desc     Create a new user
//@access   Public
Router.post('/', (req, res) => {
    const { name, email, password } = req.body
    
    if(!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields'})
    }

    User.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(400).json({ msg: 'User already exists' })
            }

            const newUser = new User({
                name, 
                email,
                password
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (e, hash) => {
                    if (e) throw e
                    newUser.password = hash
                    newUser.save()
                        .then(user => {
                            res.json({
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.name,
                                }
                            })
                        })
                })
            })
        })
})

module.exports = Router