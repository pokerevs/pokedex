import requests
import sys
import json

BASE_URL = 'http://localhost:8080'
API_KEY = sys.argv[1]

def gen_geodoc(uid):
	return {
		'uid': uid,
		'type': 'pokemon',
		'location': {
			'type': 'Point',
			'coordinates': [uid, uid],
		},
	}

payload = [gen_geodoc(i) for i in range(0, 5)]

print(payload)

r = requests.post(BASE_URL + '/api/push/mapobject/bulk',
		json=payload,
		headers={'Authorization': 'Bearer ' + API_KEY})

print(r.json())
assert r.status_code == 200