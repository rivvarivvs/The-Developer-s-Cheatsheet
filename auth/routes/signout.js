const express = require('express');

const requireAuth = require('../../middleware/require-auth');

const router = express.Router();

//@route    POST /api/signout
//@desc     Logs out
//@access   Private
router.post('/signout', requireAuth.requireAuth, (req, res) => {
	// clear current session
	req.session = null;

	res.status(200).send({});
});

module.exports = router;
