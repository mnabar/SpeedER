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
const InjuryReportModel = require('./model');

// a service is essentially a group of methods on a mocked database 
class InjuryReportService {

    static findAll(){
        return InjuryReportModel.findAll({
            'raw': true
        });
    }

    static find(patient_id){
        return InjuryReportModel.findAll({
            where: {
                fk_email: patient_id
            }
        });
    }
}

module.exports = InjuryReportService;