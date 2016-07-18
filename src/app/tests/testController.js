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
			lat: 34,
			lon: -117,
			zoom: 3,
			customMapTypes: [watg1teamhome],
			customMarkerUrl: "src/assets/images/pin.png",
			showMyLocation: false,
			disableDefaultUI: false,
			mapTypeControl: false,
			fullscreenControl: true,
			disableAutoPan: false,
			shadowStyle: 1,
			showDayNightOverlay: true,
			dayNightOverlayFillColor: 'rgba(0,0,0,0.1)',
			clusterMarkers: [{
					title: "Santa Fe",
					subTitle: "Santa Fe...",
					linkContent: "<a href='http://www.google.com'>My Link</a>",
					lat: 35.6869752,
					lon: -105.937799
				}, {
					title: "Albuquerque",
					subTitle: "Albuquerque...",
					linkContent: "<a href='http://www.google.com'>My Link</a>",
					lat: 35.0853336,
					lon: -106.6055534
				}, {
					title: "Albuquerque 2",
					subTitle: "Albuquerque 2...",
					linkContent: "<a href='http://www.google.com'>My Link</a>",
					lat: 35.0853336,
					lon: -106.6055534
				}, {
					title: "Albuquerque 3",
					subTitle: "Albuquerque 3...",
					linkContent: "<a href='http://www.google.com'>My Link</a>",
					lat: 35.0853336,
					lon: -106.6055534
				}, {
					title: "Albuquerque 4",
					subTitle: "Albuquerque 4...",
					linkContent: "<a href='http://www.google.com'>My Link</a>",
					lat: 35.0853336,
					lon: -106.6055534
				}, {
					title: "New York",
					subTitle: "New York...",
					linkContent: "<a href='http://www.google.com'>My Link</a>",
					lat: 40.7127837,
					lon: -74.0059413
				},
				{
					title: "Austin",
					subTitle: "Austin...",
					linkContent: "<a href='http://www.google.com'>My Link</a>",
					lat: 30.267153,
					lon: -97.7430608
				}
			],
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
				// markers: [{
				// 		title: "London",
				// 		subTitle: "123 Main Road<br/>12345 London, UK<br/><br/>Staff: 83",
				// 		linkContent: "<a href='http://www.google.com'>My Link</a>",
				// 		imgSrc: "https://media-cdn.tripadvisor.com/media/photo-s/02/6b/f3/50/houses-of-parliament.jpg",
				// 		lat: 51.507351,
				// 		lon: -0.127758,
				// 		icon: {
				// 			url: "src/assets/images/london.png",
				// 			origin: new google.maps.Point(0, 0)
				// 		}
				//          }, {
				// 		title: "Singapore",
				// 		subTitle: "Staff: 123",
				// 		linkContent: "<a href='http://www.google.com'>My Link</a>",
				// 		imgSrc: "",
				// 		lat: 1.352083,
				// 		lon: 103.991531,
				// 		icon: {
				// 			url: "src/assets/images/singapore.png",
				// 			origin: new google.maps.Point(0, 0),
				// 			anchor: new google.maps.Point(48, 60)
				// 		}
				//          }, {
				// 		title: "Singapore",
				// 		subTitle: "Staff: 123",
				// 		linkContent: "<a href='http://www.google.com'>My Link</a>",
				// 		imgSrc: "",
				// 		lat: 1.352083,
				// 		lon: 103.991531
				//          }, {
				// 		title: "Irvine",
				// 		subTitle: "123 Main Road<br/>12345 London, UK<br/><br/>Staff: 83",
				// 		linkContent: "<a href='http://www.google.com'>My Link</a>",
				// 		lat: 33.6537373,
				// 		lon: -117.7473137,
				// 		icon: {
				// 			url: "src/assets/images/irvine.png",
				// 			origin: new google.maps.Point(0, 0),
				// 			anchor: new google.maps.Point(32, 0)
				// 		}
				// }, {
				// 		title: "Irvine",
				// 		subTitle: "123 Main Road<br/>12345 London, UK<br/><br/>Staff: 83",
				// 		linkContent: "<a href='http://www.google.com'>My Link</a>",
				// 		lat: 33.6537373,
				// 		lon: -117.7473137
				// }, {
				// 		title: "Los Angeles",
				// 		subTitle: "Staff: 123",
				// 		linkContent: "<a href='http://www.google.com'>My Link</a>",
				// 		imgSrc: "",
				// 		lat: 34.0736204,
				// 		lon: -118.4003563,
				// 		icon: {
				// 			url: "src/assets/images/los angeles.png"
				// 		}
				//          }, {
				// 		title: "Los Angeles",
				// 		subTitle: "Staff: 123",
				// 		linkContent: "<a href='http://www.google.com'>My Link</a>",
				// 		imgSrc: "",
				// 		lat: 34.0736204,
				// 		lon: -118.4003563
				//          }, {
				// 		title: "Honolulu",
				// 		subTitle: "123 Main Road<br/>12345 London, UK<br/><br/>Staff: 83",
				// 		linkContent: "<a href='http://www.google.com'>My Link</a>",
				// 		lat: 21.3074593,
				// 		lon: -157.863499,
				// 		icon: {
				// 			url: "src/assets/images/honolulu.png",
				// 			origin: new google.maps.Point(0, 0),
				// 			anchor: new google.maps.Point(50, 60)
				// 		}
				// }, {
				// 	title: "Honolulu",
				// 	subTitle: "123 Main Road<br/>12345 London, UK<br/><br/>Staff: 83",
				// 	linkContent: "<a href='http://www.google.com'>My Link</a>",
				// 	lat: 21.3074593,
				// 	lon: -157.863499
				// }],
		};
	}
})();
