import requests
import sys
import json

BASE_URL = 'http://localhost:8080'
API_KEY = sys.argv[1]

payload = {
	'uid': 0,
	'type': 'pokemon',
	'location': {
		'type': 'Point',
		'coordinates': [1.0, 1.0],
	},
}

r = requests.post(BASE_URL + '/api/push/mapobject',
		json=payload,
		headers={'Authorization': 'Bearer ' + API_KEY})

print(r.json())
assert r.status_code == 200