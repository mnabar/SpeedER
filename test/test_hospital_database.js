// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

'use strict'; // allows for "let" statements 

// load required packages
const chai = require('chai');
const sinon = require('sinon');
const path = require('path');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;

describe('Testing "Hospital" model in MySql database (using sequelizeMockingMocha)', function () {
    const Database = require('./lib/database');
    const HospitalService = require('./lib/hospital/service');
    const HospitalModel = require('./lib/hospital/model');

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
        path.resolve(path.join(__dirname, './hospital_mocked_data.json')),
        { 'logging': false }
    );

    // TEST 1
    // Use "chai expect" to see if service exists
    // a service is essentially a group of methods/functions you can call on the mocked database 
    it('Check if service (group of mocked database methods) exists', function () {
       chai.expect(HospitalService).to.exist;
    });

    // TEST 2
    describe('Test the method "findAll"', function () {
        it('"findAll" exists', function () {
           chai.expect(HospitalService.findAll).to.exist;
        });

        // TEST 3
        // if the method "findAll" exists, then call it 
        it('"findAll" returns all hospitals in database', function () {
            return HospitalService
                .findAll()
                .then(function (hospital) {
                    // chai performs a deep equality check (on objects)
                    chai.expect(hospital).deep.equals([
                        {
                        "name": "University of Chicago Pritzker",
                        "id": 1,
                        "username": "frankie",
                        "password": "abc123abc",
                        "salt": "MH1iynr3uIZzXcGVn6EaDScEevqK3Gg",
                        "phoneNumber": "(312) 965-5309",
                        "email": "uchicago@uchicago.med.edu",
                        "address": null,
                        "city": null,
                        "state": null,
                        "zipCode": null,
                        "waitMins": null,
                        "geometry": null,
                        "resetPasswordToken": null,
                        "resetPasswordExpires": null
                        },
                        {
                        "name": "Gotham Medical",
                        "id": 2,
                        "username": "joker",
                        "password": "batmanrules93",
                        "salt": "I0hUFyLVEffL2rfDvEl3cg7M761UEUhTb",
                        "phoneNumber": "(315) 238-1322",
                        "email": "joker@gotham.com",
                        "address": null,
                        "city": null,
                        "state": null,
                        "zipCode": null,
                        "waitMins": null,
                        "geometry": "29.12345928374871 , 48.203498018293",
                        "resetPasswordToken": null,
                        "resetPasswordExpires": null
                        }, 
                        {
                        "name": "CVS",
                        "id": 3,
                        "username": "jake",
                        "password": "jakefromstatefarm",
                        "salt": "i8bwTEgPC2klcSFz8qPOEn9IcxOshL3d8iIup",
                        "phoneNumber": "(123) 438-1322",
                        "email": "jake@statefarm.com",
                        "address": null,
                        "city": null,
                        "state": null,
                        "zipCode": null,
                        "waitMins": null,
                        "geometry": null,
                        "resetPasswordToken": "iminthewrongcommercial",
                        "resetPasswordExpires": "2017-02-27 00:00:00.000 +00:00"
                        }
                    ])
                });
        });
    });

    // TEST 4 
    describe('Test the method "find"', function () {
        it('"find" exists', function () {
            chai.expect(HospitalService.find).to.exist;
        });

        // TEST 5 
        // if the method "find" exists, then call it
        it('"find" returns a specific hospital member', function () {
            let findByIdSpy = sandbox.spy(HospitalModel, 'findById');

            return HospitalService
                .find(1)
                .then(function (hospital) {
                    chai.expect(findByIdSpy.called).to.be.true;
                    chai.expect(findByIdSpy.calledOnce).to.be.true;
                    chai.expect(findByIdSpy.calledWith(1)).to.be.true;

                    // chai performs a deep equality check (on objects)
                    chai.expect(hospital).deep.equals({
                        "name": "University of Chicago Pritzker",
                        "id": 1,
                        "username": "frankie",
                        "password": "abc123abc",
                        "salt": "MH1iynr3uIZzXcGVn6EaDScEevqK3Gg",
                        "phoneNumber": "(312) 965-5309",
                        "email": "uchicago@uchicago.med.edu",
                        "address": null,
                        "city": null,
                        "state": null,
                        "zipCode": null,
                        "waitMins": null,
                        "geometry": null,
                        "resetPasswordToken": null,
                        "resetPasswordExpires": null
                    });
                                   
              });
        });

        // TEST 6
        it('"find" returns a specific hospital', function () {
            let findByIdSpy = sandbox.spy(HospitalModel, 'findById');

            return HospitalService
                .find(3)
                .then(function (ms) {
                    chai.expect(findByIdSpy.called).to.be.true;
                    chai.expect(findByIdSpy.calledOnce).to.be.true;
                    chai.expect(findByIdSpy.calledWith(3)).to.be.true;

                    // chai performs a deep equality check (on objects)
                    chai.expect(ms).deep.equals({
                        "name": "CVS",
                        "id": 3,
                        "username": "jake",
                        "password": "jakefromstatefarm",
                        "salt": "i8bwTEgPC2klcSFz8qPOEn9IcxOshL3d8iIup",
                        "phoneNumber": "(123) 438-1322",
                        "email": "jake@statefarm.com",
                        "address": null,
                        "city": null,
                        "state": null,
                        "zipCode": null,
                        "waitMins": null,
                        "geometry": null,
                        "resetPasswordToken": "iminthewrongcommercial",
                        "resetPasswordExpires": "2017-02-27 00:00:00.000 +00:00"
                    });
                });
        });

        // TEST 7
        // if hospital doesn't exist 
        it('"find" returns null if hospital doesn\'t exist', function () {
            return HospitalService
                .find(-1)
                .then(function (ms) {
                    chai.expect(ms).to.be.null;
                });
        });
    });
});
