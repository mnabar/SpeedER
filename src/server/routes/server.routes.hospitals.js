'use strict';

const express = require('express');
const passport = require('passport');
const Sequelize = require('sequelize');
const sequelizeInstance = require('../models/models.js').sequelize;

const hospitalsRouter = express.Router();

hospitalsRouter.route('/')
	.get((req, res) => {
		sequelizeInstance.query('SELECT name FROM hospitals', {type: Sequelize.QueryTypes.SELECT}).then(function(hospitals) {
			var hospitalNames = [] 

			// get hospital names 
			for(var i = 0; i < hospitals.length; i++) {
				hospitalNames.push(hospitals[i].name)
			}

			// sort hospital names
			hospitalNames.sort(); 

			res.render('hospitalLogin', {hospitals: hospitalNames});
		}) 
    });

// two cases: 1. DOCTOR, 2. MEDICAL STAFF 
hospitalsRouter.route('/signup')
	.post(
		passport.authenticate('local-hospital-staff-signup', {
			successRedirect: '/hospitalSignupSuccess',
			failureRedirect: '/hospitalSignupFailure'
		})
	);

hospitalsRouter.route('/login')
	.post(
		passport.authenticate('local-hospital-staff-login', {
			successRedirect: '/medicalStaffProfile',
			failureRedirect: '/hospitalLoginFailure'
		})
	);

hospitalsRouter.route('/logout')
	.get((req, res) => {
  		req.session.destroy();
        res.render('index');
	});

module.exports = hospitalsRouter;