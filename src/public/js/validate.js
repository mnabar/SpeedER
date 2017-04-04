$(document).ready(function(){
	$( "#regName" ).keyup(function() {
		var name = document.forms["patientReg"]["regName"].value;
		var namePattern = /^[a-z ,.'-]+$/i;

		if (namePattern.test(name) && name.length > 0) {
		  $('#regName').css('border-color', 'green');
		  $('#nameAlert').css('display', 'none');
		  	return true;
		} else {
			$('#regName').css('border-color', 'red');
			$('#nameAlert').css('display', 'block');
			return false;
		}
	});

	$( "#regEmail" ).keyup(function() {
		var email = document.forms["patientReg"]["regEmail"].value;
		var emailPattern =  /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

		if (emailPattern.test(email)) {
		  $('#regEmail').css('border-color', 'green');
		  $('#emailAlert').css('display', 'none');
		  	return true;
		} else {
			$('#regEmail').css('border-color', 'red');
			$('#emailAlert').css('display', 'block');
			return false;
		}
	});

	$( "#regAge" ).keyup(function() {
		var age = document.forms["patientReg"]["regAge"].value;
		var agePattern = /^\d+$/;

		if (agePattern.test(age) && age >= 0 && age < 120) {
		  $('#regAge').css('border-color', 'green');
		  $('#ageAlert').css('display', 'none');
		  	return true;
		} else {
			$('#regAge').css('border-color', 'red');
			$('#ageAlert').css('display', 'block');
			return false;
		}
	});

	$( "#regSpecialty" ).keyup(function() {
		var name = document.forms["patientReg"]["regSpecialty"].value;
		var namePattern = /^[a-z ,.'-]+$/i;

		if (namePattern.test(name)) {
		  $('#regSpecialty').css('border-color', 'green');
		  $('#specialtyAlert').css('display', 'none');
		  	return true;
		} else {
			$('#regSpecialty').css('border-color', 'red');
			$('#regSpecialtyAlert').css('display', 'block');
			return false;
		}
	});

	$( "#regPhone" ).keyup(function() {
		var phone = document.forms["patientReg"]["regPhone"].value;
		var phonePattern = /^\d+$/;

		if (phonePattern.test(phone) && phone.length > 0) {
		  $('#regPhone').css('border-color', 'green');
		  $('#phoneAlert').css('display', 'none');
		  	return true;
		} else {
			$('#regPhone').css('border-color', 'red');
			$('#phoneAlert').css('display', 'block');
			return false;
		}
	});

	$("#regPwd").keyup(function() {
		var pwd = document.forms["patientReg"]["regPwd"].value;

		if(pwd.length >= 7) {
			$('#regPwd').css('border-color', 'green');
			$('#pwdAlert').css('display', 'none');
			return true;
		} else {
			$('#regPwd').css('border-color', 'red');
			$('#pwdAlert').css('display', 'block');
			return false;
		}
	});

	$( "#regChkPwd" ).keyup(function() {
		var pwd = document.forms["patientReg"]["regPwd"].value;
		var chkPwd = document.forms["patientReg"]["regChkPwd"].value;

		if (pwd == chkPwd) {
		  $('#regChkPwd').css('border-color', 'green');
		  $('#pwdChkAlert').css('display', 'none');
		  	return true;
		} else {
			$('#regChkPwd').css('border-color', 'red');
			$('#pwdChkAlert').css('display', 'block');
			return false;
		}
	});

	$( "#regChkPhone" ).keyup(function() {
		var phone = document.forms["patientReg"]["regPhone"].value;
		var chkPhone = document.forms["patientReg"]["regChkPhone"].value;

		if (phone == chkPhone) {
		  $('#regChkPhone').css('border-color', 'green');
		  $('#phoneChkAlert').css('display', 'none');
		  	return true;
		} else {
			$('#regChkPhone').css('border-color', 'red');
			$('#phoneChkAlert').css('display', 'block');
			return false;
		}
	});

	$( "#regChkEmail" ).keyup(function() {
		var email = document.forms["patientReg"]["regEmail"].value;
		var chkEmail = document.forms["patientReg"]["regChkEmail"].value;

		if (email == chkEmail) {
		  $('#regChkEmail').css('border-color', 'green');
		  $('#emailChkAlert').css('display', 'none');
		  	return true;
		} else {
			$('#regChkEmail').css('border-color', 'red');
			$('#emailChkAlert').css('display', 'block');
			return false;
		}
	});

	$("#pRegBtn").click(function(e) {
		var name = document.forms["patientReg"]["regName"].value;
		var namePattern = /^[a-z ,.'-]+$/i;
		var email = document.forms["patientReg"]["regEmail"].value;
		var emailPattern =  /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
		var age = document.forms["patientReg"]["regAge"].value;
		var agePattern = /^\d+$/;
		var phone = document.forms["patientReg"]["regPhone"].value;
		var phonePattern = /^\d+$/;
		var pwd = document.forms["patientReg"]["regPwd"].value;
		var chkPwd = document.forms["patientReg"]["regChkPwd"].value;

		if (!(namePattern.test(name) && emailPattern.test(email) &&
			agePattern.test(age) && age >= 0 && age < 120 && phonePattern.test(phone) &&
			pwd.length >= 7 && pwd == chkPwd)) {

			e.preventDefault();
            alert("One or more inputs is not within the parameters. Check any error messages above each field for more information.");

		}
	});

	$("#verifyDoctorsBtn").click(function(e) {
		console.log("THE LENGTH IS"); 
		console.log($('#verifyDoctorsForm input:checked').length);

		if (($('#verifyDoctorsForm input:checked').length) == 0) {
			alert("Please select at least one doctor!"); 
		}

	})

	$("#unassignDoctorsBtn").click(function(e) {
		console.log("THE LENGTH IS"); 
		console.log($('#unassignDoctorsForm input:checked').length);

		if (($('#unassignDoctorsForm input:checked').length) == 0) {
			alert("Please select at least one doctor!"); 
		}

	})


});
