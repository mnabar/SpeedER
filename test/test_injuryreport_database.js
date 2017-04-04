// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

'use strict'; // allows for "let" statements 

// load required packages
const chai = require('chai');
const sinon = require('sinon');
const path = require('path');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;

describe('Testing "InjuryReport" model in MySql database (using sequelizeMockingMocha)', function () {
    const Database = require('./lib/database');
    const InjuryReportService = require('./lib/injury_report/service');
    const InjuryReportModel = require('./lib/injury_report/model');

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

    // Load in fake data for the hospital via a mocked database instance
    sequelizeMockingMocha(
        Database.getInstance(),
        path.resolve(path.join(__dirname, './injury_patient_mocked_data.json')),
        { 'logging': false }
    );

    // TEST 1
    // Use "chai expect" to see if service exists
    // a service is essentially a group of methods/functions you can call on the mocked database 
    it('Check if service (group of mocked database methods) exists', function () {
       chai.expect(InjuryReportService).to.exist;
    });

    // TEST 2
    describe('Test the method "findAll"', function () {
        it('"findAll" exists', function () {
           chai.expect(InjuryReportService.findAll).to.exist;
        });

        // TEST 3
        // if the method "findAll" exists, then call it 
        it('"findAll" returns all injury reports in database', function () {
            return InjuryReportService
                .findAll()
                .then(function (injuryreport) {
                    // chai performs a deep equality check (on objects)
                    chai.expect(injuryreport).deep.equals([
                        {
                            "id" : 1,
                            "description": "broken arm",
                            "discomfortLevel": 5,
                            "timeFiled": "2016-07-07 09:01:35.000 +00:00",
                            "timeInjured": "2016-05-07 02:22:40.000 +00:00",
                            "fk_email": "second_entry@gmail.com",
                            "PatientEmail": null
                        },
                        {
                            "id" : 2,
                            "description": "sprained wrist",
                            "discomfortLevel": 2,
                            "timeFiled": "2017-01-12 07:24:15.000 +00:00",
                            "timeInjured": "2016-11-19 02:52:23.000 +00:00",
                            "fk_email": "second_entry@gmail.com",
                            "PatientEmail": null
                        },
                        {   
                            "id" : 3,
                            "description": "laceration",
                            "discomfortLevel": 3,
                            "timeFiled": "2017-01-12 07:24:15.000 +00:00",
                            "timeInjured": "2016-11-19 02:52:23.000 +00:00",
                            "fk_email":  "asitwala17@gmail.com",
                            "PatientEmail": null
                        }
                    ])
                });
        });
    });

    // TEST 4 
    describe('Test get injury reports for specific email', function () {
        it('"find" exists', function () {
            chai.expect(InjuryReportService.findAll).to.exist;
        });

        // TEST 5 
        // if the method "find" exists, then call it
        it('"find" (via InjuryReportService) returns all injury reports belonging to a specific patient', function() {
            return InjuryReportService
                .find("second_entry@gmail.com")
                .then(function (injuryreport) {
                    // chai performs a deep equality check (on objects)
                    chai.expect(injuryreport).deep.equals([
                        {
                            "id" : 1,
                            "description": "broken arm",
                            "discomfortLevel": 5,
                            "timeFiled": "2016-07-07 09:01:35.000 +00:00",
                            "timeInjured": "2016-05-07 02:22:40.000 +00:00",
                            "fk_email": "second_entry@gmail.com",
                            "PatientEmail": null
                        },
                        {
                            "id" : 2,
                            "description": "sprained wrist",
                            "discomfortLevel": 2,
                            "timeFiled": "2017-01-12 07:24:15.000 +00:00",
                            "timeInjured": "2016-11-19 02:52:23.000 +00:00",
                            "fk_email": "second_entry@gmail.com",
                            "PatientEmail": null
                        }
                    ])
                });
        });


        it('"find" (via InjuryReportModel) returns all injury reports belonging to a specific patient', function() {
            return InjuryReportModel.findAll({where: {fk_email: "asitwala17@gmail.com"}})
                .then(function (injuryreport) {
                    // chai performs a deep equality check (on objects)
                    chai.expect(injuryreport).deep.equals([
                        {
                            "id" : 3,
                            "description": "laceration",
                            "discomfortLevel": 3,
                            "timeFiled": "2017-01-12 07:24:15.000 +00:00",
                            "timeInjured": "2016-11-19 02:52:23.000 +00:00",
                            "fk_email":  "asitwala17@gmail.com",
                            "PatientEmail": null
                        }
                    ])
                });
        });

        // TEST 6
        // if patient doesn't exist 
        it('"find" (via InjuryReportService) returns null if patient doesn\'t exist', function () {
            return InjuryReportService
                .find("not_existing_email@gmail.com")
                .then(function (injuryreport) {
                    chai.expect(injuryreport).to.be.empty;
                });
        });
    });
});
