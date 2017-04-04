// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

'use strict'; // allows for "let" statements 

// load required packages
const chai = require('chai');
const sinon = require('sinon');
const path = require('path');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;

describe('Testing "HealthProfile" model in MySql database (using sequelizeMockingMocha)', function () {
    const Database = require('./lib/database');
    const HealthProfileService = require('./lib/health_profile/service');
    const HealthProfileModel = require('./lib/health_profile/model');

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
        path.resolve(path.join(__dirname, './health_profile_mocked_data.json')),
        { 'logging': false }
    );

    // TEST 1
    // Use "chai expect" to see if service exists
    // a service is essentially a group of methods/functions you can call on the mocked database 
    it('Check if service (group of mocked database methods) exists', function () {
       chai.expect(HealthProfileService).to.exist;
    });

    // TEST 2
    describe('Test the method "findAll"', function () {
        it('"findAll" exists', function () {
           chai.expect(HealthProfileService.findAll).to.exist;
        });

        // TEST 3
        // if the method "findAll" exists, then call it 
        it('"findAll" returns all health profiles in database', function () {
            return HealthProfileService
                .findAll()
                .then(function (hp) {
                    // chai performs a deep equality check (on objects)
                    chai.expect(hp).deep.equals([
                        {
                           "age": 21,
                           "height": 68,
                           "weight": 102,
                           "sex": "F",
                           "InsuranceProvider": "BlueCrossBlueShield",
                           "prescriptions": null,
                           "nonPrescribedDrugs": null,
                           "allergies": "amoxicillin",
                           "priorOperations": "fractured arm repair",
                           "email": "asitwala17@gmail.com",
                           "id": 1
                        },
                        {
                            "age": 65,
                            "height": 73,
                            "weight": 160,
                            "sex": "M",
                            "InsuranceProvider": "HIPPO",
                            "prescriptions": null,
                            "nonPrescribedDrugs": "diphenhydramine",
                            "allergies": null,
                            "priorOperations": null,
                            "email": "second_entry@gmail.com",
                            "id": 2
                        }
                    ])
                });
        });
    });

    // TEST 4 
    describe('Test the method "findById"', function () {
        it('"findById" exists', function () {
            chai.expect(HealthProfileService.findById).to.exist;
        });

        // TEST 5 
        // if the method "find" exists, then call it
        it('"findById" returns  belonging to a specific patient', function () {
            let findByIdSpy = sandbox.spy(HealthProfileModel, 'findById');

            return HealthProfileService
                .findById("asitwala17@gmail.com")
                .then(function (hp) {
                    // chai performs a deep equality check (on objects)
                    chai.expect(hp).deep.equals(
                        {
                            "age": 21,
                            "height": 68,
                            "weight": 102,
                            "sex": "F",
                            "InsuranceProvider": "BlueCrossBlueShield",
                            "prescriptions": null,
                            "nonPrescribedDrugs": null,
                            "allergies": "amoxicillin",
                            "priorOperations": "fractured arm repair",
                            "email": "asitwala17@gmail.com",
                            "id": 1
                        }
                    )
                });
        });

        // TEST 6
        // if patient doesn't exist 
        it('"findById" returns null if patient doesn\'t exist', function () {
            return HealthProfileService
                .findById(-1)
                .then(function (ir) {
                    chai.expect(ir).to.be.null;
                });
        });
    });
});