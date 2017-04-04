import MySQLdb
import requests
import json

file = open("seedInjuryReports.json").read()
hospitals = json.loads(file)

db = MySQLdb.connect(host="localhost", user="root", passwd="", db="speeder")    
cur = db.cursor()

for item in hospitals:
	attributes = (item['description'], item['discomfortLevel'], "2014-02-01", "2014-02-01", item['fk_hospitalInjuryId'], item['fk_email'])
	cur.execute("INSERT INTO InjuryReports (description, discomfortLevel, createdAt, updatedAt, fk_hospitalInjuryId, fk_email) VALUES (%s, %s, %s, %s, %s, %s)", attributes)

db.commit()

cur.close()
db.close()


