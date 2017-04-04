var map;
var ids			= document.getElementsByName("hospId");
var names 		= document.getElementsByName("hospName");
var phoneNums   = document.getElementsByName("hospPhone");
var addresses	= document.getElementsByName("hospAddress");
var cities		= document.getElementsByName("hospCity");
var states		= document.getElementsByName("hospState");
var zips		= document.getElementsByName("hospZip");
var waits 		= document.getElementsByName("hospWait");
var lats 		= document.getElementsByName("hospLat");
var lngs 		= document.getElementsByName("hospLng");

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(initMap);
	} else {
		var geoLocErr = document.getElementById("geoloc-err");
		geoLocErr.innerHTML = "Geolocation is not supported by this browser.";
	}
}

function makeInfoWindow(name, addrString, id, wait) {
	var contentString =
		'<div>' +
			'<p>' + name + '</p>' +
			'<p>' + addrString + '</p>' +
			'<p>Expected wait: ' + wait + ' mins</p>' +
			'<button type="button" class="btn btn-default" data-toggle="modal" data-target="#confirm" data-hospname="' + name + '" data-hospid="' + id + '" id="btn-confirm-hosp">I\'m going here</button>'
		'</div>';

	return new google.maps.InfoWindow({
			content: contentString,
			maxWidth: 200
	});;
}

function makeMapMarker(latLng) {
	return new google.maps.Marker({
		position: latLng,
		map: map
	});
}

function getAndShowRoutes(dirService, dirDisplay, start, end) {
	var dReq = {
		origin: start,
		destination: end,
		travelMode: 'DRIVING'
	};
	dirService.route(dReq, (result, status) => {
		if (status == 'OK') {
			dirDisplay.setOptions({
				preserveViewport: true,
				suppressMarkers: true
			});
			dirDisplay.setDirections(result);
		}
	});
}

function initMap(position) {
	var dirService = new google.maps.DirectionsService;
	var mapViewPortBounds;

	userLat = position.coords.latitude;
	userLon = position.coords.longitude;
	userLatLng = new google.maps.LatLng(userLat,userLon);
	map = new google.maps.Map(document.getElementById('map'), {
			center: userLatLng,
			zoom: 14,
			mapTypeControl: false
	});
	var userMarker = new google.maps.Marker({
		position: userLatLng,
		map: map,
		icon: 'views/img/user-map-marker.png',
		title: "Current location",
	});

	var changeBoundsListener = map.addListener('idle', function() {
		// create a button
		// create a promise to get bounds
		// resolve the promise, using the 
	});

	var displayHospitalsPromise = new Promise((resolve, reject) => {
		var tilesLoadedListener = google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
			var mapViewportBounds = map.getBounds();
			resolve(mapViewportBounds);
		});
	});

	displayHospitalsPromise.then(bounds => {
		var markerArr = new google.maps.MVCArray();
		var iWinArr = new google.maps.MVCArray();
		for (var i = 0; i < lats.length; i++) {
			var hospLatLng = new google.maps.LatLng(lats[i].innerHTML, lngs[i].innerHTML);
			if (bounds.contains(hospLatLng)) {
				// create directions renderer
				var dirDisplay = new google.maps.DirectionsRenderer;
				dirDisplay.setMap(map);

				// generate map marker and info window
				var addrString = addresses[i].innerHTML + ', ' + cities[i].innerHTML + ', ' + states[i].innerHTML + ' ' + zips[i].innerHTML;
				var iWindow = makeInfoWindow(names[i].innerHTML, addrString, ids[i].innerHTML, waits[i].innerHTML);
				var marker = makeMapMarker(hospLatLng);

				markerArr.push(marker);
				iWinArr.push(iWindow);
				
				// display on map
				iWindow.open(map, marker);
				getAndShowRoutes(dirService, dirDisplay, userLatLng, hospLatLng);
			}
		}
		markerArr.forEach((marker, i) => {
			google.maps.event.addListener(marker, 'click', function() {
				iWinArr.getAt(i).open(map, marker);
			});
		});
	});
}
