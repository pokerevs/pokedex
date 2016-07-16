// pokedex v0.1.0-alpha, whee!

const express = require('express'),
	  mongoose = require('mongoose'),
	  morgan = require('morgan'),
	  bodyParser = require('body-parser');
const app = express();

// -- import our app stuff
const api = require('./app/api');

// -- get the config
const config = require('./config');

// -- connect to the db
mongoose.connect(config.mongoUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(`Connected to mongo database at ${config.mongoUrl}`));

// -- register routes and middleware
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', api);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
  	console.log(err);
    res.status(401).json({'error': 'auth', 'message': err.message});
  }
});
// -- start stuff up
app.listen(config.port, 'localhost');
console.log(`Server listening on port ${config.port}`);
