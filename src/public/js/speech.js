
$(document).ready(function(){
	var recognizing = false;
	$("#toggleRecording").click(function(){
		if (recognizing) {
			recognition.stop();
			return;
		}
		if (window.hasOwnProperty('webkitSpeechRecognition')) {
			var recognition = new webkitSpeechRecognition();
			recognition.continuous = false;
			recognition.interimResults = false;
			recognition.lang = "en-US";
			recognition.start();
			recognition.onstart = function() { 
				recognizing = true; 
			}
			recognition.onresult = function(e) {
				console.log(e);
				document.getElementById('injury').value = e.results[0][0].transcript;
				recognition.stop();
			};
			recognition.onerror = function(e) {
				recognition.stop();
			}
			recognition.onend = function() {
				recognizing = false;
			}
    	}
	})
});