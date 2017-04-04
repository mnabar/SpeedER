'use strict';

const Sequelize = require('sequelize');
const config    = require('../config/config.js');
const bcrypt    = require('bcryptjs');
const db        = {};


/* Create the instance of sequelize */

const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    storage: config.db.storage,
		logging: false
});

/* Instantiate the database */

sequelize
  .authenticate()
  .then(function() {
      console.log('Connection has been established successfully.');
  }, function (err) { 
      console.log('Unable to connect to the database:', err);
  });

/* this is where all of the MODELS will be defined for the time being */

// Validators: http://docs.sequelizejs.com/en/v3/docs/models-definition/#validations

/* Patient Model */
const Patient = sequelize.define('Patient', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      primaryKey: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    salt: {
      type: Sequelize.STRING,
      allowNull: true
    },
    phoneNumber:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
        	isNumeric: true
        }
    },
    injury: {
      type: Sequelize.STRING,
      allowNull: false
    },
    age: {
    	type: Sequelize.INTEGER,
    	allowNull: false,
    	validate : {
    		isNumeric: true,
    		min: 0,
    		max: 120
    	}
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    chosenHospital: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    supervisingDoctor: {
      type: Sequelize.STRING,
      allowNull: true
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true
    }
}, {
    classMethods: {
        generateHash: function(password, salt){
            return bcrypt.hashSync(password, salt, null);
        }
    }
});

const Notification = sequelize.define('Notification', {
    medic: {
      type: Sequelize.STRING,
      allowNull: false
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sendDate: {
      type: Sequelize.DATE,
      allowNull: false
    }
});

/* MedicalStaff Model */
const MedicalStaff = sequelize.define('MedicalStaff', {
    name: {
    	type: Sequelize.STRING,
    	allowNull: false,
    },
    email: {
      type: Sequelize.STRING, 
      validate: {
        isEmail: true
      }, 
      primaryKey: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    salt: { 
      type: Sequelize.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: Sequelize.STRING,
      validate: {
      	isNumeric: true
      },
      allowNull: false
   	},
    position: {
      type: Sequelize.STRING,
      allowNull: true
    },
    authenticationCode: {
      type: Sequelize.STRING,
      allowNull: false
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    unassigned: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true
    }
}, {
    classMethods: {
        generateHash: function(password, salt){
            return bcrypt.hashSync(password, salt, null);
        }
    }
});

/* Hospital Model */
const Hospital = sequelize.define('Hospital', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: true, // since we add hospitals before they sign up
      validate : {
        len: [1,200],
        isAlphaNumeric: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    salt: {
      type: Sequelize.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: Sequelize.STRING,
      validate: {
        isNumeric: true
      }, 
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      },
      allowNull: true
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: ["^[A-Z][A-Z]$"],
      }
    },
    zipCode: {
      type: Sequelize.STRING,
      allowNull: true, 
      validate: {
        isNumeric: true
      }
    },
    waitMins: {
      type: Sequelize.INTEGER,
      allowNull: true 
    },
    geometry: {
      type: Sequelize.GEOMETRY,
      allowNull: true 
    },
    resetPasswordToken:  {
      type: Sequelize.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true
    }
}, {
    classMethods: {
        generateHash: function(password, salt) {
            return bcrypt.hashSync(password, salt, null);
        }
    }
});


/* Injury Report Model */
const InjuryReport = sequelize.define('InjuryReport', {
    description: { 
      type: Sequelize.STRING,
      allowNull: false
    },
    discomfortLevel: {
      type: Sequelize.INTEGER,
      validate: {
        min: 1,
        max: 10
      }
    }
});

/* Health Profile Model */
const HealthProfile = sequelize.define('HealthProfile', {
    age: Sequelize.INTEGER,
    height: Sequelize.INTEGER,
    weight: Sequelize.INTEGER,
    sex: Sequelize.STRING,
    InsuranceProvider: Sequelize.STRING,
    prescriptions: Sequelize.STRING,
    nonPrescribedDrugs: Sequelize.STRING,
    allergies: Sequelize.STRING,
    priorOperations: Sequelize.STRING,
    healthProfileId: Sequelize.INTEGER
});

MedicalStaff.belongsTo(Hospital, {foreignKey:'fk_id'});
Hospital.hasMany(MedicalStaff, {foreignKey: 'fk_email'});
Hospital.hasMany(InjuryReport, {foreignKey: 'fk_hospitalInjuryId'});
InjuryReport.belongsTo(Patient, {foreignKey: 'fk_email'});
HealthProfile.belongsTo(Patient, {foreignKey: 'fk_email'});

sequelize.sync();


db.MedicalStaff = MedicalStaff;
db.Hospital = Hospital;
db.Patient = Patient;
db.Hospital = Hospital;
db.InjuryReport = InjuryReport;
db.HealthProfile = HealthProfile;
db.sequelize = sequelize;
db.InjuryReport = InjuryReport;
db.HealthProfile = HealthProfile;

module.exports = db;
