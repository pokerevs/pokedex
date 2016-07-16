const debug = require('debug')('api');
const util = require('util')
const formidable = require('formidable')
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
		console.log(`authed user: ${user.fqname} <${user.username}> with roles ${user.roles}`);
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
		console.log(`authed user: ${user.fqname} <${user.username}> with roles ${user.roles}`);
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

router.post('/mapobjects/bbox', function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        //res.setHeader('Access-Control-Allow-Origin', 'localhost');
        var form = new formidable.IncomingForm();
        var bbox

        form.parse(req, function(err, fields, files) {
                //res.writeHead(200, {'content-type': 'text/plain'});
                //console.log('received upload:\n\n');
                console.log(util.inspect({fields: fields, files: files}));
                prebbox = fields.bbox
                p2b = prebbox.split(",")
                bbox = [[parseFloat(p2b[0]), parseFloat(p2b[1])],[parseFloat(p2b[2]),parseFloat(p2b[3])]]
                console.log("Bbox of %j", bbox)
                //{$or: [{"properties.WillDisappear": { $lt: 1468633519430}}}, {"properties.WillDisappear": {$exists: false}}}]}
                MapObject
                        .find({
                                location: {
                                        $geoWithin: {
                                                $box: bbox
                                        }
                                }, $or: [{"properties.WillDisappear": { $lt: 1468633519430}}, {"properties.WillDisappear": {$exists: false}}]
                        }).exec((err, mapobjects) => {
                                if (err) {
                                        res.status(500).json({'error': 'db', 'message': err.message}); return;
                                }
                                returnthing = []
                                for (var i=0; i<mapobjects.length; ++i){
                                    //{"geometry": {"coordinates": [-118.725905, 34.287412], "type": "Point"}, "id": "4d6cf9c4e3af43289b4ba8e9219b552f.16", "properties": {"LastModifiedMs": 1468561160967, "id": "4d6cf9c4e3af43289b4ba8e9219b552f.16", "marker-color": "808080", "marker-symbol": "circle", "title": "Pok\u00e9Stop", "type": "pokestop"}, "type": "Feature"}
                                    retobj = {}
                                    retobj.geometry = mapobjects[i].location
                                    retobj.id = mapobjects[i].uid
                                    retobj.properties = mapobjects[i].properties
                                    if(!retobj.properties){
                                        retobj.properties = {id: "junk"}
                                    }
                                    console.log(mapobjects[i])
                                    retobj.type = "Feature"
                                    returnthing.push(retobj)
                                }
                                res.json({features: returnthing, type: "FeatureCollection"});
                        });
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
