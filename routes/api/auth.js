const express = require('express')
const Router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../../middleware/auth')

//User model
const User = ('../../models/User')

//@route    POST api/auth
//@desc     Authenticates user
//@access   Public

Router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(!isMatch) return res.status(400).json({ msg: 'Password does not match' })

            jwt.sign(
                { id: user.id },
                process.env.jwtSecret,
                (e, token) => {
                    if (e) throw e
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.name,
                        }
                    })
                }
            )
        })
  });
});

//@route    GET api/auth/user
//@desc     Get user data
//@access   Private

Router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user))
})

module.exports = Router