// grab the $PORT envvar, otherwise default to port 8080
const port = process.env.PORT || 8080;
// do the same for the Mongo db's URL
const mongoUrl = process.env.DB || 'mongodb://localhost:32769/pokedex';
const jwtSecret = process.env.JWT_SECRET;
const host = process.env.HOST || 'localhost';
if (typeof jwtSecret === 'undefined') {
	console.log('Please supply a JWT secret in the env var $JWT_SECRET');
	process.exit(1);
}

module.exports = {
	port: port,
	mongoUrl: mongoUrl,
	jwtSecret: jwtSecret,
};
