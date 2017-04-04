# speedER

## Iteration 2

## Overview
SpeedER is a web application that seeks to reduce the amount of time between the time of injury and the time of care for the patient. It allows anyone to create a profile in which they enter in their health history and personal information. This allows a hospital to quickly pull up and view patient profiles when patients arrive--or even when they’re on the way. When the patient injures himself or herself, he or she can report the injury with a few clicks on the platform and discover the optimal emergency room to go to by comparing the estimated travel time and estimated wait time at nearby emergency rooms. The overall goal of the platform is to ensure that injured patients receive treatment quickly by eliminating the time spent waiting in line and filling out forms.

## Setup
### Prerequisites
You should have MySQL installed and a MySQL server instance running. We've also found it helpful to use a Database client (such as MySQL Work Bench), as a GUI to create the database before running the app.

Download for MySQL Community Server: https://dev.mysql.com/downloads/mysql/

Download for MySQL Work Bench: https://dev.mysql.com/downloads/workbench/

If you decide to use MySQL Work Bench, ensure that you have a local database connection set up (see: https://dev.mysql.com/doc/workbench/en/wb-mysql-connections-new.html). Once you have the local database connection, execute the following SQL command:

```
CREATE DATABASE speeder
```

In the cloned repository, go to src/server/config/config.js and ensure that the options for db.password, db.username, and db.host match those of your local database connection.

If at any point you wish to change your root user password for MySQL Workbench, please refer to the following: https://dev.mysql.com/doc/refman/5.7/en/resetting-permissions.html

### Installation
First clone the repository: 
```
git clone https://github.com/forrestsill/speedER.git
```
After cloning the repository, run the following commands:
```
cd speedER
npm init
```
Now, you can rename the name to "speeder" and continue pressing enter to retain all the defaults. Then, you can run the following command:
```
npm install
```

In order to run the application, the following modules are required:
* express
* sequelize
* bcryptjs
* mysql
* passport
* passport-local
* body-parser
* express-session
* connect-session-sequelize
* pug

You will also need to make sure that your node version is version 6 or higher so that the mail functionality works:
```
node --version
```
If it's lower than version 6, then you can update your node version with the following commands:
```
sudo npm install n -g
sudo n latest
```
You should first initialize the database tables (via terminal): navigate to the “speedER” home directory and run the following to get the server running: 
```
node app.js
```

Next, with the server running, navigate to your browser and visit in order to validate that the app is running and in order to prepopulate one dummy patient for testing purposes: 

```
http://127.0.0.1:3000/
```

Next, terminate the server process, and run the masterScript.py script in order to populate the Hospitals table in the db with hospital information and wait times, and to populate the InjuryReports table with (pre-written) artificial injury reports:
```
python masterScript.py
```
Then, to run the application, run the following command in the terminal:
```
node app.js
```

Now, the server should be up and running at localhost:3000.

## Viewing Database Info
Examples -- Run the following the SQL scripts in your preferred database client or on the terminal: 

To see all patient information:  
```
use speeder; 
select * from Patients;
```
To see all the medical staff information (both medical staff administrators and doctors): 
```
use speeder; 
select * from MedicalStaffs;
```
To see all the hospitals: 
```
use speeder;
select * from Hospitals; 
```
To see all the patients' injury reports: 
```
use speeder; 
select * from InjuryReports;
```
To see all the patients’ health profiles: 
```
use speeder; 
select * from HealthProfiles;
```
To insert into the database (example of inserting into the database, assuming that a patient with the email “patient@test.com” exists):
```
use speeder; 
insert into InjuryReports values (1, "I broke my arm", 3, null, null,"2017-03-05 02:30:33", "2017-03-05 02:30:33", 2, "patient@test.com", "patient@test.com");
```

## Walkthrough + Acceptance Testing 

### General Note: 

* When testing the three different types of users, make sure you are completely logged out of all accounts before you test another type of account. For example, if you create a Medical Staff account and sign into that account, if you try signing into a Patient account, you will get a "user login failed" page, which is EXACTLY what should happen. You cannot be logged into multiple accounts at once when using SpeedER. 

* Because we use session cookies, users are NOT automatically logged out when they exit the app. Be aware of this fact while testing and using the site. 


### 1. Navigate to the Home Screen (http://127.0.0.1:3000/)

![Homepage: Main](./screenshots/homepageMain.png?raw=true "Main part of homepage")

![Homepage: Patient](./screenshots/homepagePatient.png?raw=true "Patient part of homepage")

![Homepage: Medical Staff](./screenshots/homepageMedicalStaff.png?raw=true "Medical staff part of homepage")

![Homepage: Doctor](./screenshots/homepageDoctor.png?raw=true "Doctor part of homepage")


### 2. Patient Walkthrough 

We have provided a dummy patient for acceptance testing purposes. The dummy patient gets loaded upon navigating to the home page upon the initial app start. If you use the dummy patient for testing purposes, skip to part b) below. The dummy patient's information is as follows:

