# pokedex api

**The following all sits under `/api`.**

## /push
### POST /push/mapobject
Identify with an auth-token in the Authorization http header: `Authorization:Bearer <insert jwt token here>`.
Get your jwt token/account from the Mongo admin; they can create a new User in the users table for you.

Takes a json document representing an in-game object.
Should be of the form:
```
{
	type: enum{pokemon, gym, spawnpoint, pokestop},
	uid: String,
	location: GeoJSON.Point (using WSG84 datum),
	properties: <whatever JSON object you want to add addition metadata. ie pokemon type/stats, spawnpoint type, etc>
}
```
### POST /push/mapobject/bulk
Takes an array of `/push/mapobject`-type documents. Commits them to the DB in bulk.

## /mapobjects
### GET /mapobjects/within
Pass a GeoJSON geometry in the body as follows:
```
{
	"geometry": {
		"type": "Polygon",
		"coordinates": [
			[ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
				[100.0, 1.0], [100.0, 0.0] ]
	    ]
	}
}
```
It will return a list of GeoJSON points that are styleized/iconified and can be passed into mapbox/leaflet.