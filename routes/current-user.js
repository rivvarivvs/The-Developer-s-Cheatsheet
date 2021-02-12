const express = require('express');
const currentUser = require('../middleware/current-user');

const router = express.Router();

router.get('/api/users/currentUser', currentUser.currentUser, (req, res) => {
	res.send({ currentUser: req.currentUser });
});

module.exports = router;
