
// UNIT TEST: HOSPITAL AUTHENTICATION (SIGN-UP)

"use strict";

var db = require('../src/server/models/models.js')
var expect = require('chai').expect;
var request = require('request');
var app = require('../app.js');
var chai = require('chai');
const sinon = require('sinon');
const Sequelize = require('sequelize');

var chaiHttp = require('chai-http');
const assert = require('chai').assert;
var should = chai.should();

// set up agent to test both post and get requests 
// 1. make sure we can send information to the post request
// 2. make sure we can get to the proper page upon the post request 
var main_agent = require('supertest').agent('http://localhost:3000/');

chai.use(chaiHttp);


// We are mocking the alerts that we have in validate.js (because these unit tests don't
// contain the validations we have on the front-end side)

// Essentially our validations on the front-end side ensure that non-null information is sent 
// to our database for certain inputs 

// reference: http://stackoverflow.com/questions/38444212/testing-js-alert-with-chai-mocha

// We are going to overwrite default alert() function
var alert;  

function generateAlert(input) {
  if (input.length > 0) {
    return input;
  } else {
    alert("Input needs to be longer than 1 character");
  }
}

alert = sinon.spy();

// Note: 
// This file will not be testing the following properties: 
// - salt
// - isVerified
// - resetPasswordToken
// - resetPasswordExpires

// because they are not required for authentication


// make sure any current medicalstaff is logged out before this test begins
before(function() {
    main_agent
        .get('hospitalLogin/logout')
});


// Overall Testing Framework 
describe('Testing Medical Staff Signup', function(){

    // TEST 1
    // reference: http://stackoverflow.com/questions/20164478/unit-test-login-with-passport-js-and-express-js
    it('Valid input: Test POST', function(done){
        // first make sure we can send information to the post request 
        var isValidInput = function(res) {
            res.request._data.should.have.property("name", "Test Staff");
            res.request._data.should.have.property("email", "staff_1@test.com");
            res.request._data.should.have.property("password", "testing123");
            res.request._data.should.have.property("phoneNumber", "6263585754");
            res.request._data.should.have.property("position", "Administrator");
            res.request._data.should.have.property("unassigned", false);
            res.request._data.should.have.property("resetPasswordToken", null);
            res.request._data.should.have.property("resetPasswordExpires", null);
        };

        main_agent 
            .post('hospitalLogin/signup')
            .send({
                name: "Test Staff",
                email: "staff_1@test.com",
                password: "testing123",
                phoneNumber: "6263585754",
                position: "Administrator",
                salt: "thisisasalt",
                hospitalName: "PRESENCE RESURRECTION MEDICAL CENTER",
                active: true,
                unassigned: false,
                resetPasswordToken: null, 
                resetPasswordExpires: null
                
            })
            .expect(isValidInput)
            .end(done)
    });

    // TEST 2
    it('Valid Input: Test Signup Redirect', function(done){

        main_agent
          .post('hospitalLogin/signup')
          .send({
                name: "Test Staff 2",
                email: "staff_2@test.com",
                password: "password2",
                phoneNumber: "6263585754",
                position: "Administrator",
                salt: "randomstringofcharactershere",
                hospitalName: "SHRINERS HOSPITAL FOR CHILDREN",
                active: true,
                unassigned: null,
                resetPasswordToken: null, 
                resetPasswordExpires: null
            })
          .end((err, res) => {
              res.status.should.be.equal(302); // for a redirection
              expect(res).to.redirect; // double check
              done(err); 
            });
    });

    // TEST 3
    it('Invalid input: Email field null', function(done){

        // set up invalid medical_staff 
        var medical_staff = {
                name: "Test Staff 3",
                //email: "staff_3@test.com",
                password: "password3",
                phoneNumber: "7148585754",
                position: "Administrator",
                salt: "123salt123",
                hospitalName: "MERCY HOSPITAL AND MEDICAL CENTER",
                active: true,
                unassigned: true,
                resetPasswordToken: null, 
                resetPasswordExpires: null
        };

        main_agent 
            .post('hospitalLogin/signup')
            .send(medical_staff)
            .end((err, res) => {
                res.status.should.be.equal(302); // redirect
                expect(res).to.redirect;
                expect(res).to.redirectTo("/hospitalSignupFailure");
                done(err);
            })
    });

    // TEST 4
    it('Invalid input: Password field null', function(done){

        // set up invalid medical_staff
        var medical_staff = {
                name: "Test Staff 3",
                email: "staff_3@test.com",
                // password: "password3",
                phoneNumber: "7148585754",
                position: "Administrator",
                salt: "123salt123",
                hospitalName: "MERCY HOSPITAL AND MEDICAL CENTER",
                active: true,
                unassigned: true,
                resetPasswordToken: null, 
                resetPasswordExpires: null
        };

        main_agent 
            .post('hospitalLogin/signup')
            .send(medical_staff)
            .end((err, res) => {
                res.status.should.be.equal(302); // redirect
                expect(res).to.redirect;
                expect(res).to.redirectTo("/hospitalSignupFailure");
                done(err);
            })
    });

    // TEST 5
    it('Invalid input: PhoneNumber field null', function(done){

        // set up invalid medical_staff
        var medical_staff = {
                name: "Test Staff 3",
                email: "staff_3@test.com",
                password: "password3",
                // phoneNumber: "",
                position: "Administrator",
                salt: "123salt123",
                hospitalName: "MERCY HOSPITAL AND MEDICAL CENTER",
                active: true,
                unassigned: true,
                resetPasswordToken: null, 
                resetPasswordExpires: null
        };

        try {
            main_agent 
                .post('hospitalLogin/signup')
                .send(medical_staff)
        } catch (err) {
            done(err); 
        }

        main_agent.then(done()); 

    });

    // TEST 6
    it('Invalid input: Name field empty (not null)', function(done){

        // set up invalid medical_staff


        var medical_staff = {
                name: "",
                email: "staff_3@test.com",
                password: "password3",
                phoneNumber: "7148585754",
                position: "Administrator",
                salt: "123salt123",
                hospitalName: "MERCY HOSPITAL AND MEDICAL CENTER",
                active: true,
                unassigned: true,
                resetPasswordToken: null, 
                resetPasswordExpires: null
        };

        main_agent 
            .post('hospitalLogin/signup')
            .send(medical_staff)
            .end((err, res) => {
                generateAlert(res.request._data.name);
                expect(alert.calledOnce).to.be.true;
                done(err);
            })
    });


    // clean up data so that these instances are not added to the database 
    // (because if added to database, subsequent runs of this program will fail
    //  -- saying that email is already in database)
    after(function(done) {
        db.MedicalStaff.destroy({
            where:{
                email: "staff_1@test.com"
            }
        });
        db.MedicalStaff.destroy({
            where:{
                email: "staff_2@test.com"
            }
        });
        db.MedicalStaff.destroy({
            where:{
                email: "staff_3@test.com"
            }
        });
        return done(); 
    });

});




