// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

/**
 * Define the database model around a @{Notification}
 *
 * @module node-sequelize-with-mocks/user/model
 * @exports Sequelize.Model
 */

'use strict';

// Imports
const Database = require('../database');

// Model definition

/**
 * @class Notification
 * @property {string} medic
 * @property {string} message
 * @property {date} sendDate
 */

// mimic Notification model in ../../../src/server/models/models.js

const NotificationModel = Database
    .getInstance()
    .define('Notification', {
        'medic': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false
        },
        'message': {
            'type': Database.FIELD_TYPE_ENUM.STRING,
            'allowNull': false
        },
        'sendDate': {
            'type': Database.FIELD_TYPE_ENUM.DATE, 
            'allowNull': false
        }
    });

module.exports = NotificationModel;

