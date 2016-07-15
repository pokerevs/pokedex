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
		Console.log(`authed user: ${user.fqname} <${user.username}> with roles ${user.roles}`);
		if (_.includes(user.roles, 'push')) {
			upsertMapObject(res, req.body, user);
		} else {
			res.status(401).json({error: 'role', message: 'your current roles do not permit you to push to the db'})
		}
	});
});

router.post('/push/mapobject/bulk', jwtAuthenticate, function(req, res) {
	/*
		post a document of the form
		[
			MapObjectDocument (see /push/mapobject)
		]
	*/

	if (_.isEmpty(req.body)) {
		res.status(400).json({error: 'nodata', message:'requires *some* data to be posted'});
		return;
	}

	User.findById(req.user.id).exec((err, user) => {
		Console.log(`authed user: ${user.fqname} <${user.username}> with roles ${user.roles}`);
		if (_.includes(user.roles, 'push')) {
			for (datum of req.body) {
				upsertMapObject(res, datum, user);
			}
			res.json({status: 'saved-successfully'}).end(); return;
		} else {
			res.status(401).json({error: 'role', message: 'your current roles do not permit you to push to the db'})
		}
	});
});

router.get('/mapobjects/within', function (req, res) {
	MapObject
		.find({
			location: {
				$geoWithin: {
					$geometry: req.body.geometry
				}
			}
		}).exec((err, mapobjects) => {
			if (err) {
				res.status(500).json({'error': 'db', 'message': err.message}); return;
			}
			res.json(mapobjects);
		});
});

function upsertMapObject(res, data, user) {
	const query = {'uid': data.uid};
	MapObject.findOneAndUpdate(query, {
		objectType: data.type,
		uid: data.uid,
		location: data.location,
		properties: data.properties,
		updatedBy: user._id,
	}, {upsert: true, new: true, runValidators: true})
		.populate('updatedBy')
		.exec((err, doc) => {
			if (err) {
				console.log(err);
				res.status(500).json({error: 'db', message: err.message, errors: err.errors}); return;
			}
		});
}

module.exports = router;