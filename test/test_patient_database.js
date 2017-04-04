// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

'use strict'; // allows for "let" statements 

var Mocha = require('mocha'); 

var mocha = new Mocha({
    reporter: 'json'
});

var file1 = './lib/database';
var file2 = './lib/patient/service'; 
var file3 = './lib/patient/model';

delete require.cache[file1];
mocha.addFile(file1);

delete require.cache[file2];
mocha.addFile(file2);

delete require.cache[file3];
mocha.addFile(file3);

// load required packages
const chai = require('chai');
const sinon = require('sinon');
const path = require('path');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;

describe('Testing "patient" model in MySql database (using sequelizeMockingMocha)', function () {
    const Database = require('./lib/database');
    const PatientService = require('./lib/patient/service');
    const PatientModel = require('./lib/patient/model');

    // Basic configuration: create a sinon sandbox for testing
    // a sandbox is a means of setting and cleaning up tests via sinon 
    let sandbox = null;

    // mocha's way of setting preconditions
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    // mocha's way of setting up postconditions (basically cleaning up code)
    afterEach(function () {
        sandbox && sandbox.restore();
    });

    // Load in fake data for the patients via a mocked database instance
    sequelizeMockingMocha(
        Database.getInstance(),
        path.resolve(path.join(__dirname, './patient_mocked_data.json')),
        { 'logging': false }
    );

    // TEST 1
    // Use "chai expect" to see if service exists
    // a service is essentially a group of methods/functions you can call on the mocked database 
    it('Check if service (group of mocked database methods) exists', function () {
       chai.expect(PatientService).to.exist;
    });

    // TEST 2
    describe('Test the method "findAll"', function () {
        it('"findAll" exists', function () {
           chai.expect(PatientService.findAll).to.exist;
        });

        // TEST 3
        // if the method "findAll" exists, then call it 
        it('"findAll" returns all patients in database', function () {
            return PatientService
                .findAll()
                .then(function (patients) {
                    // chai performs a deep equality check (on objects)

                    chai.expect(patients).deep.equals([
                        {
                        "name": "Amy Sitwala",
                        "email": "asitwala17@gmail.com",
                        "password": "$2a$10$C.GCDhnL30z66hsKB975ke4gRDQARDNOcBuuLOddFByYlwbbnF7k6",
                        "salt": "$2a$10$C.GCDhnL30z66hsKB975ke",
                        "phoneNumber": "6262218836",
                        "injury": "I broke my arm",
                        "age": 21,
                        "isVerified": null, 
                        "chosenHospital": 2,
                        "supervisingDoctor": "Dwayne Johnson",
                        "resetPasswordToken": null,
                        "resetPasswordExpires": null
                        },
                        {
                        "name": "Second Entry",
                        "email": "second_entry@gmail.com",
                        "password": "$2a$10$7dEYxDiW6aZVgu9bVV/WV.NsXjrshMUxnjiGM2pd/5jPse9ixVtPu",
                        "salt": "$2a$10$7dEYxDiW6aZVgu9bVV/WV.",
                        "phoneNumber": "6265065375",
                        "injury": "I fractured my femur",
                        "age": 65,
                        "isVerified": 1, 
                        "chosenHospital": 1,
                        "supervisingDoctor": "Anand Kannappan",
                        "resetPasswordToken": null,
                        "resetPasswordExpires": null
                        },
                        {
                        "name": "Testing Repetition and Dates",
                        "email": "imadoglover4@gmail.com",
                        "password": "$2a$10$kHYFfjAXSEuPOKFIeoZOJuGZIG8I6INITkAX7xnr/98cWH7/SfZNO",
                        "salt": "$2a$10$kHYFfjAXSEuPOKFIeoZOJu",
                        "phoneNumber": "6262248614",
                        "injury": "I have a stomach ache",
                        "age": 40,
                        "isVerified": 0, 
                        "chosenHospital": 10,
                        "supervisingDoctor": "James Bond",
                        "resetPasswordToken": null,
                        "resetPasswordExpires": "2017-04-02 00:00:00.000 +00:00"
                        },
                        {
                        "name": "Testing Password Tokens",
                        "email": "kevis16@yahoo.com",
                        "password": "INCLUDESALTHEREshouldBeEncryptedValue",
                        "salt": "INCLUDESALTHERE", 
                        "phoneNumber": "6268337225",
                        "injury": "I have a stomach ache",
                        "age": 40,
                        "isVerified": null, 
                        "chosenHospital": null,
                        "supervisingDoctor": null,
                        "resetPasswordToken": "randomsetofcharacters",
                        "resetPasswordExpires": "2017-02-27 00:00:00.000 +00:00"
                        }
                    ])
                });
        });
    });

    // TEST 4 
    describe('Test the method "find"', function () {
        it('"find" exists', function () {
            chai.expect(PatientService.find).to.exist;
        });

        // TEST 5 
        // if the method "find" exists, then call it
        it('"find" returns a specific patient', function () {
            let findByIdSpy = sandbox.spy(PatientModel, 'findById');

            return PatientService
                .find('asitwala17@gmail.com')
                .then(function (patient) {
                    chai.expect(findByIdSpy.called).to.be.true;
                    chai.expect(findByIdSpy.calledOnce).to.be.true;
                    chai.expect(findByIdSpy.calledWith('asitwala17@gmail.com')).to.be.true;

                    // chai performs a deep equality check (on objects)
                    chai.expect(patient).deep.equals({
                        "name": "Amy Sitwala",
                        "email": "asitwala17@gmail.com",
                        "password": "$2a$10$C.GCDhnL30z66hsKB975ke4gRDQARDNOcBuuLOddFByYlwbbnF7k6",
                        "salt": "$2a$10$C.GCDhnL30z66hsKB975ke",
                        "phoneNumber": "6262218836",
                        "injury": "I broke my arm",
                        "age": 21,
                        "isVerified": null, 
                        "chosenHospital": 2,
                        "supervisingDoctor": "Dwayne Johnson",
                        "resetPasswordToken": null,
                        "resetPasswordExpires": null
                    });
                });
        });

        // TEST 6
        it('"find" returns a specific patient', function () {
            let findByIdSpy = sandbox.spy(PatientModel, 'findById');

            return PatientService
                .find('second_entry@gmail.com')
                .then(function (patient) {
                    chai.expect(findByIdSpy.called).to.be.true;
                    chai.expect(findByIdSpy.calledOnce).to.be.true;
                    chai.expect(findByIdSpy.calledWith('second_entry@gmail.com')).to.be.true;

                    // chai performs a deep equality check (on objects)
                    chai.expect(patient).deep.equals({
                        "name": "Second Entry",
                        "email": "second_entry@gmail.com",
                        "password": "$2a$10$7dEYxDiW6aZVgu9bVV/WV.NsXjrshMUxnjiGM2pd/5jPse9ixVtPu",
                        "salt": "$2a$10$7dEYxDiW6aZVgu9bVV/WV.",
                        "phoneNumber": "6265065375",
                        "injury": "I fractured my femur",
                        "age": 65,
                        "isVerified": 1, 
                        "chosenHospital": 1,
                        "supervisingDoctor": "Anand Kannappan",
                        "resetPasswordToken": null,
                        "resetPasswordExpires": null
                    });
                });
        });

        // TEST 7
        // if patient doesn't exist 
        it('"find" returns null if patient doesn\'t exist', function () {
            return PatientService
                .find(-1)
                .then(function (patient) {
                    chai.expect(patient).to.be.null;
                });
        });
    });
});
