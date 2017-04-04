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

const HealthProfileModel = Database
    .getInstance()
    .define('HealthProfile', {
        'age': {
            'type': Database.FIELD_TYPE_ENUM.INTEGER
        },
        'height': {
            'type': Database.FIELD_TYPE_ENUM.INTEGER
        },
        'weight': {
            'type': Database.FIELD_TYPE_ENUM.INTEGER
        },
        'sex': {
            'type': Database.FIELD_TYPE_ENUM.STRING

        },
        'InsuranceProvider': {
            'type': Database.FIELD_TYPE_ENUM.STRING
        },
        'prescriptions':{
            'type': Database.FIELD_TYPE_ENUM.STRING
        },
        'nonPrescribedDrugs':{
            'type': Database.FIELD_TYPE_ENUM.STRING
        },
        'allergies':{
            'type': Database.FIELD_TYPE_ENUM.STRING
        },
        'priorOperations':{
            'type': Database.FIELD_TYPE_ENUM.STRING
        },
    });

PatientModel.hasOne(HealthProfileModel, {as: 'profile', foreignKey: 'id'});
HealthProfileModel.belongsTo(PatientModel, {as: 'patient', foreignKey: 'email'});

module.exports = HealthProfileModel;