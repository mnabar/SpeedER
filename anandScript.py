import MySQLdb
import requests
import json

file = open("hospitalDataOutput.json").read()
hospitals = json.loads(file)

db = MySQLdb.connect(host="localhost", user="root", passwd="", db="speeder")    
cur = db.cursor()

for item in hospitals["data"]:
	if item['score'] == "Not Available":
		item['score'] = None

	attributes = (item['hospital_name'], False, item['address'], item['city'], item['state'], item['zip_code'], item['phone_number'], item['score'], "2014-01-01", "2014-01-01")
	cur.execute("INSERT INTO Hospitals (name, password, address, city, state, zipCode, phoneNumber, waitMins, createdAt, updatedAt) VALUES (%s, %r, %s, %s, %s, %s, %s, %s, %s, %s)", attributes)

db.commit()

cur.close()
db.close()


