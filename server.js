// pokedex v0.1.0-alpha, whee!

const express = require('express'),
	  mongoose = require('mongoose'),
	  morgan = require('morgan'),
	  bodyParser = require('body-parser');
const app = express();

// -- import our app stuff
const api = require('./app/api');

// -- grab configuration
// grab the $PORT envvar, otherwise default to port 8080
const port = process.env.PORT || 8080;
// do the same for the Mongo db's URL
const mongoUrl = process.env.DB || 'mongodb://localhost:32769/pokedex';

// -- connect to the db
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.once('open', () => console.log(`Connected to mongo database at ${mongoUrl}`));

// -- register routes and middleware
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use('/api', api);

// -- start stuff up
app.listen(port);
console.log(`Server listening on port ${port}`);