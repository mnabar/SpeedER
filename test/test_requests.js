
// UNIT TEST: WEB REQUESTS

// Tutorial Reference + Code Skeleton:
// https://github.com/mapmeld/1batch/wiki/11.-Testing-with-Mocha-and-Supertest

// get dependencies
const assert = require('chai').assert;
const should = require('should');
const app = require('../app.js');
var request = require('supertest').agent('http://localhost:3000/');

// Overall Testing Framework 
describe('Testing Web Requests\n', function() {

	// TEST 1
	// check if test returns the homepage
	it('Return homepage', function(done) {
		request.get('')
			.expect(200)
			.expect('Content-type','text/html; charset=utf-8')
			.end(function(err,res) {
				// HTTP status should be 200
				res.status.should.equal(200);
				done(err); 
			});
	});

	// TEST 2
	// check if test returns the patient page  
	it('Return Patient page', function(done) {
		request.get('patient')
			.expect('Content-type','text/html; charset=utf-8')
			.expect(200)
			.end(function(err,res){
		    	// HTTP status should be 200
		    	res.status.should.equal(200);
		      	done(err);
			});
	});

	// TEST 3
	// check if test returns successful signup page
	it('Return successful signup page', function(done) {
		request.get('patientSignupSuccess')
			.expect('Content-type','text/html; charset=utf-8')
			.expect(200)
			.end(function(err,res){
		    	// HTTP status should be 200
		    	res.status.should.equal(200);
		      	done(err);
			});
	});

	// TEST 4
	// check if test returns unsuccessful signup page
	it('Return unsuccessful signup page', function(done) {
		request.get('patientSignupFailure')
			.expect('Content-type','text/html; charset=utf-8')
			.expect(200)
			.end(function(err,res){
		    	// HTTP status should be 200
		    	res.status.should.equal(200);
		      	done(err);
			});
	});

	// TEST 5
	// check if test returns unsuccessful login page
	it('Return unsuccessful patient login page', function(done) {
		request.get('patientLoginFailure')
			.expect('Content-type','text/html; charset=utf-8')
			.expect(200)
			.end(function(err,res){
		    	// HTTP status should be 200
		    	res.status.should.equal(200);
		      	done(err);
			});
	});

	// TEST 6
	// check if test returns successful login page
	it('Return successful login page', function(done) {
		request.get('patientProfile')
			.expect('Content-type','text/html; charset=utf-8')
			.expect(200)
			.end(function(err,res){
		    	// HTTP status should be 200
		    	res.status.should.equal(200);
		      	done(err);
			});
	});

	// TEST 7
	// check if test returns patient logout page
	it('Return patient logout page', function(done) {
		request.get('patient/logout')
			.expect('Content-type','text/html; charset=utf-8')
			.expect(200)
			.end(function(err,res){
		    	// HTTP status should be 200
		    	res.status.should.equal(200);
		      	done(err);
			});
	});

	// TEST 8 
	// check if test returns confirmed trip 
	it('Return patient\'s confirmed trip page', function(done) {
		request.get('confirm')
			.expect('Content-type','text/html; charset=utf-8')
			.expect(200)
			.end(function(err,res){
		    	// HTTP status should be 200
		    	res.status.should.equal(200);
		      	done(err);
			});
	});

	// TEST 9
	// check if test returns patient map view
	it('Return patient map view page', function(done) {
		request.get('patientMapView')
			.expect('Content-type','text/html; charset=utf-8')
			.expect(200)
			.end(function(err,res){
		    	// HTTP status should be 200
		    	res.status.should.equal(200);
		      	done(err);
			});
	});

	// TEST 10
	// check if test returns navigation bar 
	it('Return navigation bar', function(done) {
		request.get('navbar')
			.expect('Content-type','text/html; charset=utf-8')
			.expect(200)
			.end(function(err,res){
		    	// HTTP status should be 200
		    	res.status.should.equal(200);
		      	done(err);
			});
	});

	// TEST 11
	// check if test returns hospital page 
	it('Return hospital page', function(done) {
		request.get('hospital')
			.expect('Content-type','text/html; charset=utf-8')
			.expect(200)
			.end(function(err,res){
		    	// HTTP status should be 200
		    	res.status.should.equal(200);
		      	done(err);
			});
	});

	// TEST 12
	// check if test returns hospital login page 
	it('Return hospital login page', function(done) {
		request.get('hospitalLogin')
			.expect('Content-type','text/html; charset=utf-8')
			.expect(200)
			.end(function(err,res){
		    	// HTTP status should be 200
		    	res.status.should.equal(200);
		      	done(err);
			});
	});


});
