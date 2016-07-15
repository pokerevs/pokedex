const jwt = require('jsonwebtoken'),
	  mongoose = require('mongoose');

const config = require('./config'),
	  User = require('./app/models/user');

if (process.argv.slice(2).length == 0) {
	console.log('usage: node gen-user-token.js <username>');
	process.exit(1);
}

mongoose.connect(config.mongoUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log(`Connected to mongo database at ${config.mongoUrl}`)
	
	const username = process.argv.slice(2)[0];
	User.findOne({'username': username}).exec((err, doc) => {
		if (err) {
			console.log(`Database error finding user ${username}: ${err}`);
			process.exit(1);
		}
		if (!doc) {
			console.log(`Could not find user ${username}`);
			process.exit(1);
		}

		const token = jwt.sign({id: doc._id}, config.jwtSecret);
		console.log(`Token for ${username}: ${token}`);
		db.close();
	});
});
