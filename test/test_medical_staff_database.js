// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

'use strict'; // allows for "let" statements 

// load required packages
const chai = require('chai');
const sinon = require('sinon');
const path = require('path');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;

describe('Testing "MedicalStaff" model in MySql database (using sequelizeMockingMocha)', function () {
    const Database = require('./lib/database');
    const MedicalStaffService = require('./lib/medical_staff/service');
    const MedicalStaffModel = require('./lib/medical_staff/model');

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

    // Load in fake data for the medical staff via a mocked database instance
    sequelizeMockingMocha(
        Database.getInstance(),
        path.resolve(path.join(__dirname, './medicalstaff_mocked_data.json')),
        { 'logging': false }
    );

    // TEST 1
    // Use "chai expect" to see if service exists
    // a service is essentially a group of methods/functions you can call on the mocked database 
    it('Check if service (group of mocked database methods) exists', function () {
       chai.expect(MedicalStaffService).to.exist;
    });

    // TEST 2
    describe('Test the method "findAll"', function () {
        it('"findAll" exists', function () {
           chai.expect(MedicalStaffService.findAll).to.exist;
        });

        // TEST 3
        // if the method "findAll" exists, then call it 
        it('"findAll" returns all medical staff members in database', function () {
            return MedicalStaffService
                .findAll()
                .then(function (medical_staff) {
                    // chai performs a deep equality check (on objects)
                    chai.expect(medical_staff).deep.equals([
                        {
                        'name': 'John Doe',
                        'email': 'johndoe@gmail.com',
                        'password': 'abc123',
                        'salt': 'fFmKydV2lEizQit7uRJAtiUldDc9ak3V',
                        'phoneNumber': '(312) 867-5309',
                        'position': 'Cardiothoracic Surgery',
                        'active': 1,
                        'unassigned': 0,
                        'resetPasswordToken': null,
                        'resetPasswordExpires': null
                        },
                        {
                        'name': 'Amy Sitwala',
                        'email': 'asitwala@gmail.com',
                        'password': 'superSecurePassWordHere',
                        'salt': '9IEAGqO4zgDIFeswTbKlGr1Scyu8UeTAzRmpAXGcaH',
                        'phoneNumber': '(312) 444-5444',
                        'position': 'Neurosurgeon',
                        'active': 0,
                        'unassigned': 1,
                        'resetPasswordToken': null,
                        'resetPasswordExpires': "2017-04-02 00:00:00.000 +00:00"
                        }, 
                        {
                        'name': 'Forrest Sill',
                        'email': 'fsill@gmail.com',
                        'password': 'UChicagoMaroons',
                        'salt': 'jk4q34H2OxF5Jwj76B6TeU8hZ3pKd7vkAdGU9X8',
                        'phoneNumber': '(772) 904-2309',
                        'position': 'General Practitioner',
                        'active': 1,
                        'unassigned': 1,
                        'resetPasswordToken': "thisisarandomsetofcharacters",
                        'resetPasswordExpires': null
                        }, 
                        {
                        'name': 'John Gonzalez',
                        'email': 'iwishthefalconswon@gmail.com',
                        'password': 'superbowl52wastheworst',
                        'salt': 'NzmHU4sUK1kCqrHouy576N7Ny94acaso5WDZFvk2RxHA',
                        'phoneNumber': '(923) 237-3109',
                        'position': 'General Practitioner',
                        'active': 1,
                        'unassigned': 0,
                        'resetPasswordToken': "thisisarandomsetofcharacterspart2",
                        'resetPasswordExpires': "2025-04-10 00:00:00.000 +00:00"
                        },
                        {
                        'name': 'Idont Workhere',
                        'email': 'gopackgo@gmail.com',
                        'password': 'abc122292293',
                        'salt': 'LejclkzFp7fuYaGrHg11cCH9sG3zyawijWcU0o4ue',
                        'phoneNumber': '(554) 999-9999',
                        'position': "",
                        'active': 0,
                        'unassigned': 0,
                        'resetPasswordToken': null,
                        'resetPasswordExpires': null
                        }
                    ])
                });
        });
    });

    // TEST 4 
    describe('Test the method "find"', function () {
        it('"find" exists', function () {
            chai.expect(MedicalStaffService.find).to.exist;
        });

        // TEST 5 
        // if the method "find" exists, then call it
        it('"find" returns a specific medical staff member', function () {
            let findByIdSpy = sandbox.spy(MedicalStaffModel, 'findById');

            return MedicalStaffService
                .find('asitwala@gmail.com')
                .then(function (ms) {
                    chai.expect(findByIdSpy.called).to.be.true;
                    chai.expect(findByIdSpy.calledOnce).to.be.true;
                    chai.expect(findByIdSpy.calledWith('asitwala@gmail.com')).to.be.true;

                    // chai performs a deep equality check (on objects)
                    chai.expect(ms).deep.equals({
                        'name': 'Amy Sitwala',
                        'email': 'asitwala@gmail.com',
                        'password': 'superSecurePassWordHere',
                        'salt': '9IEAGqO4zgDIFeswTbKlGr1Scyu8UeTAzRmpAXGcaH',
                        'phoneNumber': '(312) 444-5444',
                        'position': 'Neurosurgeon',
                        'active': 0,
                        'unassigned': 1,
                        'resetPasswordToken': null,
                        'resetPasswordExpires': "2017-04-02 00:00:00.000 +00:00"
                    });
                                   
              });
        });

        // TEST 6
        it('"find" returns a specific medical staff member', function () {
            let findByIdSpy = sandbox.spy(MedicalStaffModel, 'findById');

            return MedicalStaffService
                .find('gopackgo@gmail.com')
                .then(function (ms) {
                    chai.expect(findByIdSpy.called).to.be.true;
                    chai.expect(findByIdSpy.calledOnce).to.be.true;
                    chai.expect(findByIdSpy.calledWith('gopackgo@gmail.com')).to.be.true;

                    // chai performs a deep equality check (on objects)
                    chai.expect(ms).deep.equals({
                        'name': 'Idont Workhere',
                        'email': 'gopackgo@gmail.com',
                        'password': 'abc122292293',
                        'salt': 'LejclkzFp7fuYaGrHg11cCH9sG3zyawijWcU0o4ue',
                        'phoneNumber': '(554) 999-9999',
                        'position': "",
                        'active': 0,
                        'unassigned': 0,
                        'resetPasswordToken': null,
                        'resetPasswordExpires': null
                    });
                });
        });

        // TEST 7
        // if medical staff member doesn't exist 
        it('"find" returns null if medical staff member doesn\'t exist', function () {
            return MedicalStaffService
                .find(-1)
                .then(function (ms) {
                    chai.expect(ms).to.be.null;
                });
        });
    });
});
