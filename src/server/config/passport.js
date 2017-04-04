
'use strict';

const db = require('../models/models');
const bcrypt = require('bcryptjs');
const passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;
const Sequelize = require('sequelize');
const sequelizeInstance = require('../models/models.js').sequelize;
const saltRounds = 10;

/**
 * Generates a salt for the user
 * Reference: https://en.wikipedia.org/wiki/Salt_(cryptography)
 * @return salt
 */

function generateSalt(){
    return bcrypt.genSaltSync(saltRounds);
}

/**
 * Passes verified user to callback function
 * used interally by Passport.js.
 * http://passportjs.org/docs
 */

passport.serializeUser(function(user, done) {
    done(null, user);
});

/**
 * Takes a serialized user object and finds and returns
 * the corresponding object stored in the database.
 * Else, outputs an error.
 */

passport.deserializeUser(function(userObj, done) {
    db.Patient.find({where: {email: userObj.email}}).then(function(user) {
        done(null, user);
    })
    .catch(function(err){
        db.MedicalStaffs.find({where: {email: userObj.email}}).then(function(user) {
            done(null, user);
        })
        .catch(function(err){
            done(err, null);
        });
    });
});


/**
 * Passport strategy for local user signup
 */

passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
  },
  function(req, username, password, done){

      db.Patient.findOne({ where: {email : username }})
         .then(function(user) {
             if(user !== null) {
                done(null, false);
             }
             else{
                 const userSalt = generateSalt();
                 db.Patient.create({
                     name: req.body.name,
                     email: req.body.email,
                     password: db.Patient.generateHash(req.body.password, userSalt),
                     salt: userSalt,
                     phoneNumber: req.body.phoneNumber,
                     injury: "tmp",
                     age: req.body.age,
                     isVerified: false
                 }).catch(Sequelize.ValidationError, function(err){
                     console.log(err);
                })
                .then(function(user) {
                  done(null, user);
                });
                addPatientToHealthProfiles(req.body.email, req.body.age);
            }
        })
    }
));

/**
 * Passport strategy for user login
 */

passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, function(req, username, password, done){
    db.Patient.findOne({ where: { email: username}})
      .then(function(user){
          if (req.session && req.session.user){
              return done(null, false, {message: 'User already logged in.'});
          }
          if (!user) {
              return done(null, false, {message: 'User does not exist.'});
          }
          if (user.password !==  db.Patient.generateHash(password, user.salt)) {
              return done(null, false, {message: 'Incorrect password.'});
          }
          req.session.user = user;
          return done(null, user);
      }).catch(function(err){
          return done(null, false, {message: 'Login failed, please attempt again.'});
      });
}));


function genRand() {
      return Math.floor(Math.random()*8999+1000);
}

/**
 * Passport strategy for local hospital staff signup
 */

passport.use('local-hospital-staff-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
  },
  function(req, username, password, done){
      db.MedicalStaff.findOne({ where: {email : username }})
         .then(function(user) {
             if(user !== null) {
                done(null, false);
             }
             else{
                 const userSalt = generateSalt();   

                               
                 var hospitalPosition; 
                 var currURL;       
                  // 1. if user is doctor
                  // 2. if user is administrator

                  // first case is to work for how tests are called
                  if (!req.headers.referer) {
                    currURL = req.baseUrl; 
                  }
                  else {
                    console.log(req.baseUrl); 
                    currURL = req.headers.referer; 
                    
                  }


                  if ((currURL).search("/doctorSignup") > -1) {
                    hospitalPosition = "Doctor"; 
                  } else if ((currURL).search("/hospitalLogin") > -1) {
                    hospitalPosition = "Administrator";
                  }
 
                 if(req.body.hasOwnProperty("password")){
                     var code = genRand();
                     var codeString = code.toString();
                     
                    // get hospital id based on hospital name 
                    sequelizeInstance.models.Hospital.findOne({where: {name: req.body.hospitalName}}).then(function(hospital){
                      db.MedicalStaff.create({
                          name: req.body.name,
                          fk_id: hospital.id, // hospital id
                          email: req.body.email,
                          password: db.MedicalStaff.generateHash(req.body.password, userSalt),
                          salt: userSalt,
                          phoneNumber: req.body.phoneNumber,
                          position: hospitalPosition,
                          authenticationCode: codeString,
                          isVerified: false
                      }).then(function(user) {
                          done(null, user);
                      });
                    })
                 }
                 else{
                     var code = genRand()
                     var codeString = code.toString();
                     db.MedicalStaff.create({
                        name: req.body.name,
                        email: req.body.email,
                        phoneNumber: req.body.phoneNumber,
                        position: hospitalPosition,
                        authenticationCode: codeString,
                        isVerified: false
                     }).then(function(user){
                         done(null, user);
                     });
                 }
            }
        }).catch(function(err){
            console.log(err);
        })
    }
));

/**
 * Passport strategy for hospital staff login
 */

passport.use('local-hospital-staff-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, function(req, username, password, done){
    db.MedicalStaff.findOne({ where: { email: username}})
      .then(function(user){
          if (req.session && req.session.user){
              return done(null, false, {message: 'User already logged in.'});
          }
          if (!user) {
              return done(null, false, {message: 'User does not exist.'});
          }
          if (user.password !==  db.Patient.generateHash(password, user.salt)) {
              return done(null, false, {message: 'Incorrect password.'});
          }
          req.session.user = user;
          return done(null, user);
      }).catch(function(err){
          return done(null, false, {message: 'Login failed, please attempt again.'});
      });
}));

function addPatientToHealthProfiles(email, age) {
  db.HealthProfile.create({
      age: age,
      height: 0,
      weight: 0,
      sex: "None",
      InsuranceProvider: "None",
      prescriptions: "None",
      nonPrescribedDrugs: "None",
      allergies: "None",
      priorOperations: "None",
      fk_email: email
  }).catch(Sequelize.ValidationError, function(err){
      console.log(err);
 })
}

module.exports = passport;