Email

```
hello@patient.com
```

Password

```
1234567
```

#### a. Sign Up 

After clicking the "Patient" button and subsequently the "Get Started" button the homepage, you will be redirected to the patient signup page. 

Input the proper requirements. The sign up form will notify you if you are inputting information is not allowed (for instance, if you input "testing" instead of "testing@test.com" for email). 

![Patient: Signup](./screenshots/patientSignup.png?raw=true "Patient signup")

![Patient: SignupCongrats](./screenshots/patientSignupCongrats.png?raw=true "Patient signup congrats")

Comprehensive check: See if Patient data is changed in the database (if Jane Doe is added)

![Patient: Database](./screenshots/patientDatabase.png?raw=true "Patient Database")


#### b. Log In + Access Patient Profile

![Patient: Login](./screenshots/patientLogin.png?raw=true "Patient Login")

![Patient: Profile](./screenshots/patientProfile.png?raw=true "Patient Profile")


#### c. Change Health Profile 

![Patient: Settings1](./screenshots/patientSettings1.png?raw=true "Patient Settings Original")

![Patient: Settings2](./screenshots/patientSettings2.png?raw=true "Patient Settings Changed")

Comprehensive check: See if Health Profile data is changed in the database (if Jane Doe's profile changed)

![Patient: Health Profile Database](./screenshots/healthProfileDatabase.png?raw=true "Health Profile Database")


#### d. Issue an Injury Report 

This page takes your current location into account and finds the hospitals closest to you. We currently only support viewing hospitals in Chicago, so if you are testing this page anywhere else, hospitals will not show up for you on the map.  

First, pick a hospital that is either the closest to you or has the lowest wait time (your preference!). 

![Patient: Map View](./screenshots/patientMapView.png?raw=true "Patient Map View")

Next, fill out the injury report form, which just requires a brief description of your injury and a selection of how you are feeling on a scale of 1 to 10. 

![Patient: Injury Report](./screenshots/patientInjuryReport.png?raw=true "Patient Injury Report")


#### e. View Past Injuries

Please note that as soon as a patient issues an injury using our map view, that injury is documented and stored in our database. Thus, injury reports appear immediately in the "View Past Injuries" view. 

![Patient: Past Injuries](./screenshots/patientPastInjuries.png?raw=true "Patient Past Injuries")


### 3. Doctor Walkthrough 

Doctors' main functionality is to just sign themselves up for SpeedER so that they will be added to our database of doctors for particular hospitals. 

#### a. Sign up part 1 

After clicking the "Doctor" button and subsequently the "Get Started" button the homepage, you will be redirected to the doctor signup page. 

Please note that doctors and medical staff members belong to the same database table, so a doctor cannot sign up as a medical staff member, and vice versa. However, a doctor, as well as a hospital administrator, can sign up as a patient because the patient database table is separate. 

In the first part of the sign up process, the doctor is just sending their information to the database so that any hospital administrator who belongs to the same hospital can verify the doctor's status and existence. 

![Doctor: Signup Part 1](./screenshots/doctorSignup.png?raw=true "Doctor Signup Part 1")

![Doctor: Signup Success](./screenshots/doctorSignupSuccess.png?raw=true "Doctor Signup Success")


#### b. Receive emailed verification code 

The doctor waits until a hospital administrator verifies them (see 4.c: Hospital Administrator.Verify Doctors below). Upon this verification, the doctor receives an email notification with a verification code.  

![Doctor: Email Verification ](./screenshots/doctorEmailVerification.png?raw=true "Doctor Email Verification")


#### c. Sign up part 2 

Now the doctor navigates back to the website and inputs the verification code. 

![Doctor: Verification ](./screenshots/doctorVerification.png?raw=true "Doctor Verification")

![Doctor: Verification Success](./screenshots/doctorVerificationSuccess.png?raw=true "Doctor Verification Success")


#### d. Receive emailed notifications with patient information

When a medical staff member assigns a doctor to a patient(see 4.d: Hospital Administrator.Assign Patients To Doctors), a doctor receives an email with the patient's name, and the patient's description of the injury.  


### 4. Hospital Administrator(also known as Medical Staff) Walkthrough 

#### a. Sign up 

After clicking the "Hospital Administrator" button and subsequently the "Get Started" button the homepage, you will be redirected to the hospital administrator signup page. 

Please note that doctors and medical staff members belong to the same database table, so a doctor cannot sign up as a medical staff member, and vice versa. However, a doctor, as well as a hospital administrator, can sign up as a patient because the patient database table is separate. 




### b. Login + Access Profile Page



### c. Verify Doctors 

A hospital administrator can review doctors' names and emails and make sure these credentials align with those of real doctors at their hospital.

![Staff: Verify Doctors](./screenshots/staffVerifyDoctors.png?raw=true "Staff Verify Doctors")

![Staff: Verify Doctors Success](./screenshots/staffVerifyDoctorsSuccess.png?raw=true "Staff Verify Doctors Success")




### d. Assign Patients to Doctors 

Please note that only one patient can be assign to one doctor. Please also check the section "Inputs that don't work too well (based on routes)"



### e. Unassign Doctors

Upon unassigning 




### 5. More Test Cases to Check 

#### General Sign Up: 

* Make sure users are added to the appropriate database table (again, please note that Hopsital Administrators and Doctors are stored in the same database table, but they have different positions)

* 


#### Assigning Patients: 


#### Verify Doctors: 

* make sure muliple doctors can be verified 

* make sure clicking on the button when no doctors are selected returns an alert pop up window telling you to choose a doctor 


#### Unassign Doctors: 

* make sure muliple doctors can be unassigned

* make sure clicking on the button when no doctors are selected returns an alert pop up window telling you to choose a doctor 


General: 

* make sure all routes lead to the correct pages 



## Testing
A good tutorial resource for Mocha can be found [here](https://github.com/mapmeld/1batch/wiki/11.-Testing-with-Mocha-and-Supertest).

To run testing, make sure you first install mocha globally.
```
npm install -g mocha
```
Following this, each test may be run individually from the root directory with the following command: 
```
mocha test/name_of_test.js
```
For example, to run the unit tests found in /test/test_patient_database.js, from the root directory of the speedER project: 
```
mocha test/test_patient_database.js
```
from which we expect the output:
```
  Testing "patient" model in MySql database (using sequelizeMockingMocha)
    ✓ Check if service (group of mocked database methods) exists
    Test the method "findAll"
      ✓ "findAll" exists
      ✓ "findAll" returns all patients in database
    Test the method "find"
      ✓ "find" exists
      ✓ "find" returns a specific patient
      ✓ "find" returns a specific patient
      ✓ "find" returns null if patient doesn't exist

  7 passing (676ms)
```

You can run all tests at once by simply doing the following:
```
mocha test
```

### Test Cases
At present, we have the following tests:
* test_authentication.js
* test_healthprofile_database.js
* test_hospital_database.js
* test_injuryreport_database.js
* test_medical_staff_authentication.js
* test_medical_staff_database.js
* test_notifications.js
* test_patient_database.js
* test_requests.js
* test_sessions.js

For completeness: speech functionality is incorporated for patient reporting of injuries, however we directly access the module's API and receive the string returned from parsing the audio.  Since this does not involve any coding on our part except for accessing the module's API (which if done incorrectly would throw an error on execution), we verified via manual testing that the received strings given specific spoken inputs corresponded; we considered this to be sufficient testing for the speech functionality.

### Tests: What They Test For

#### Test_authentication.js: 

This test suite checks to see if a patient can properly sign up using the form on the homepage. This test suite first checks to see if the proper sign up page exists (“patient/signup”). Then it checks whether a POST request will redirect to the appropriate pages (“/signupFailure” upon an unvalidated post request and “/signupSuccess” otherwise). It also checks to see if validations (like whether a field like “email” or “phoneNumber” is allowed to be null or not) are properly working.

#### Test_healthprofile_database.js: 

This test suite checks the relation between the Patient and HealthProfile models, and verifies that we can create and find unique instances of the HealthProfile model.  In this test, we verify that we can locate a given Patient’s health profile using their primary key (email address); additionally, we verify that we can find all health profiles currently in the database.

#### Test_hospital_database.js: (mocked data: /speedER/test/hospital_mocked_data.json) 

This test refers to the Sequelize mock model found in /speedER/test/lib/hospital/model.js, a mock instance of the actual database model used in speedER. The actual model on which this mock instance is based may be found in /speedER/src/server/model/models.js. For completeness, we first verify that our mocked instance of the hospital database exists, and that chai can find it (Test 1). Following this, we test that, for each instance of a “Hospital” defined by our mocked data for test_hospital_database.js, an instance with the corresponding data is found within our mocked database; this is easily verified using chai’s findAll() method, which we expect to return the exact data specified in the mocked data json file. Next, we verify through multiple tests that unique instances of the Hospital model may be located via searching for a specific parameter; this is accomplished with chai’s findByIdSpy() method, which then returns a deep copy of the object and verifies equality between the two objects for all fields. Finally, we verify that, should some data correspond to a null value (i.e., the key is not in our database), a null value is returned (as opposed to an error or uncaught exception).

#### Test_injuryreport_database.js: 

This test suite checks the relation between the Patient and InjuryReport models, and verifies that we can create and find unique instances of the Injury model.  In this test, we verify that we can locate a given Patient’s injury reports using their primary key (email address); additionally, we verify that we can find all injury reports currently in the database.

#### Test_medical_staff_authentication.js: 

This test suite verifies the functionality of our signup and login processes for the Medical Staff models.  Explicit handling for null email fields on signup and http redirects is tested, as well as invalid inputs for passwords, phone numbers and names.

#### Test_medical_staff_database.js: (mocked data: /speedER/test/medicalstaff_mocked_data.json) 

This test refers to the Sequelize mock model found in /speedER/test/lib/medical_staff/model.js, another mock instance of the actual database model used in speedER. The actual model on which this mock instance is based may be found in /speedER/src/server/model/models.js. For completeness, we first verify that our mocked instance of the hospital database exists, and that chai can find it (Test 1). Following this, we test that, for each instance of a “medical_staff” defined by our mocked data for test_medical_staff_database.js, an instance with the corresponding data is found within our mocked database; as with our hospital test method, this is easily verified using chai’s findAll() method, which we expect to return the exact data specified in the mocked data json file – i.e., all instances of medical_staff specified in our mocked data file. Next, we verify that individual instances can be retrieved through the use of the primary key, denoted by the medical_staff’s email entry; finally, we verify that searching for a key which does not exist within the database returns a null value. This concludes the testing for test_medical_staff_database.js.

#### Test_notifications.js: 

This test suite verifies that we are able to create instances of the Notifications model, and also find them.  Notifications are modeled as containers containing two unique strings and a timestamp, where the strings correspond to the addressee and the message itself; the timestamp corresponds to the time and date at which the notification was sent.  We verify that we are able to create notifications, and subsequently find specific ones associated with a specific addressee.

#### Test_patient_database.js:  (mocked data: patient_mocked_data.json)

This test refers to the Sequelize mock model found in /speedER/test/lib/patient/model.js Similar to the test_medical_staff_database.js and test_hospital_database.js, we verify that all instances defined in the mocked data file are found by chai, and we subsequently verify that we can find a specific instance through some unique identifier, specifically the patient’s email address. Finally, we verify that should the specified identifier not exist within the database, a null value is returned.

#### Test_requests.js: 

This test suite essentially checks whether our existing routes map to views. We are checking to see if we can send a “GET” request and receive the appropriate page in response (expect an HTTP 200 status code).

#### Test_sessions.js: 

This test suite checks whether cookies are set when a user signs up or logs in. We are checking for persistence by searching for a cookie. We want persistence so that users don’t have to send their credentials to every page they navigate to.


### Suggested Test Cases
To add tests to the suite we have already prepared, fields within the mockup databases (.json files) may be altered, and the tests rerun to make sure that they fail. In general, modifying our existing tests to produce a slightly different expected output and then checking for that output is a good way to supplement our current test suite.

You can also perform acceptance testing on any of the routes available -- you can see the app.js file for more details. The best way to perform acceptance testing is to simply create new patients, hospital admins, doctors, etc. Once you sign these users up, you can check your database to confirm that these users were actually created. You can also test specific functionalities. For example, you can test the doctor invitation functionality by first signing up a doctor, navigating to your hospital administrator account, verifying the doctor you just signed up, checking to see that a notification email was sent to the doctor about an invitation code, and then using the invitation code to confirm the doctor. 

## Inputs that don't work too well (routes listed below)

### General Notes: 

- When a user logs out, they are redirected to the home page. 

#### /assignPatients: 

(Medical Staff)

- Because of how drag events occur, patients can currently be shifted to different (discomfort) levels (on the assignPatients page) via the medical staff member dragging them to different Patient levels. This functionality should not be supported, but we didn’t have time to fix the issue. Please make note that if you shift a patient to another Patient Level (different from what they were originally listed under) and then assign this patient to a doctor, in the database, the patient’s injury report will still list the value of the original patient level. 

- In addition, due to the effects of dragging and setting up the dragging events, patients can be dragged to the doctors side, and doctors can be dragged to the patients side. This is a fairly big bug, but we do distinguish doctors and patients with different colors. However, our assign patients box makes sure that the inputs are 1 doctor and 1 patient -- this checking is fairly robust. 

- We realize that the design format we have set up for the "assignPatients" page isn't the most optimal in cases where there are a huge number of incoming patients because we just see a stack of patient names and injuries. If a medical staff member wanted to move a patient from the lowest level (say "Levels 1 & 2"), then the staff member would probably have a difficult time moving that patient directly to the assign patients box (because the assign patients box would be so far above). The only workaround this is moving the patient up to a higher level and then inserting the patient into the assign patient box. This is another reason we allowed for patients to be shifted to different levels without changing their information. 

#### /doctorSignup: 

(Doctor)

- Doctors can verify themselves as many times as possible given the proper code. We don't throw an error if they have already verified themselves. 

#### /hospitalLogin: 

- a medical staff member cannot sign up as a doctor (medical staff members and doctors are stored in the same “MedicalStaff” database, but they have distinct position values) —> note that a medical staff administrator cannot sign up as a doctor using the same email.

#### /report: 

(Patient)

- We currently only store information about local Chicago hospitals in our database, and these hospitals are the only ones that show up on the map view. You will not be able to find all hospitals in Chicago and will not be able to view other hospitals anywhere outside of Chicago. 

- Our speech recognition feature makes use of webkit, which is only supported on the Chrome browser. Thus, our speech recognition will fail on other browsers. 

- Since we are scraping from a real dataset, some of the information on hospital wait times is incomplete. Therefore, in this map view, you may see some hospitals that say “Expected wait: mins” 

- In the case where a patient files multiple injury reports at the same time, only the latest injury report is relevant and is sent to the corresponding hospital. Note that a medical staff member at that hopsital assigns that incoming patient (say Patient A) to a doctor once the medical staff member receives the report. Because of how our system works, a patient should not issue another injury reports until a hospital unassigns the doctor corresponding to Patient A, which we assume happens exactly when the treatment is finished. If Patient A tries to file another injury report while they are currently assigned to a doctor, they will be able to do so, but the corresponding hospital will not receive that patient's information. 

- Note that every report a patient confirms is automatically added to their past injuries page, even if they didn't go to the hospital they specified (if they filed multiple reports around the same time)


### Note about errors 

If you see errors like the following in the terminal, and if the website itself does not throw an error, please ignore these console errors. We are printing out various errors in the console based on user navigation just as a reference, but we do handle most of these errors via regex checks and alerts on the client side. 

```
undefined
TypeError: Cannot read property 'authenticationCode' of null
    at Model.<anonymous> (/Users/asitwala/speedER/speedER/app.js:73:20)
    at Model.tryCatcher (/Users/asitwala/speedER/speedER/node_modules/bluebird/js/release/util.js:16:23)
    at Promise._settlePromiseFromHandler (/Users/asitwala/speedER/speedER/node_modules/bluebird/js/release/promise.js:510:31)
    at Promise._settlePromise (/Users/asitwala/speedER/speedER/node_modules/bluebird/js/release/promise.js:567:18)
    at Promise._settlePromise0 (/Users/asitwala/speedER/speedER/node_modules/bluebird/js/release/promise.js:612:10)
    at Promise._settlePromises (/Users/asitwala/speedER/speedER/node_modules/bluebird/js/release/promise.js:691:18)
    at Async._drainQueue (/Users/asitwala/speedER/speedER/node_modules/bluebird/js/release/async.js:133:16)
    at Async._drainQueues (/Users/asitwala/speedER/speedER/node_modules/bluebird/js/release/async.js:143:10)
    at Immediate.Async.drainQueues (/Users/asitwala/speedER/speedER/node_modules/bluebird/js/release/async.js:17:14)
    at runCallback (timers.js:651:20)
    at tryOnImmediate (timers.js:624:5)
    at processImmediate [as _immediateCallback] (timers.js:596:5)
undefined
```


## What is Implemented
In Iteration 2, we focused mainly on integrating the frontend and backend parts of our application. We implemented the following:

1. Backend

  * Database Model in Sequelize

  * User Authentication System (using passport.js)

  * Logged in/Logged out Session Persistence

  * Speech Recognition Logic and Functionality (available only for Google Chrome users)
   
  * Model associations and database queries

2. Frontend Views (wireframes for these in Design folder)

  * Patient

    * Login/Register screen

    * Profile Page (which contains links to the Patient routes below)

    * Health Profile

    * Past Injuries

    * Map View (which includes an Injury Report view)

  * Medical Staff (Hospital)
    
    * Login/Register screen
    
    * Profile Page (which contains links to the Medical Staff routes below)

    * Login/Register screen

    * Profile Page (which contains links to the Medical Staff routes below)

    * Assign Patients En Route to Doctors

    * Verify Doctors (after doctors have signed up)

    * Unassign Doctors (unassign doctors after they have treated a patient)
    
    * Unassign Doctors (unassign doctors after they have treated a patient)
    
  * Doctor

    * Sign Up (note that doctors just sign up and later enter a verification code, but do not use the site after)

3. Product Design (see Design folder)

  * Patient user interface wireframes

  * Hospital user interface wireframes

4. Integration of Frontend and Backend

5. Testing (see above)

## Division of Labor
*Adam Freymiller* - App framework setup, user authentication, session persistence, testing, debugging

*Amy Sitwala* - User authentication system, session persistence, testing, debugging, frontend views, and frontend-backend integration

*Anand Kannappan* - Speech recognition, data aggregation, debugging, documentation

*Brian Keene* - Navbar, user authentication, testing

*Connor Soltas* - Maps interface, design mockups, frontend patient view - injury report screen

*Forrest Sill* - Frontend hospital view - list of patients en route screen

*Maitreyi Nabar* - Frontend patient view, login/register screen, navbar

*Neal Jochmann* - Frontend hospital view, notifications screen 

*Steven Hernandez* - Session persistence, user authentication, testing, and notifications setup

## Notes

- In iteration 2, we have taken steps toward achieving the goal we set at the end of iteration 1: to more smoothly integrate the front end and back end of our application. Our application has incorporated Google Maps API and linked User and Hospital signup to our MySQL back end. 

- This currently works for hospitals in Chicago, but it wouldn't be difficult to add more hospitals onto the mapview since we already have all of the data. The main issue is that when we add hospitals to the database, so also geocode them, so that our mapview knows the exact coordinates of each hospital. However, this process can take up to 2 seconds for each hospital. 

- The email field for the hospital administrator and the doctor can't be the same since they are both in the same table in the database. 

- We have also made aesthetic changes to specific view files, added basic graphics, and begun streamlining the aesthetic of speedER. Of course, this process is incomplete and will be a topic of focus for further iterations.

- As stated above, testing has been substantially expanded. 

- All Mock database models and mock tests were verified to have a 1:1 correspondence with the actual Sequelize models used in our MySQL database.

- Credits for assorted CSS sheets used to make the speedER website:
  * https://www.w3schools.com/html/html5_draganddrop.asp
  * bootply.com/EOgJSIzPGS
  
