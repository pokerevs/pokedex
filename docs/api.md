# pokedex api

the following all sits off of `/api`.

## /push
### POST /push/mapobject
Identify with an auth-token in the Authorization http header: `Authorization:Bearer <insert jwt token here>`.
get your jwt token/account from barzamin, they have admin db access.

takes a json document representing an in-game object.
should be of the form
```
{
	type: enum{pokemon, gym, spawnpoint, pokestop},
	uid: String,
	location: GeoJSON.Point (using WSG84 datum),
	properties: <whatever JSON object you want to add addition metadata. ie pokemon type/stats, spawnpoint type, etc>
}
```
### POST /push/mapobject/bulk
takes an array of `/push/mapobject`-type documents