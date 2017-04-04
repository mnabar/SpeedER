// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

/**
 * Service around @{Patient}
 *
 * @module node-sequelize-with-mocks/user/service
 * @exports UserService
 */

'use strict';

// Imports
const PatientModel = require('./model');

// a service is essentially a group of methods on a mocked database 
class PatientService {
    /**
     * @returns {Promise.<Patient[]>} // from original code
     */
    static findAll() {
        return PatientModel.findAll({
            'raw': true
        });
    }

    /**
     * @param {number} patientId
     * @returns {Promise.<Patient>} // from original code 
     */

    // search for a single instance by its primary key 
    static find(patientEmail) {
        return PatientModel.findById(patientEmail);
    }
}

module.exports = PatientService;
