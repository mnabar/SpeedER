// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

/**
 * Define the database model around a @{Patient}
 *
 * @module node-sequelize-with-mocks/user/model
 * @exports Sequelize.Model
 */

'use strict';

// Imports
const Database = require('../database');
const PatientModel = require('../patient/model');

// Model definition

/**
 * @class Patient
 * @property {string} name
 * @property {string} email (primaryKey)
 * @property {string} password
 * @property {string} phoneNumber
 * @property {string} injury
 * @property {integer} age
 * @property {string} resetPasswordToken
 * @property {date} resetPasswordExpires
 */

// mimic Patient model in ../../../src/server/models/models.js

const InjuryReportModel = Database
    .getInstance()
    .define('InjuryReport', {
        'description': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false
        },
        'discomfortLevel': {
            'type': Database.FIELD_TYPE_ENUM.INTEGER,
            'validate': {
                'min': 1,
                'max': 5
            },
            'allowNull': true 
        },
        'timeInjured': {
            'type': Database.FIELD_TYPE_ENUM.DATE,
            'allowNull': true
        },
        'timeFiled': {
            'type': Database.FIELD_TYPE_ENUM.DATE,
            'allowNull': true 
        }

    });

// PatientEmail column naturally made 
PatientModel.hasMany(InjuryReportModel, {as: 'injuryReports'});
InjuryReportModel.belongsTo(PatientModel, {foreignKey: 'fk_email'});

module.exports = InjuryReportModel;
