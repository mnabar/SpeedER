'use strict';

const path = require('path');

/* MySQL Database configuration */

module.exports = {
    db: {
        name: 'speeder',
        password: '',
        username: 'root',
        host: 'localhost',
        port: 3306
    },
    app: {
        name: 'SpeedER',
        CLIENT_PATH: path.resolve('src/public/views'),
        SERVER_PATH: path.resolve('src/server'),
    }
};
