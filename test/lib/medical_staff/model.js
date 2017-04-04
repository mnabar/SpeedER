// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

/**
 * Define the database model around a @{MedicalStaff}
 *
 * @module node-sequelize-with-mocks/user/model
 * @exports Sequelize.Model
 */

'use strict';

// Imports
const Database = require('../database');

// Model definition

/**
 * @class MedicalStaff
 * @property {string} name
 * @property {string} email (primaryKey)
 * @property {string} salt
 * @property {string} password
 * @property {string} phoneNumber
 * @property {string} specialty 
 * @property {boolean} active
 * @property {boolean} unassigned
 * @property {string} resetPasswordToken
 * @property {date} resetPasswordExpires
 */

// mimic MedicalStaff model in ../../../src/server/models/models.js

const MedicalStaffModel = Database
    .getInstance()
    .define('MedicalStaff', {
        'name': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false
        },
        'email': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'validate': {
                'isEmail': true
            },
            'primaryKey': true,
            'allowNull': false
        },
        'password': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false
        },
        'salt': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false
        },
        'phoneNumber': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false
        },
        'position': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false
        },
        'active': {
            'type': Database.FIELD_TYPE_ENUM.BOOLEAN,
            'allowNull': true
        },
        'unassigned': {
            'type': Database.FIELD_TYPE_ENUM.BOOLEAN,
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

module.exports = MedicalStaffModel;

