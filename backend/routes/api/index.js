const router = require('express').Router();

router.post('/test', async (req, res) => {
	res.json({ requestBody: req.body });
});

module.exports = router;
