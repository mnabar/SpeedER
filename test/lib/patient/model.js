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

// Model definition

/**
 * @class Patient
 * @property {string} name
 * @property {string} email (primaryKey)
 * @property {string} password
 * @property {string} salt
 * @property {string} phoneNumber
 * @property {string} injury
 * @property {integer} age
 * @property {boolean} isVerified
 * @property {integer} chosenHospital
 * @property {string} supervisingDoctor
 * @property {string} resetPasswordToken
 * @property {date} resetPasswordExpires
 */

// mimic Patient model in ../../../src/server/models/models.js

const PatientModel = Database
    .getInstance()
    .define('Patient', {
        'name': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true 
        },
        'email': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false,
            'validate': {
                'isEmail': true
            },
            'primaryKey': true
        },
        'password': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false
        },
        'salt': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true
        },
        'phoneNumber': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false,
            'validate': {
                'isNumeric': true
            }
        },
        'injury': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false
        },
        'age': {
            'type': Database.FIELD_TYPE_ENUM.INTEGER,
            'allowNull': false,
            'validate': {
                'isNumeric': true, 
                'min': 0, 
                'max': 120, 
            }
        },
        'isVerified': {
            'type': Database.FIELD_TYPE_ENUM.BOOLEAN,
            'allowNull': true
        },
        'chosenHospital': {
            'type': Database.FIELD_TYPE_ENUM.INTEGER,
            'allowNull': true
        },
        'supervisingDoctor': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true
        },
        'resetPasswordToken': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true
        },
        'resetPasswordExpires': {
            'type': Database.FIELD_TYPE_ENUM.DATE,
            'allowNull': true
        }

    });

module.exports = PatientModel;

