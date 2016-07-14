const debug = require('debug')('api');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

const MapObject = require('./models/mapobject');

router.get('/', function(req, res) {
	res.json({hooray: 'welcome to the pokedex api!',
		version: '0.1.0-alpha'});
});

router.post('/push/mapobject', function(req, res) {
	/*
		post a document of the form
		{
			type: enum{pokemon, gym, spawnpoint, pokestop},
			uid: String,
			location: GeoJSON.Point (using WSG84 datum),
			meta: <whatever shit you want>
		}
	*/

	if (_.isEmpty(req.body)) {
		res.status(400).json({error: 'requires posted data'});
		return;
	}

	debug(`pushed request: ${req.body}`);

	const query = {'uid': req.body.uid};
	MapObject.findOneAndUpdate(query, {
		objectType: req.body.type,
		uid: req.body.uid,
		location: req.body.location,
		meta: req.body.meta,
	}, {upsert: true}, (err, doc) => {
		if (err) {
			res.status(500).json({status: 'db-err', error: err}); return;
		}
		res.json({status: 'saved-successfully'});
	});
});

module.exports = router;