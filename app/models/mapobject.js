// represents a pgo game object
// this includes basically everything that you see in the game

const mongoose = require('mongoose');

const MapObjectSchema = new mongoose.Schema({
	objectType: {
		type: String,
		enum: ['pokestop', 'gym', 'spawnpoint', 'pokemon']
	},
	location: {
		'type': {
			type: String,
			required: true,
			default: 'Point'
		},
		coordinates: [Number],
	},
	uid: {type: String, required: true, index: true, unique: true},
	stale: {type: Boolean, default: false},
	properties: mongoose.Schema.Types.Mixed, // incredibly bad practice, i know.
	updatedBy: {type: String, ref: 'User'},
}, {timestamps: true});
MapObjectSchema.index({'location': '2dsphere'});

module.exports = mongoose.model('MapObject', MapObjectSchema);