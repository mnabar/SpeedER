// UNIT TEST: LOG IN/LOG OUT + SESSIONS

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
var request = require('supertest')

chai.use(chaiHttp);

// reference: https://gist.github.com/joaoneto/5152248
var firstUserCookies; // store cookies here 

// Overall Testing Framework 


// make sure any current patient is logged out before this test begins
before(function() {
    main_agent
        .get('patient/logout')
});


describe('Testing User Sessions\n', function() {

	// Persistence Testing 

	// Test persistence when user signs up
	 it('Persistence: User Sign Up (Extract cookie)', function(done){
        // first make sure we can send information to the post request 
        var isValidInput = function(res) {
            //console.log("Res is", res) // printing out contents of res 
            res.request._data.should.have.property("email", "amy@test.com");
            res.request._data.should.have.property("name", "Amy");
            res.request._data.should.have.property("password", "testing123");
            res.request._data.should.have.property("phoneNumber", "6262218836");
            res.request._data.should.have.property("injury", "Broken arm");
            res.request._data.should.have.property("age", 10);
            res.request._data.should.have.property("isVerified", false);
            res.request._data.should.have.property("resetPasswordToken", null);
            res.request._data.should.have.property("resetPasswordExpires", null);
            res.request._data.should.have.property("salt", "12345");
        };
       

        main_agent 
            .post('patient/signup')
            .send({
            	name: "Amy",
                email: "amy@test.com",
                password: "testing123",
                phoneNumber: "6262218836", 
                injury: "Broken arm",
                age: 10,
                isVerified: false, 
                resetPasswordToken: null,
                resetPasswordExpires: null,
                salt: "12345"
            })
            .expect(isValidInput)
            .end((err, res) => {
            	// test to see if cookie is set 
            	// extract the cookie
            	// used reference above 
            	firstUserCookies = res.headers['set-cookie'].pop().split(';')[0];
                res.status.should.be.equal(302); // redirect
                expect(res).to.redirect;
                expect(res).to.redirectTo("/patientSignupSuccess");
                done(err);
            })
    });
	

	// Test persistence when user already logged in 
	// Note user logged in after sign up 
	it('Persistence: User Logged-in (First Navigation)', function(done) {
		
		main_agent 
			.get('') // navigate to home page and see if cookies set 
			.end((err, res) => {
				res.request.cookies.should.be.equal(firstUserCookies) // check if cookies are equal
				done(err); 
			})
	})

	it('Persistence: User Logged-in (Second Navigation)', function(done) {
		
		main_agent 
			.get('patientProfile') // navigate to loginSuccess and see if cookies set 
			.end((err, res) => {
				res.request.cookies.should.be.equal(firstUserCookies) // check if cookies are equal
				done(err); 
			})
	}) 

	it('Persistence: User Logging-out (Third Navigation)', function(done) {

		main_agent
			.get('patient/logout')
			.end((err, res) => {
				done(err); 
			})
	})

    // Test updated cookie for new signed-in user 
    it('Test updated cookie: Part 1 -- Sign in new user', function(done){
        // first make sure we can send information to the post request 
        var isValidInput = function(res) {
            //console.log("Res is", res) // printing out contents of res 
            res.request._data.should.have.property("email", "madi@test.com");
            res.request._data.should.have.property("name", "Madi");
            res.request._data.should.have.property("password", "calforever");
            res.request._data.should.have.property("phoneNumber", "6262248614");
            res.request._data.should.have.property("injury", "Sprained ankle");
            res.request._data.should.have.property("age", 21);
            res.request._data.should.have.property("isVerified", false);
            res.request._data.should.have.property("resetPasswordToken", null);
            res.request._data.should.have.property("resetPasswordExpires", null);
            res.request._data.should.have.property("salt", "randomsalt");
        };

        main_agent 
            .post('patient/signup')
            .send({
                name: "Madi",
                email: "madi@test.com",
                password: "calforever",
                phoneNumber: "6262248614",
                injury: "Sprained ankle",
                age: 21,
                isVerified: false, 
                resetPasswordToken: null,
                resetPasswordExpires: null,
                salt: "randomsalt"
            })
            .expect(isValidInput)
            .end((err, res) => {
                // test to see if cookie is set 
                // extract the cookie
                // used reference above 
                res.status.should.be.equal(302); // redirect
                expect(res).to.redirect;
                expect(res).to.redirectTo("/patientSignupSuccess");
                done(err);
            })
    });


    // Test persistence when user already logged in 
    // Note user logged in after sign up 
    it('Test updated cookie: Part 2 -- Compare logged-in user\'s cookie against previous user\'s', function(done) {
        
        main_agent 
            .get('') // navigate to home page and see if cookies set 
            .end((err, res) => {
                res.request.cookies.should.not.be.equal(firstUserCookies) // check if new cookie doesn't equal old user's cookie
                done(err); 
            })
    });


	// clean up data so not added to the database 
    // (because if added to database, subsequent runs of this program will fail
    //  -- saying that email is already in database)
    after(function(done) {
        db.Patient.destroy({
            where:{
                email: "amy@test.com"
            }
        });
        db.Patient.destroy({
            where:{
                email: "madi@test.com"
            }
        });
        return done(); 
    });




});