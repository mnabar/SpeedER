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
const HealthProfileModel = require('./model');

// a service is essentially a group of methods on a mocked database 
class HealthProfileService {
 
    static findAll() {
        return HealthProfileModel.findAll({
            'raw': true
        });
    }

    static findById(patient_email){
        return HealthProfileModel.find ({
            where: {
                email: patient_email
            }
        });
    }
}

module.exports = HealthProfileService;