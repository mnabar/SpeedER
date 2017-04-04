// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

/**
 * Service around @{Hospital}
 *
 * @module node-sequelize-with-mocks/user/service
 * @exports UserService
 */

'use strict';

// Imports
const HospitalModel = require('./model');

// a service is essentially a group of methods on a mocked database 
class HospitalService {
    /**
     * @returns {Promise.<Hospital[]>} // from original code
     */
    static findAll() {
        return HospitalModel.findAll({
            'raw': true
        });
    }

    /**
     * @param {number} hospitalId
     * @returns {Promise.<Hospital>} // from original code 
     */

    // search for a single instance by its primary key 
    static find(id) {
        return HospitalModel.findById(id);
    }
}

module.exports = HospitalService;
