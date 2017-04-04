#!/usr/bin/python
import MySQLdb
import requests
import json

#url = 'https://data.medicare.gov/resource/3z8n-wcgr.json'
#params = dict(
#	select='hospital_name, address, city, state, zip_code, phone_number, score',
#	measure_id='OP_20',
#	city='CHICAGO',
#	state='IL',
#	app_token='U09gw43zRbpCEYINdJUtcwTY8'
#	)
#resp = requests.get(url, params)
#resp.json()
file = open("seedHospitals.json").read()
hospitals = json.loads(file)

db = MySQLdb.connect(host="localhost", user="root", passwd="", db="speeder")    

cur = db.cursor()

for row in hospitals:
	if row['score'] == "Not Available":
		row['score'] = None
	else:
		row['score'] = int(row['score'])

	url = 'https://maps.googleapis.com/maps/api/geocode/json'
	params = dict(
			address=''.join([row['address'],",",row['city'],",",row['state'],",",row['zip_code']]),
			key='AIzaSyAxaxQiU4-JO-_lINF3YXSn1ONVkWt4HHQ'
		)
	resp = requests.get(url, params)
	resp.json()
	geocode = json.loads(resp.text)
	lat = geocode['results'][0]['geometry']['location']['lat']
	lon = geocode['results'][0]['geometry']['location']['lng']
	row['geometry'] = ''.join(['POINT(', str(lat), ' ', str(lon), ')'])

	attributes = (row['hospital_name'], row['address'], row['city'], row['state'], row['zip_code'], row['phone_number'], row['score'], row['geometry'], "2014-01-01", "2014-01-01")

	cur.execute("INSERT INTO Hospitals (name, address, city, state, zipCode, phoneNumber, waitMins, geometry, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s, ST_GeomFromText(%s), %s, %s)", attributes)

db.commit()

cur.execute("SELECT * FROM Hospitals")
# for row in cur.fetchall():
# 	print row

cur.close()
db.close()