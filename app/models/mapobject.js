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
		coordinates: [Number]
	},
	uid: {type: String, required: true, index: true, unique: true},
	meta: mongoose.Schema.Types.Mixed, // incredibly bad practice, i know.
}, {timestamps: true});

module.exports = mongoose.model('MapObject', MapObjectSchema);