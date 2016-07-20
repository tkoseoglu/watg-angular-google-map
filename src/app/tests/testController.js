(function() {
	"use strict";
	angular.module("watgGoogleMapModule").controller("testController", ['$scope', "$http", testController]);

	function testController($scope, $http) {
		var watg1teamhome = new google.maps.StyledMapType([
			{
				"featureType": "landscape",
				"stylers": [{ "color": "#808080" }]
                    }, {
				"featureType": "water",
				"stylers": [{ "color": "#ffffff" }]
                    }, {
				"featureType": "administrative",
				"elementType": "geometry.fill",
				"stylers": [{ "visibility": "off" }]
                    }, {
				"featureType": "road",
				"stylers": [{ "visibility": "off" }]
                    }, {
				"featureType": "transit",
				"stylers": [{ "visibility": "off" }]
                    }, {
				"featureType": "poi",
				"stylers": [{ "visibility": "off" }]
                    }, {
				"elementType": "labels.text.stroke",
				"stylers": [{ "visibility": "off" }]
            }], {
			name: 'WATG1 Team Home'
		});
		var emptyStyle = new google.maps.StyledMapType([]);
		$scope.selectedMapTypeId = 'watg1_team_home';
		$scope.mapConfig = {
			lat: 34,
			lon: -117,
			zoom: 3,
			customMapTypes: [emptyStyle],
			customMarkerUrl: "src/assets/images/pin.png",
			showMyLocation: false,
			disableDefaultUI: false,
			mapTypeControl: false,
			fullscreenControl: true,
			disableAutoPan: false,
			shadowStyle: 1,
			showDayNightOverlay: true,
			dayNightOverlayFillColor: 'rgba(0,0,0,0.1)',
			fixOverlappingPins: true,
			clusterMarkers: [],
			clusterGridSize: 100,
			clusterStyles: [{
				textColor: "white",
				fontFamily: "'Open Sans', Arial",
				textSize: 18,
				url: 'src/assets/images/custom/clusterMarker.png',
				height: 52,
				width: 53
            	}],
			markers: []
		};
		$http.get('../src/assets/locations.js').success(function(response) {
			console.log(response);
			$scope.mapConfig.clusterMarkers = response;
		});
		$http.get('../src/assets/markers.js').success(function(response) {
			console.log(response);
			$scope.mapConfig.markers = response;
		});
	}
})();
