## Milestone 4

Tests can be found at https://github.com/forrestsill/speedER/tree/develop/test

1. A brief description about what you plan to implement in the 2nd iteration. You can refer to your original design document to explain what you plan to accomplish.

We plan to finish implementing User Profile pages, Medical Staff pages, the Medical Notification system, integration of Speech Recognition, and end-to-end testing.

2. A brief description about how the work will be divided among all pairs of people in your team.

Adam Freymiller - Notifications, Frontend/Backend Integration
Amy Sitwala -  Frontend/Backend Integration, Testing
Anand Kannappan - User profile views
Brian Keene - Medical staff views
Connor Soltas - Map view, Hospital routing functionality
Forrest Sill - Frontend/Backend integration, 
Maitreyi Nabar - Speech Recognition views
Neal Jochmann - User Profile views
Steven Hernandez - Frontend/Backend Integration, Testing

3. Unit test cases: Please have sufficient documentation or comments that allow us to understand and appreciate your test cases. Please make sure to provide test cases for every major function (except for pure-GUI functions).

We have updated the unit tests for this milestone. We have added more tests to existing test suites, and we have begun to unit test for the hospital login, signout, and logout options.  Please see the “Testing” section in the README file in our repository to get an overall sense of the existing test files.  

Changes to existing files: 

test_authentication.js

None, but we plan to rename this file to “Test_patient_authentication.js” (won’t make this change in this iteration due to merge conflicts). In the next iteration, we also plan to break up tests into different directories –  “patient,” “medical_staff”, and “hospital” – to make the tests as transparent as possible. 

Please note that while running the tests via mocha, messages like the following are normal and should be presented when inputs are null: 

{ [SequelizeValidationError: notNull Violation: phoneNumber cannot be null]
  name: 'SequelizeValidationError',
  message: 'notNull Violation: phoneNumber cannot be null',
  errors: 
   [ { message: 'phoneNumber cannot be null',
       type: 'notNull Violation',
       path: 'phoneNumber',
       value: null } ] }
	

test_hospital_database.js:

Testing for existence of and query functionalities of the hospital database. Additionally, hospital passwords are now salted; support for this was implemented in test_hospital_database.js, as well as in our actual database model (/speedER/src/server/models/model.js).


test_medical_staff_database.js:
	
Testing for whether or not a certain medical staff member is present, and the correctness of find and findAll functions.   Additionally, medical staff accounts now have their passwords salted; support for this was implemented in test_medical_staff_database.js, as well as in our actual database model.


test_patient_database.js: 
	
We updated the models in the mocked database to fit the models in our actual database. We just added a few more fields (like “salt”, “isVerified”) to the mocked Patient instances. 

Please note that while running mocha on this specific test case, the compiler may complain with the following warning: 

“validator deprecated you tried to validate a number but this library (validator.js) validates strings only” 

This warning occurs when we use a validator on any non-string type, such as an integer in our case. Please ignore this warning, as the validator does provide the proper functionality even though it is deprecated. 


test_requests.js:

We added more tests to make sure new routes could be accessed properly. We specifically checked if we’d receive an HTTP status code of 200 after making a GET request. The new routes are as follows: 

hospital

hospitalLogin

confirm

navbar

patient

patientMapView


We modified a few of the existing routes as well -- for instance, routes dealing with patient login and signup were generalized into overall login and signup routes. 


test_sessions.js: 

We added new tests to see whether a new signed-in user’s session cookie differs from the previous signed-in user’s session cookie (on the patient side). In the last iteration, we faced issues with testing authentication after a user logged out. We thought the cookie would be deleted upon a user logging out. However, we discovered that the cookie is present after a user logs out.

	Thus, we opted to see if the cookie’s value changes upon a new sign-in. This idea became the foundation of the new tests added in this milestone. 

	In the next milestone, we will have to test another component of persistence:  essentially, we need to see if a logged-out user could access a page that is only available to logged-in users.  We currently cannot test for this, as we currently do not have this condition in our implementation. We also plan to test hospital and medical staff persistence in the next milestone. 
	

New files: 

test_healthprofile_database.js
	
In this file, we tested the “belongsTo” relationship between the “HealthProfile” model and the “Patient” model. We implement methods to see if we can find the health profile based on the patient’s id. We're also testing for age, height, weight, sex, insurance provider, prescription, allergies, and prior operations (past injuries and/or emergencies).


test_injuryreport_database.js

In this file, we tested the “belongsTo” relationship between the “InjuryReport” model and the “Patient” model. We implement methods to see if we can find the injury report based on the patient’s id. 


test_medical_staff_authentication.js
	
This file is very similar to “Test_authentication.js” (authentication in terms of sign-up on patient side).  “Test_hospital_authentication.js” checks to see whether a hospital can sign up or not based on certain inputs a user passes to the sign-up form. 

Please note that while running the tests via mocha, messages like the following are normal and should be presented when inputs are null: 

{ [SequelizeValidationError: notNull Violation: phoneNumber cannot be null]
  name: 'SequelizeValidationError',
  message: 'notNull Violation: phoneNumber cannot be null',
  errors: 
   [ { message: 'phoneNumber cannot be null',
       type: 'notNull Violation',
       path: 'phoneNumber',
       value: null } ] }

* *Test_notifications.js: *
This test suite checks for basic well-definedness of the notifications database and will check for well-defined messages between the appropriate parties as we flesh it out.

	
4. Whatever you want to discuss

We decided to remove the billing system feature from the list of requirements of the second iteration because we felt that it didn’t truly relate to SpeedER’s purpose of reducing time to care. We felt that reducing time to care should take precedence as it is the fundamental purpose of the web app -- we didn’t want to focus a lot of our time on complications related to the billing system feature (e.g. security, integration of 3rd party payment processing, db schema, etc.).

Hospital reviews seemed extraneous for the same reason. Reviews might help a patient identify the “best” hospital around them, but they don’t help a patient identify the nearest hospital with the shortest wait time. More importantly, the reviews that a patient would make about the hospital they attended is fundamentally inappropriate with respect to the concept of a hospital -- patients are not customers of hospitals. Further, other parts of the app’s core functionality do not depend on reviews. So removing reviews from the list of requirements has no significant impact on the rest of our implementation.

On the front-end, we’ve been implementing a map view to serve as the home screen for patients. When a patient lands on this view, they should immediately see the closest hospitals on a map and relevant information about them, such as their expected travel time and wait time. If logged in, the patient can click on an individual hospital to view more information about it as well as submit an injury report (i.e., confirm that they are coming to that particular hospital’s emergency room).

We’re taking advantage of multiple APIs to implement this. First, we get the user’s location using the Google Maps Javascript API. Then we query our database for nearby hospitals -- data we collected using Medicare.Gov’s SODA API and Google’s Geocoding web service to convert hospitals’ addresses into latitudes and longitudes. Finally, we display the user’s current location along with the retrieved hospital locations on a map using the Google Maps Javascript API again.

Currently, we’ve implemented the basics of the map view and wrote a Python script to populate our database with hospital locations and latitudes/longitudes. The only remaining steps are to retrieve the hospitals’ locations from the database and use them to populate the map view.
