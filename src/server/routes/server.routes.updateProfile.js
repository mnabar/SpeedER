'use strict';

const express = require('express');
const passport = require('passport');
const Sequelize = require('sequelize');
const sequelizeInstance = require('../models/models.js').sequelize;

const healthProfilesRouter = express.Router();

healthProfilesRouter.route('/')
	.post((req, res) => {
		sequelizeInstance.models.HealthProfile.findOne({ where: { fk_email: req.session.user.email } })
  .then(function (patient) {
    // Check if record exists in db
    if (patient) {
      patient.updateAttributes({
				age: req.body.age,
	      height: req.body.height,
	      weight: req.body.weight,
	      sex: req.body.sex,
	      InsuranceProvider: req.body.InsuranceProvider,
	      prescriptions: req.body.prescriptions,
	      nonPrescribedDrugs: req.body.nonPrescribedDrugs,
	      allergies: req.body.allergies,
	      priorOperations: req.body.priorOperations
      })
    }
  })
        res.render('patientProfile');
    });

module.exports = healthProfilesRouter;
