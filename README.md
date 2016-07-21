# pokedex

a little app with a POST endpoint that our mitm code can poke at to report pokemon and other thingamajigs
and then a little ui to display objects from the stored geojson

api docs are [here](https://github.com/pokerevs/pokedex/blob/master/docs/api.md).

Drop pokemon file is to drop pokemon that haven't been updated in 15 minutes. Maybe instead we should do a update to them to say they're no longer active?

## required envvars
- `DB`: URL of mongodb database
- `JWT_SECRET`: token secret
- `PORT`: port to run on
- `NEWRELIC_KEY`: newrelic license key for monitoring

## license
ISC because why the fuck not

