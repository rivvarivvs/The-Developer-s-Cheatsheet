const express = require('express');

const currentUser = require('../../middleware/current-user');

const router = express.Router();

//@route    GET /api/currentUser
//@desc     Sends back the user in session
//@access   Public
router.get('/currentUser', currentUser.currentUser, (req, res) => {
	res.send({ currentUser: req.currentUser });
});

module.exports = router;
