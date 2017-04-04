// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

/**
 * Service around @{MedicalStaff}
 *
 * @module node-sequelize-with-mocks/user/service
 * @exports UserService
 */

'use strict';

// Imports
const MedicalStaffModel = require('./model');

// a service is essentially a group of methods on a mocked database 
class MedicalStaffService {
    /**
     * @returns {Promise.<MedicalStaff[]>} // from original code
     */
    static findAll() {
        return MedicalStaffModel.findAll({
            'raw': true
        });
    }

    /**
     * @param {number} patientId
     * @returns {Promise.<Patient>} // from original code 
     */

    // search for a single instance by its primary key 
    static find(msEmail) {
        return MedicalStaffModel.findById(msEmail);
    }
}

module.exports = MedicalStaffService;
