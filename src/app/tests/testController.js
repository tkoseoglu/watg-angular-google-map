(function() {
	"use strict";
	angular.module("watgGoogleMapModule").controller("testController", ['$scope', testController]);

	function testController($scope) {
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
		$scope.selectedMapTypeId = 'watg1_team_home';
		$scope.mapConfig = {
			lat: 30,
			lon: 10,
			zoom: 2,
			customMapTypes: [watg1teamhome],
			customMarkerUrl: "src/assets/images/CustomMarker.png",
			showMyLocation: false,
			markers: [{
					title: "London",
					subTitle:"Staff: 83",
					linkContent:"<a href='http://www.google.com'>My Link</a>",
					lat: 51.507351,
					lon: -0.127758
            },
				{
					title: "Singapore",
					subTitle:"Staff: 123",
					linkContent:"<a href='http://www.google.com'>My Link</a>",
					lat: 1.352083,
					lon: 103.991531
            }]
		};
	}
})();
