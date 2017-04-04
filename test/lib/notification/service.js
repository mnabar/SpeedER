// UNIT TEST: DATABASE

// Code Skeleton from 
// https://github.com/rochejul/sequelize-mocking

/**
 * Service around @{Notification}
 *
 * @module node-sequelize-with-mocks/user/service
 * @exports NotificationService
 */

'use strict';

// Imports
const NotificationModel = require('./model');

// a service is essentially a group of methods on a mocked database 
class NotificationService {
    /**
     * @returns {Promise.<Notification[]>} // from original code
     */
    static findAll() {
        return NotificationModel.findAll({
            'raw': true
        });
    }
    
    /**
     * @param {number} NotificationsId
     * @returns {Promise.<Notifications>} // from original code 
     */

    // search for a single instance by its primary key 
    // -- in this case, its the index of the table
    static find(primaryKey) {
        return NotificationModel.findById(primaryKey);
    }
}

module.exports = NotificationService;
