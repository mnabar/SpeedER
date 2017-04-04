// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

'use strict'; // allows for "let" statements 
var Mocha = require('mocha'); 

var mocha = new Mocha({
    reporter: 'json'
});

var file1 = './lib/database';
var file2 = './lib/notification/service'; 
var file3 = './lib/notification/model';

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

describe('Testing "Notifications" model in MySql database (using sequelizeMockingMocha)', function () {
    const Database = require('./lib/database');
    const NotificationService = require('./lib/notification/service');
    const NotificationModel = require('./lib/notification/model');

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
        path.resolve(path.join(__dirname, './notifications_mocked_data.json')),
        { 'logging': false }
    ); 

    // TEST 1
    // Use "chai expect" to see if service exists
    // a service is essentially a group of methods/functions you can call on the mocked database 
    it('Check if service (group of mocked database methods) exists', function () {
       chai.expect(NotificationService).to.exist;
    });

    // TEST 2
    describe('Test the method "findAll"', function () {
        it('"findAll" exists', function () {
           chai.expect(NotificationService.findAll).to.exist;
        });
      /* TEST 3
       * If the method findaAll exists, then call it, and verify mathching!
       */
        it('"findAll" returns all patients in database', function () {
            return NotificationService
                .findAll()
                .then(function (notifications) {
                    // chai performs a deep equality check (on objects)

                    chai.expect(notifications).deep.equals([
                      {
                        "id": 1,
                        "medic": "David Beckham",
                        "message": "Someone has a broken arm",
                        "sendDate": "2017-04-02 00:00:00.000 +00:00"
                      },
                      {
                        "id": 2,
                        "medic": "Donald Trump",
                        "message": "I prefer my patients uninjured",
                        "sendDate": "2015-01-01 21:32:40.900 +00:00"
                      },
                      {
                        "id": 3,
                        "medic": "John Smith",
                        "message": "Brain aneurysm in room 501",
                        "sendDate": "2016-11-22 07:21:00.032 +00:00"
                      },
                      {
                        "id": 4,
                        "medic": "Harry Potter",
                        "message": "Head laceration. Possible scarring",
                        "sendDate": "2016-05-08 11:28:05.276 +00:00"
                      },
                      {
                        "id": 5,
                        "medic": "Jack Kevorkian",
                        "message": "Broken hip",
                        "sendDate": "2013-05-06 02:53:19.837 +00:00"
                      }
                    ])
                });
        });
    });
    describe('Test the method "find"', function () {
        it('"find" exists', function () {
            chai.expect(NotificationService.find).to.exist;
        });

        // TEST 5 
        // if the method "find" exists, then call it
        it('"find" returns a specific patient', function () {
            let findByIdSpy = sandbox.spy(NotificationModel, 'findById');

            return NotificationService
                .find(3)
                .then(function (notification) {
                    chai.expect(findByIdSpy.called).to.be.true;
                    chai.expect(findByIdSpy.calledOnce).to.be.true;
                    chai.expect(findByIdSpy.calledWith(3)).to.be.true;

                    // chai performs a deep equality check (on objects)
                    chai.expect(notification).deep.equals({
                        "id": 3,
                        "medic": "John Smith",
                        "message": "Brain aneurysm in room 501",
                        "sendDate": "2016-11-22 07:21:00.032 +00:00"
                    });
                });
        });
        // TEST 6
        // if notification doesn't exist 
        it('"find" returns null if notificationdoesn\'t exist', function () {
            return NotificationService 
                .find(-1)
                .then(function (notification) {
                    chai.expect(notification).to.be.null;
                });
        });
    });
});
