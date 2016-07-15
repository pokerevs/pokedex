const debug = require('debug')('api');
const express = require('express'),
			router = express.Router(),
			_ = require('lodash');

const config = require('../config');
const jwtAuthenticate = require('express-jwt')({'secret': config.jwtSecret});

const MapObject = require('./models/mapobject'),
			User = require('./models/user');

router.get('/', function(req, res) {
	res.json({hooray: 'welcome to the pokedex api!',
		version: '0.1.0-alpha'});
});

router.post('/push/mapobject', jwtAuthenticate, function(req, res) {
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
		res.status(400).json({error: 'nodata', message:'requires *some* data to be posted'});
		return;
	}

	User.findById(req.user.id).exec((err, user) => {
		debug(`authed user: ${user.fqname} <${user.username}> with roles ${user.roles}`);
		if (user.roles.includes('push')) {
			const query = {'uid': req.body.uid};
			MapObject.findOneAndUpdate(query, {
				objectType: req.body.type,
				uid: req.body.uid,
				location: req.body.location,
				meta: req.body.meta,
			}, {upsert: true}, (err, doc) => {
				if (err) {
					res.status(500).json({error: 'db', error: err.message}); return;
				}
				res.json({status: 'saved-successfully'});
			});
		} else {
			res.status(401).json({error: 'role', message: 'your current roles do not permit you to push to the db'})
		}
	});
});

module.exports = router;