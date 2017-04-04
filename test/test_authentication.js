
// UNIT TEST: PATIENT AUTHENTICATION (SIGN-UP)

"use strict";

var db = require('../src/server/models/models.js')
var expect = require('chai').expect;
var request = require('request');
var app = require('../app.js');
var chai = require('chai');

var chaiHttp = require('chai-http');
const assert = require('chai').assert;
var should = chai.should();

// set up agent to test both post and get requests 
// 1. make sure we can send information to the post request
// 2. make sure we can get to the proper page upon the post request 
var main_agent = require('supertest').agent('http://localhost:3000/');

chai.use(chaiHttp);

// Note: 
// This file will not be testing the following properties: 
// - salt
// - isVerified
// - resetPasswordToken
// - resetPasswordExpires

// because they are not required for authentication

// make sure any current patient is logged out before this test begins
before(function() {
    main_agent
        .get('patient/logout')
});

// Overall Testing Framework 
describe('Testing Patient Signup', function(){

    // TEST 1
    // reference: http://stackoverflow.com/questions/20164478/unit-test-login-with-passport-js-and-express-js
    it('Valid input: Test POST', function(done){
        // first make sure we can send information to the post request 
        var isValidInput = function(res) {
            // console.log("Res is", res) // printing out contents of res 
            res.request._data.should.have.property("email", "asitwala@newemail11.com");
            res.request._data.should.have.property("name", "Amy");
            res.request._data.should.have.property("password", "testing123");
            res.request._data.should.have.property("phoneNumber", "123456789");
            res.request._data.should.have.property("injury", "Broken arm");
            res.request._data.should.have.property("age", 10);
            res.request._data.should.have.property("isVerified", false);
            res.request._data.should.have.property("resetPasswordToken", null);
            res.request._data.should.have.property("resetPasswordExpires", null);
        };

        main_agent 
            .post('patient/signup')
            .send({
                email: "asitwala@newemail11.com",
                name: "Amy",
                password: "testing123",
                phoneNumber: "123456789",
                injury: "Broken arm",
                age: 10,
                isVerified: false, 
                resetPasswordToken: null,
                resetPasswordExpires: null
            })
            .expect(isValidInput)
            .end(done)
    });

    // TEST 2
    // TODO: need to make sure redirect to /signupSuccess
    // test using a different framework for consistency
    it('Valid input: Test Redirect', function(done){

        main_agent
          .post('patient/signup')
          .send({
                name: "Valid Input",
                email: "valid_input@abc.com",
                password: "makeyourpasswordsinsanelylong",
                phoneNumber: "6262218836",
                injury: "Broken jaw", 
                age: 50,
                isVerified: null
            })
          .end((err, res) => {
              // see what's in err and res objects
              // console.log("Err: " + err);
              // console.log("Res: " + res);
              res.status.should.be.equal(302); // for a redirection
              expect(res).to.redirect; // double check
              done(err); 
            });
    });


    // TEST 3
  /*  it('Valid input: Test POST + subsequent GET', function(done){
        // reference: http://chaijs.com/plugins/chai-http/

        var patient = {
            email: "hello@zzzzz.com", 
            name: "Hello",
            phoneNumber: "6268337225", 
            injury: "Broke my shoulder",
            age: 119, 
            password: "zamalah!"
        };

        main_agent
            .post('patient/signup')
            .send(patient)
            .then(function (res) {
                // get the following GET request
                // can get ANY other valid page (could also be 'signupFailure')
                // NOT testing redirect 
                return main_agent.get('signupSuccess') 
                    .end((err,res) => {
                        res.status.should.be.equal(200);
                        done(err);
                    })
            })
    }); */

    // TEST 4
  /*  it('Invalid input: Test POST + Redirect', function(done){
        // set up invalid patient 
        var patient = {
            email: "hello", 
            password: "holdThisL"
        };

        main_agent
            .post('patient/signup')
            .send(patient)
            .end((err, res) => {
                res.status.should.be.equal(302); // redirect
                expect(res).to.redirect;
                expect(res).to.redirectTo("/signupFailure");
                done(err);
            })
    }); */

    // TEST 5
  /*  it('Invalid input: Test POST + subsequent GET', function(done) {

        // set up invalid patient 
        var patient = {
            email: "palindromes@gmail.com",
            password: "password123",
            phoneNumber: 1234567,
            age: 40
        };

        main_agent 
            .post('patient/signup')
            .send(patient)
            .then (function(res) {
                // get the following GET request
                // can get ANY other valid page (could also be 'signupSuccess')
                // NOT testing redirect 
                return main_agent.get('signupFailure')
                    .end((err,res) => {
                        res.status.should.be.equal(200);
                        done(err);
                    })
            })
    }); */

    // NOW TESTING INVALID FIELDS, ONE AT A TIME -----> 

    // TEST 6
    // TODO: Check why allowNull:False fails for name field

    // it('Invalid input: Non-string Name field ', function(done){

    //     // set up invalid patient 
    //     var patient = {
    //         email: "invalid_patient@needER.com",
    //         name: 123456, // fails since anything of nontype string defaults to null
    //         password: "super_special_awesome",
    //         phoneNumber: "123456789",
    //         injury: "I sprained my ankle",
    //         age: 28,
    //         isVerified: false, 
    //         resetPasswordToken: null,
    //         resetPasswordExpires: null
    //     };

    //     main_agent 
    //         .post('patient/signup')
    //         .send(patient)
    //         .end((err, res) => {
    //             res.status.should.be.equal(302); // redirect
    //             expect(res).to.redirect;
    //             expect(res).to.redirectTo("/signupFailure");
    //             done(err);
    //         })
    // });

    // TEST 7
    it('Invalid input: Email field null', function(done){

        // set up invalid patient 
        var patient = {
            // email: "invalid_patient@needER.com",
            name: "Not Okay",
            password: "super_special_awesome",
            phoneNumber: "123456789",
            injury: "I sprained my ankle",
            age: 28,
            isVerified: false, 
            resetPasswordToken: null,
            resetPasswordExpires: null
        };

        main_agent 
            .post('patient/signup')
            .send(patient)
            .end((err, res) => {
                res.status.should.be.equal(302); // redirect
                expect(res).to.redirect;
                expect(res).to.redirectTo("/patientSignupFailure");
                done(err);
            })
    });

    // TEST 8
    it('Invalid input: Password field null', function(done){

        // set up invalid patient 
        var patient = {
            email: "invalid_patient@needER.com",
            name: "Not Okay",
            // password: "super_special_awesome",
            phoneNumber: "123456789",
            injury: "I sprained my ankle",
            age: 28,
            isVerified: false, 
            resetPasswordToken: null,
            resetPasswordExpires: null
        };

        main_agent 
            .post('patient/signup')
            .send(patient)
            .end((err, res) => {
                res.status.should.be.equal(302); // redirect
                expect(res).to.redirect;
                expect(res).to.redirectTo("/patientSignupFailure");
                done(err);
            })
    });

    // TEST 9
    it('Invalid input: Phone Number field null', function(done){

        // set up invalid patient 
        var patient = {
            email: "invalid_patient@needER.com",
            name: "Not Okay",
            password: "super_special_awesome",
            // phoneNumber: "123456789",
            injury: "I sprained my ankle",
            age: 28,
            isVerified: false, 
            resetPasswordToken: null,
            resetPasswordExpires: null
        };

        main_agent 
            .post('patient/signup')
            .send(patient)
            .end((err, res) => {
                // res.status.should.be.equal(302); // redirect
                // expect(res).to.redirect;
                // expect(res).to.redirectTo("/patient");
                done(err);
            })
    });

    // TEST 10
    it('Invalid input: Injury field null', function(done){

        // set up invalid patient 
        var patient = {
            email: "invalid_patient@needER.com",
            name: "Not Okay",
            password: "super_special_awesome",
            phoneNumber: "123456789",
            // injury: "I sprained my ankle",
            age: 28,
            isVerified: false, 
            resetPasswordToken: null,
            resetPasswordExpires: null
        };

        main_agent 
            .post('patient/signup')
            .send(patient)
            .end((err, res) => {
                // res.status.should.be.equal(302); // redirect
                // expect(res).to.redirect;
                // expect(res).to.redirectTo("/patient");
                done(err);
            })
    });

    // TEST 11
    it('Invalid input: Age field null', function(done){

        // set up invalid patient 
        var patient = {
            email: "invalid_patient@needER.com",
            name: "Not Okay",
            password: "super_special_awesome",
            phoneNumber: "123456789",
            injury: "I sprained my ankle",
            // age: 28,
            isVerified: false, 
            resetPasswordToken: null,
            resetPasswordExpires: null
        };

        main_agent 
            .post('patient/signup')
            .send(patient)
            .end((err, res) => {
                res.status.should.be.equal(302); // redirect
                expect(res).to.redirect;
                expect(res).to.redirectTo("/patientSignupFailure");
                done(err);
            })
    });

    // clean up dataso not added to the database 
    // (because if added to database, subsequent runs of this program will fail
    //  -- saying that email is already in database)
    after(function(done) {
        db.Patient.destroy({
            where:{
                email: "asitwala@newemail11.com"
            }
        });
        db.Patient.destroy({
            where:{
                email: "valid_input@abc.com"
            }
        });
        db.Patient.destroy({
            where:{
                email: "hello@zzzzz.com"
            }
        });
        return done(); 
    });

});




