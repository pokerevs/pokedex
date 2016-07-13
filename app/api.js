const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	res.json({hooray: 'welcome to the pokedex api!',
		version: '0.1.0-alpha'});
});

router.post('/push/gameobject', function(req, res) {
	res.json({implemented: false});
});

module.exports = router;