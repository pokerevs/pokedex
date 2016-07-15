import requests
import sys
import json

BASE_URL = 'http://localhost:8080'

payload = {
	'geometry': {
		'type': 'Polygon',
		'coordinates': [[
			[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]
		]]
	}
}

r = requests.get(BASE_URL + '/api/mapobjects/within',
		json=payload)

print(r.json())
assert r.status_code == 200