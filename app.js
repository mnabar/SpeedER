'use strict';

const express = require('express');
const passport = require('./src/server/config/passport.js');
const bcrypt = require('bcryptjs');
const bodyParser = require( 'body-parser' );
const session = require('express-session');
const mailTransport = require('./src/server/config/mailer.js');
const parseUrl = require('url').parse;
const querystring = require('querystring');
const app = express();
const port = 3000;
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelizeInstance = require('./src/server/models/models.js').sequelize;

/* Middleware configuration */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('./src/public'));

/*Reference for sessions: 
https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions */

app.use(session({
	name: 'chanoFrom79th!',
	secret: 'PEMLgTJUXk',
	store: new SequelizeStore({
		db: sequelizeInstance
	}),
	resave: true,
	saveUninitialized: false,
	cookie: {maxAge: 86400000} /* 1-day cookie */
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', 'src/public/views');
app.set('view engine', 'pug');

/* Routes */
const patientsRouter = require('./src/server/routes/server.routes.patients.js');
const hospitalsRouter = require('./src/server/routes/server.routes.hospitals.js');
const updateProfilesRouter = require('./src/server/routes/server.routes.updateProfile.js');
const reportsRouter = require('./src/server/routes/server.routes.reports.js');

app.get('/', (req,res) => {
	// populate dummy patient (for testing purposes)
	const userSalt = bcrypt.genSaltSync(10);
	var dummyPatientEmail = "hello@patient.com"
	sequelizeInstance.models.Patient.findOne({ where: {email : dummyPatientEmail }})
		.then(function(patient) {
	        if(patient === null) {

	        	Sequelize.Promise.all([
	        		sequelizeInstance.models.Patient.create({ 
						name: "Dummy Patient",
					 	email: dummyPatientEmail,
					 	password: sequelizeInstance.models.Patient.generateHash("1234567", userSalt),
					 	salt: userSalt,
					 	phoneNumber: "6262218836",
					 	injury: "broken jaw",
					 	age: 25,
					 	isVerified: false
				    }).catch(Sequelize.ValidationError, function(err){
				         console.log(err);

					}), 
					sequelizeInstance.models.HealthProfile.create({ 
						age: 25,
					    height: 0,
					    weight: 0,
					    sex: "None",
					    InsuranceProvider: "None",
					    prescriptions: "None",
					    nonPrescribedDrugs: "None",
					    allergies: "None",
					    priorOperations: "None",
					    fk_email: dummyPatientEmail
				    }).catch(Sequelize.ValidationError, function(err){
				         console.log(err);

					})

				]).spread(function() {
					console.log("Added dummy information for a patient with email 'hello@patient.com'");
				});
	        				     
			}
		})

	// render main page	
	res.render('index', {userObj: req.user});
});

app.get('/verify/doctor', (req, res) => {
	if (!req.session.user || !req.session.user.position) {
		res.render('medicalStaffUnauthorizedPage')
	}
	else {
		sequelizeInstance.models.MedicalStaff.findAll({where:{position:"Doctor", isVerified:false, fk_id: req.session.user.fk_id}}).then(function(medStaff){
			var emails = {}; 
			var actualNames = {};
			for(var i = 0; i < medStaff.length; i++){
				emails[i] = medStaff[i].email;
				actualNames[i] = medStaff[i].name;
			}
			emails["length"] = i;
			/* actualNames["length"] = i; */
			res.render('verifyDoctors', {key: emails, doctorNames: actualNames});
		}).catch(function(err){
			console.log(err); 
			//res.send(401);
		})
	}
});

app.post('/email/doctor', (req, res) => {
	var address = req.body.email;
  
	if (!(Array.isArray(address))) {
		address = [address]; 
	}
  
	sequelizeInstance.models.MedicalStaff.findAll({where: {email: {$in: address}}}).then(function(doctors){
		doctors.forEach(function(doctor) {
			var code = doctor.authenticationCode;
			var address = doctor.email;
			var msg = {};
      
			msg.to = address;
			msg.subject = "Invited to Hospital";
			msg.text = "Please confirm your email by entering this code at our website: " + code;
			mailTransport.sendNotification(msg);
		})

		if (doctors.length <= 0) {
			res.redirect('/verify/doctor')
		}
		else {
			res.render('finishedVerifyingDoctors', {doctors: doctors}); 
		}		

	}).catch(function(err){
		console.log(err);
		//res.send(400);
	})
});


app.post('/validate/account', (req, res) => {
    const code = req.body.verifyKey;
    const name = req.body.email;

    sequelizeInstance.models.MedicalStaff.findOne({where: {email: name, authenticationCode: code}}).then(function(staff){

        sequelizeInstance.models.MedicalStaff.update({
            isVerified : true
        }, {
            where: {
                email: staff.email
            }
        });
            
		req.session.user = staff;
        res.render('doctorSignupVerified');
    }).catch(function(err){
        console.error(err);
        //res.send(err);
        res.render('doctorSignupFailure'); 
    });
});


app.post('/update/bothAssignments', (req, res) => {

	Sequelize.Promise.all([
		sequelizeInstance.models.MedicalStaff.findOne({where: {email: req.body.doctorEmail}})
			.then(function(doctor) {
				if (doctor) {
					doctor.updateAttributes({
						unassigned: false
					})

					var address = doctor.email;
					var msg = {};
					msg.to = address;
					msg.subject = "You've Been Assigned a Patient!";
					msg.text = "Your patient, " + req.body.patientName + ", is on their way! Here is a description of their injury: " + req.body.patientInjury;
					mailTransport.sendNotification(msg);
				}
			}), 

		/* update doctor assignment */
		sequelizeInstance.models.Patient.findOne({where: {email: req.body.patientEmail}})
			.then(function(patient) {
				if (patient) {
					patient.updateAttributes({
						supervisingDoctor: req.body.doctorName
					})
				}
			})
		]).spread(function() {
			res.redirect('/assignPatients')
		});
})


app.get('/unassignDoctors',  (req, res) => {
	if (!req.session.user || !req.session.user.position) {
		res.render('medicalStaffUnauthorizedPage')
	} else {
		sequelizeInstance.models.MedicalStaff.findAll({where:{position:"Doctor", isVerified: true, unassigned: false, fk_id: req.session.user.fk_id}})
			.then(function(doctors){
				var names = {}; // emails
				var actualNames = {};
				for(var i = 0; i < doctors.length; i++){
					names[i] = doctors[i].email;
					actualNames[i] = doctors[i].name;
				}
				names["length"] = i;
				// actualNames["length"] = i;
				res.render('unassignDoctors', {key: names, doctorNames: actualNames});
	
		}).catch(function(err){
			console.log(err); 
			res.send(401);
			// an alert handles this case 
		})

	}
})


app.post('/update/doctorAssignments', (req, res) => {

	var address = req.body.email;

	// check if address is an array
	// $in needs an array 
	if (!(Array.isArray(address))) {
		address = [address]; 
	}

	sequelizeInstance.models.MedicalStaff.findAll({where: {email: {$in: address}}})
		.then(function(doctors) {

			var numDoctors = doctors.length; 

			for (var i = 0; i < numDoctors; i++) {
				if (doctors[i]) {
					doctors[i].updateAttributes({
						unassigned: true
					})
				}

				sequelizeInstance.models.Patient.findOne({where: {supervisingDoctor: doctors[i].name}})
					.then(function(patient) {
						patient.updateAttributes({
							chosenHospital: null, 
							supervisingDoctor: null, 
							isVerified: 0 
						})
						
					})
			}

			if (doctors.length <= 0) {
				res.redirect('/unassignDoctors')
			}
			else {
				res.render('finishedUnassigningDoctors', {doctors: doctors}); 
			}

		}).catch(function(err){
			console.log(err);
			// res.send(400);
			// an alert handles this case 
		})


})


/* Signup Failure */  
app.get('/hospitalSignupFailure', (req, res) => {
	var hospitalPosition; 
    var currURL;       
    
    if (!req.headers.referer) {
        currURL = req.baseUrl; 
    }
    else {
        currURL = req.headers.referer;
    }

 	if ((currURL).search("/doctorSignup") > -1) {
    	res.render('doctorSignupFailure'); 
  	} else if ((currURL).search("/hospitalLogin") > -1) {
    	res.render('hospitalSignupFailure');
  	}	
});


app.get('/patientSignupFailure', (req, res) => {
	res.render('patientSignupFailure');
});
// <----- END SIGNUP FAILURE 

app.get('/pastInjuries', (req,res) => {
	var name = req.session.user.name
	sequelizeInstance.models.InjuryReport.findAll({where: {fk_email: req.session.user.email}}).then(function(info) {
		res.render('pastInjuries', {info: info, name: name});
	})
});

// need two different successful signup pages
app.get('/patientSignupSuccess', (req, res) => {
	res.render('patientSignupSuccess');
});

app.get('/hospitalSignupSuccess', (req, res) => {

	var hospitalPosition; 
    var currURL;       
    
    if (!req.headers.referer) {
        currURL = req.baseUrl; 
    }
    else {
        currURL = req.headers.referer;
    }

 	if ((currURL).search("/doctorSignup") > -1) {
    	res.render('doctorSignupSuccess'); 
  	} else if ((currURL).search("/hospitalLogin") > -1) {
    	res.render('hospitalSignupSuccess');
  	}	

});
// <----- END SIGNUP SUCCESS

app.get('/hospital', (req,res) => {
	res.render('hospital', {hospitalName: "Insert Hospital Name"});
});

app.get('/patientSettings', (req,res) => {
	var name = req.session.user.name
	sequelizeInstance.models.HealthProfile.findAll({where: {fk_email: req.session.user.email}}).then(function(info) {
		res.render('patientSettings', {info: info, name: name});
	})
});

app.get('/confirm', (req,res) => {
	res.render('confirm');
});


/* patient login failure */
app.get('/patientLoginFailure', (req, res) => {
	// if users are already logged in
	if (req.session.user && req.session.user.age) { // if patient
		res.render('patientLoggedIn');
	}
	else {
		res.render('patientLoginFailure');
	}
});

/* hospital login failure */
app.get('/hospitalLoginFailure', (req, res) => {
	// if users are already logged in
	if (req.session.user && (req.session.user.position)) { // if medical staff
		res.render('medicalStaffLoggedIn');
	}
	else {
		res.render('hospitalLoginFailure');
	}
});
// <----- END LOGIN FAILURE 


app.get('/navbarH', (req, res) => {
	if (!req.session.user) {
		res.render('hospitalNavbar'); // person unauthorized to access this page
	} else {
		res.render('hospitalNavbar', {medicalStaffName: req.session.user.name});
	}
}); 


// get profiles for patients and medical staff
app.get('/patientProfile', (req, res) => {
	// make sure req.session.user exists and that req.session.user is patient (by using user age)
	if (!req.session.user || !req.session.user.age) {
		res.render('patientUnauthorizedPage'); // person unauthorized to access this page
	} else {
		res.render('patientProfile', {patientName: req.session.user.name});
	}
});

app.get('/injury', (req, res) => {
	res.render('injuryReport');
});

app.get('/medicalStaffProfile', (req, res) => {
	// make sure req.session.user exists and that req.session.user is patient (by using user position)
	console.log(req.session.user.position); 
	console.log(req.session.user.name); 
	console.log(req.session.user.position.search("Administrator") > -1); 

	if (req.session.user && (req.session.user.position.search("Administrator") > -1)) {
		res.render('medicalStaffProfile', {medicalStaffName: req.session.user.name});
	} else {
		res.render('medicalStaffUnauthorizedPage'); // person unauthorized to access this page
		
	}
});

app.get('/assignPatients', (req, res) => {
	if (!req.session.user || !req.session.user.position) {
		res.render('medicalStaffUnauthorizedPage');
	} else { 
		Sequelize.Promise.all([
		// get hospital information
		sequelizeInstance.models.Hospital.findById(req.session.user.fk_id),
		// find all doctors who work at that hospital 
		sequelizeInstance.models.MedicalStaff.findAll({where:{position:"Doctor", isVerified: true, fk_id: req.session.user.fk_id, $or: [{unassigned:null}, {unassigned:true}]}}),
		// group patients by discomfort level
		sequelizeInstance.query('SELECT * FROM patients JOIN injuryreports ON (patients.email=injuryreports.fk_email) where patients.supervisingDoctor IS NULL and patients.isVerified=1', {type: Sequelize.QueryTypes.SELECT}).then(function(newpatients) {

			// loop over newpatients and add patient
			// gather all recent injury reports for a patient
			var recentInjuryReports = {};
			var newpatientsLen = newpatients.length;

			for (var i = 0; i < newpatientsLen; i++) {
				var email = newpatients[i].email;

				// if patient has filed injury report before
				if (recentInjuryReports[email]){
					// sort by most recent
					var old = recentInjuryReports[email].createdAt; // could also use .timeFiled
					var curr = newpatients[i].createdAt;

					// replace old injuryreport with new one
					if (old < curr) {
						recentInjuryReports[email] = newpatients[i];
					}
				}
				else {
					recentInjuryReports[email] = newpatients[i];
				}
			}

			// divide patients into various discomfort levels (updated for scale of 1-10)
			var level1 = [];	// corresponds to Levels 1 & 2
			var level2 = []; 	// corresponds to Levels 3 & 4
			var level3 = [];	// corresponds to Levels 5 & 6
			var level4 = [];	// corresponds to Levels 7 & 8
			var level5 = [];	// corresponds to Levels 9 & 10

			for (var email in recentInjuryReports) {
				var patientObj = recentInjuryReports[email];
				var patientDiscomfort = patientObj.discomfortLevel;

				if (patientDiscomfort === 1 || patientDiscomfort === 2) {
					level1.push(patientObj);
				} else if (patientDiscomfort === 3 || patientDiscomfort === 4) {
					level2.push(patientObj);
				} else if (patientDiscomfort === 5 || patientDiscomfort === 6) {
					level3.push(patientObj);
				} else if (patientDiscomfort === 7 || patientDiscomfort === 8) {
					level4.push(patientObj);
				} else if (patientDiscomfort === 9 || patientDiscomfort === 10) {
					level5.push(patientObj);
				}
			}

			return [level1, level2, level3, level4, level5];

		})

		])
		.spread(function(hospital, doctors, injuryreports) {
      
			var hospitalName = hospital.dataValues.name; 
			res.render('assignPatients', {hospitalName: hospitalName,
				level1: injuryreports[0],
				level2: injuryreports[1],
				level3: injuryreports[2],
				level4: injuryreports[3],
				level5: injuryreports[4],
				doctors: doctors})
		});
	}
});

app.get('/doctorSignup', (req, res) => {

	sequelizeInstance.query('SELECT name FROM hospitals', {type: Sequelize.QueryTypes.SELECT}).then(function(hospitals) {
		var hospitalNames = []

		for(var i = 0; i < hospitals.length; i++) {
			hospitalNames.push(hospitals[i].name)
		}

		hospitalNames.sort();

		res.render('doctorSignup', {hospitals: hospitalNames});
	})
});

app.use('/report', reportsRouter);
app.use('/patient', patientsRouter);
app.use('/hospitalLogin', hospitalsRouter);
app.use('/patientSettings', updateProfilesRouter);

app.get('*', (req, res) => {
	res.status(404).send('what??');
});

app.listen(port);

console.log("App is listening on port " + port);
