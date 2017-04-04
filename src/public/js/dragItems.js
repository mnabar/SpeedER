// All code taken from: 
// https://www.w3schools.com/html/html5_draganddrop.asp

var matchedData = {};


// http://stackoverflow.com/questions/1767246/check-if-string-begins-with-something
function beginsWith(first, word){
    return (word.substr(0, first.length) == first);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    // for testing purposes
    // console.log("DROP"); 
    // console.log(data); 

    // reference: http://stackoverflow.com/questions/9928679/remove-the-string-on-the-beginning-of-an-url
    if(beginsWith('patient', data)) {
    	var stripPatientIdentifier = data.replace("patient","");
    	// console.log(stripPatientIdentifier);
    	matchedData.patientEmail = stripPatientIdentifier;
    	var patientTextInfo = document.getElementById(data).textContent.split('|');
    	matchedData.patientName = patientTextInfo[0]; 
    	matchedData.patientInjury = patientTextInfo[1]; 
    	// console.log(matchedData.patientName); 
    	// console.log(matchedData.patientInjury); 
    } else {
    	var stripDoctorIdentifier = data.replace("doctor","");
    	// console.log(stripDoctorIdentifier); 
    	matchedData.doctorEmail = stripDoctorIdentifier;
    	matchedData.doctorName = document.getElementById(data).textContent; 
    }

    ev.target.appendChild(document.getElementById(data));
}

// reference: http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
function destroyBody(el) {
	// find number of children 

	// TO DO: 
	// 1. send information to database with patient queue
	// 2. notify doctor 

	var myNode = document.getElementById(el);
	var children = myNode.childNodes;
	var numNodes = children.length; 


	// check if only two children 
	if (numNodes === 2){
		var patientCount = 0; 
		var doctorCount = 0; 

		// testing to see whether we have 1 doctor and 1 patient 
		for(i=0; i < numNodes; i++) {
			// get child 
			var temp = children[i]; 
			// test if child is patient or doctor
			if(temp.classList.contains("patient")) {
				patientCount += 1; 
			}
			if(temp.classList.contains("doctor")) {
				doctorCount += 1; 
			} 
		}
		
		// console.log(patientCount); 
		// console.log(doctorCount); 

		// remove children if we have the proper inputs 
		if (patientCount === 1 && doctorCount === 1) {
			$.ajax({
				type: "POST",
				url: "/update/bothAssignments",
				data: matchedData
			});
			while (myNode.firstChild) {
				myNode.removeChild(myNode.firstChild);
			}
			// TO DO: UPDATE DATABASE HERE 
			// SEND NOTIFICATIONS 
		}
		else {
			alert("You can only assign one patient to one doctor.")
		}

	}
	else {
		alert("You can only assign one patient to one doctor.")
	}
}





