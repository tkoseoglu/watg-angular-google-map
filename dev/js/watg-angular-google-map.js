(function() {
	"use strict";
	angular.module("watgGoogleMapModule", [
    	"ngRoute",
        "ngSanitize"
    ]);
})();

(function() {
	var app = angular.module('watgGoogleMapModule');
	app.config(appConfig);
	app.run(appRun);

	function appConfig($httpProvider, $routeProvider) {
		//this is for CORS operations
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		if (!$httpProvider.defaults.headers.get) {
			$httpProvider.defaults.headers.get = {};
		}
		//disable IE ajax request caching
		$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		//routes
		$routeProvider.when('/test', {
			templateUrl: 'src/app/tests/testView.html',
			controller: 'testController'
		}).otherwise({
			redirectTo: '/test'
		});
	}

	function appRun() {}
})();

(function() {
    "use strict";
    angular.module("watgGoogleMapModule").directive("watgGoogleMap", watgGoogleMapDirective);

    function watgGoogleMapDirective() {
        return {
            restrict: "E",
            template: "<div id='map' class='watgAngularGoogleMap'></div>",
            replace: "true",
            scope: {
                config: "=",
                selectedMapTypeId: "="
            },
            link: link
        };

        function link(scope, element) {
            var map;
            var infowindow;

            function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
            }

            function initMap() {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: scope.config.lat, lng: scope.config.lon },
                    zoom: scope.config.zoom,
                    disableDefaultUI: true,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    disableAutoPan: false,
                    shadowStyle: 1
                });
                //styling
                if (scope.config.customMapTypes.length > 0) {
                    map.mapTypes.set(scope.selectedMapTypeId, scope.config.customMapTypes[0]);
                    map.setMapTypeId(scope.selectedMapTypeId);
                }
                //markers
                if (scope.config.markers.length > 0) {
                    scope.config.markers.forEach(function(m) {
                        var contentString = '<div id="content">';
                        contentString += '<h3>' + m.title + '</h3>';
                        contentString += '<div>' + m.subTitle + '</div>';
                        contentString += '<div>' + m.linkContent + '</div>';
                        contentString + '</div>';
                        infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });
                        var marker = new google.maps.Marker({
                            position: { lat: m.lat, lng: m.lon },
                            map: map,
                            title: m.title,
                            icon: scope.config.customMarkerUrl
                        });
                        marker.addListener('click', function() {
                            infowindow.open(map, marker);
                        });
                    });
                }
                //show my location
                if (scope.config.showMyLocation) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            infoWindow = new google.maps.InfoWindow({ map: map });
                            var pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            infoWindow.setPosition(pos);
                            infoWindow.setContent('You are here!');
                            //map.setCenter(pos);
                        }, function() {
                            handleLocationError(true, infoWindow, map.getCenter());
                        });
                    } else {
                        // Browser doesn't support Geolocation
                        handleLocationError(false, infoWindow, map.getCenter());
                    }
                }
                //overlay
                new DayNightOverlay({
                    map: map
                });
            }
            initMap();
        }
    }
}());

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
