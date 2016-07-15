const jwt = require('jsonwebtoken'),
	  mongoose = require('mongoose'),
	  readline = require('readline');

const config = require('./config'),
	  User = require('./app/models/user');

mongoose.connect(config.mongoUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log(`Connected to mongo database at ${config.mongoUrl}`)

	const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});

	rl.question('Enter username to generate token for: ', (username) => {
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
			console.log(`Token is ${token}`);
			db.close();
		});
	});
});
