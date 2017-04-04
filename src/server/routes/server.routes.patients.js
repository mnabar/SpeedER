'use strict';

const express = require('express');
const passport = require('passport');

const patientsRouter = express.Router();

patientsRouter.route('/')
	.get((req, res) => {
        res.render('patient');
    });

patientsRouter.route('/signup')
	.post(
		passport.authenticate('local-signup', {
			successRedirect: '/patientSignupSuccess',
			failureRedirect: '/patientSignupFailure'
		})
	);

patientsRouter.route('/login')
	.post(
		passport.authenticate('local-login', {
			successRedirect: '/patientProfile',
			failureRedirect: '/patientLoginFailure'
		})
	);

patientsRouter.route('/logout')
	.get((req, res) => {
  		req.session.destroy();
        res.render('index');
	});

module.exports = patientsRouter;
