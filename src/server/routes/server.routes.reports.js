'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const sequelizeInstance = require('../models/models.js').sequelize;

const reportsRouter = express.Router();

reportsRouter.route('/')
	.get((req, res) => {
		sequelizeInstance.models.Hospital.findAll({
			raw: true
		}).then(hospitals => {
			res.render('report', {hospitals: hospitals});
		});
	});

reportsRouter.route('/confirm')
	.post((req, res) => {
		Sequelize.Promise.all([
			sequelizeInstance.models.InjuryReport.create({
				description: 		 req.body.description,
				fk_email: 			 req.session.user.email,
				fk_hospitalInjuryId: req.body.hospid,
				discomfortLevel: 	 req.body.discomfortLevel
			}).catch(Sequelize.ValidationError, (err) => {
				console.log(err);
			}),

			sequelizeInstance.models.Patient.findOne({ where: {email : req.session.user.email }})
				.then(function(patient) {
					if (patient) {
						patient.updateAttributes({
							isVerified: 1, // patient on their way
							chosenHospital: req.body.hospid
						})
					}
				})
			]).spread(function() {

			})

	});

module.exports = reportsRouter;