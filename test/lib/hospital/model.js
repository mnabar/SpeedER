// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

/**
 * Define the database model around a @{Hospital}
 *
 * @module node-sequelize-with-mocks/user/model
 * @exports Sequelize.Model
 */

'use strict';

// Imports
const Database = require('../database');

// Model definition

/**
 * @class Hospital 
 * @property {string} name
 * @property {string} username
 * @property {string} password
 * @property {string} salt
 * @property {string} phoneNumber
 * @property {string} email
 * @property {string} address
 * @property {string} city
 * @property {string} state
 * @property {string} zipCode
 * @property {integer} waitMins
 * @property {string} geometry
 * @property {string} resetPasswordToken
 * @property {date} resetPasswordExpires
 */

// mimic Hospital model in ../../../src/server/models/models.js

const HospitalModel = Database
    .getInstance()
    .define('Hospital', {
        'name': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false
        },
        'id': {
            'type': Database.FIELD_TYPE_ENUM.INTEGER,
            'allowNull': false,
            'primaryKey': true
        },
        'username': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true
        },
        'password': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true
        },
        'salt': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true
        },
        'phoneNumber': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true
        },
        'email': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'validate': {
                'isEmail': true
            },
            'allowNull': true 
        },
        'address': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true
        },
        'city': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true
        },
        'state': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true
        },
        'zipCode': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': true
        },
        'waitMins': {
            'type': Database.FIELD_TYPE_ENUM.INTEGER,
            'allowNull': true
        },
        'geometry': {
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
        },
    });

module.exports = HospitalModel;

