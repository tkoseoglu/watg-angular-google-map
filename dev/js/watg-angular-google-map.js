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
    angular.module("watgGoogleMapModule").directive("watgGoogleMap", ["$http", watgGoogleMapDirective]);

    function watgGoogleMapDirective($http) {
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
            var mapElement;
            var infowindow;
            var clusterMarkers = [];
            var randomMin = -0.05;
            var randomMax = 0.05;
            var options = {
                imagePath: 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m',
                gridSize: scope.config.clusterGridSize,
                styles: scope.config.clusterStyles
            };
            var markerClusterer;

            function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
            }

            function removeAllMarkers() {
                for (var i = 0; i < scope.config.markers.length; i++) {
                    scope.config.markers[i].map = null;
                }
                console.log("all markers removed");
            }

            function removeAllClusterMarkers() {
                for (var i = 0; i < clusterMarkers.length; i++) {
                    clusterMarkers[i].setMap(null);
                }
                clusterMarkers = [];
                if (markerClusterer !== undefined) markerClusterer.clearMarkers();
                console.log("all cluster markers removed");
            }

            function getRandomNumber(min, max) {
                var ran = Math.random() * (max - min) + min;
                return ran;
            }

            function initMap() {
                mapElement = document.getElementById('map');
                map = new google.maps.Map(mapElement, {
                    center: { lat: scope.config.lat, lng: scope.config.lon },
                    zoom: scope.config.zoom,
                    disableDefaultUI: scope.config.disableDefaultUI,
                    mapTypeControl: scope.config.mapTypeControl,
                    fullscreenControl: scope.config.fullscreenControl,
                    disableAutoPan: scope.config.disableAutoPan,
                    shadowStyle: scope.config.shadowStyle
                });
                //styling
                if (scope.config.customMapTypes !== undefined && scope.config.customMapTypes.length > 0) {
                    map.mapTypes.set(scope.selectedMapTypeId, scope.config.customMapTypes[0]);
                    map.setMapTypeId(scope.selectedMapTypeId);
                }
                //resize
                google.maps.event.trigger(map, 'resize');
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
                if (scope.config.showDayNightOverlay) {
                    new DayNightOverlay({
                        map: map,
                        fillColor: scope.config.dayNightOverlayFillColor || 'rgba(0,0,0,0.3)'
                    });
                }
                scope.$watchCollection('config.markers', function(newValue, oldValue) {
                    removeAllMarkers();
                    console.log("config.markers collection changed...");
                    if (scope.config.markers.length > 0) {
                        scope.config.markers.forEach(function(m) {
                            var contentUrl = m.contentUrl;
                            var markerInfowindow = new google.maps.InfoWindow();
                            var marker = new google.maps.Marker({
                                position: { lat: m.lat, lng: m.lon },
                                map: map,
                                title: m.title,
                                icon: m.icon,
                            });
                            marker.addListener('click', function() {
                                markerInfowindow.open(map, marker);
                                getInfoWindowContent(contentUrl).then(function(result) {
                                    markerInfowindow.setContent(result);
                                });
                            });
                        });
                    }
                });
                scope.$watchCollection('config.clusterMarkers', function(newValue, oldValue) {
                    removeAllClusterMarkers();
                    console.log("config.clusterMarkers collection changed...");
                    if (scope.config.clusterMarkers.length > 0) {
                        var counter = 0;
                        scope.config.clusterMarkers.forEach(function(m) {
                            var latLng = new google.maps.LatLng(m.lat, m.lon);
                            //fix lat/lon for pins on same exact postion
                            if (scope.config.fixOverlappingPins) {
                                for (var i = 0; i < clusterMarkers.length; i++) {
                                    var existingMarker = clusterMarkers[i];
                                    var pos = existingMarker.getPosition();
                                    if (latLng.equals(pos)) {
                                        var a = 360.0 / clusterMarkers.length;
                                        var ran1 = getRandomNumber(randomMin, randomMax);
                                        var ran2 = getRandomNumber(randomMin, randomMax);
                                        var newLat = pos.lat() + ran1 * Math.cos((+a * i) / 180 * Math.PI); //x
                                        var newLng = pos.lng() + ran2 * Math.sin((+a * i) / 180 * Math.PI); //Y
                                        latLng = new google.maps.LatLng(newLat, newLng);
                                    }
                                }
                            }
                            var marker = new google.maps.Marker({
                                position: latLng,
                                title: m.title,
                                icon: scope.config.customMarkerUrl,
                                textColor: "white"
                            });
                            var contentUrl = m.contentUrl;
                            var markerInfowindow = new google.maps.InfoWindow();
                            marker.addListener('click', function() {
                                markerInfowindow.open(map, marker);
                                getInfoWindowContent(contentUrl).then(function(result) {
                                    markerInfowindow.setContent(result);
                                });
                            });
                            clusterMarkers.push(marker);
                            counter++;
                        });
                    }
                    markerClusterer = new MarkerClusterer(map, clusterMarkers, options);
                });
                scope.$watch('config.mapHeight', function(newValue, oldValue) {
                    if (newValue !== "" && newValue !== oldValue) {
                        console.log("Config height change to %s", newValue);
                        $("#map").height(newValue + 'px');
                        google.maps.event.trigger(map, 'resize');
                    }
                });
                scope.$watch('config.mapWidth', function(newValue, oldValue) {
                    if (newValue !== "" && newValue !== oldValue) {
                        console.log("Config width change to %s", newValue);
                        //$("#map").width(newValue + 'px');
                        google.maps.event.trigger(map, 'resize');
                    }
                });
            }

            function getInfoWindowContent(url) {
                console.log("Getting content from %s", url)
                return $http({
                    method: 'GET',
                    withCredentials: true,
                    url: url
                }).
                then(function(response) {
                    return response.data;
                });
            }
            initMap();
        }
    }
}());

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
		$http.get('../src/assets/locations2.js').success(function(response) {
			console.log(response);
			$scope.mapConfig.clusterMarkers = response;
		});
		$http.get('../src/assets/markers.js').success(function(response) {
			console.log(response);
			$scope.mapConfig.markers = response;
		});
	}
})();
