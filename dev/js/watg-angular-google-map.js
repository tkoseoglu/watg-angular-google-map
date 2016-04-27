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
                    disableDefaultUI: scope.config.disableDefaultUI,
                    mapTypeControl: scope.config.mapTypeControl,
                    fullscreenControl: scope.config.fullscreenControl,
                    disableAutoPan: scope.config.disableAutoPan,
                    shadowStyle: scope.config.shadowStyle
                });
                //styling
                if (scope.config.customMapTypes.length > 0) {
                    map.mapTypes.set(scope.selectedMapTypeId, scope.config.customMapTypes[0]);
                    map.setMapTypeId(scope.selectedMapTypeId);
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
                    map: map,
                    fillColor: scope.config.dayNightOverlayFillColor || 'rgba(0,0,0,0.3)'
                });
                scope.$watchCollection('config.markers', function(newValue, oldValue) {
                    //markers
                    console.log("config.markers collection changed...");
                    if (scope.config.markers.length > 0) {
                        console.log(newValue);
                        scope.config.markers.forEach(function(m) {
                            var contentString = "<div>";
                            contentString += "<div style='float:left;margin-right:5px;'>";
                            if (m.imgSrc) {
                                contentString += "<img src='" + m.imgSrc + "' style='height:100px'/></div>";
                            }
                            contentString += "<div style='float:right;margin-left:5px;'>";
                            contentString += '<div><b>' + m.title + '</b></div>';
                            contentString += '<div>' + m.subTitle + '</div>';
                            contentString += '<div>' + m.linkContent + '</div>';
                            contentString + '</div>';
                            contentString + '</div>';
                            var markerInfowindow = new google.maps.InfoWindow({
                                content: contentString
                            });
                            var marker = new google.maps.Marker({
                                position: { lat: m.lat, lng: m.lon },
                                map: map,
                                title: m.title,
                                icon: scope.config.customMarkerUrl
                            });
                            marker.addListener('click', function() {
                                markerInfowindow.open(map, marker);
                            });
                        });
                    }
                });
                scope.$watchCollection('config.clusterMarkers', function(newValue, oldValue) {
                    //markers
                    console.log("config.clusterMarkers collection changed...");
                    if (scope.config.clusterMarkers.length > 0) {
                        var clusterMarkers = [];
                        scope.config.clusterMarkers.forEach(function(m) {
                            var contentString = "<div>";
                            contentString += "<div style='float:left;margin-right:5px;'>";
                            if (m.imgSrc) {
                                contentString += "<img src='" + m.imgSrc + "' style='height:100px'/></div>";
                            }
                            contentString += "<div style='float:right;margin-left:5px;'>";
                            contentString += '<div><b>' + m.title + '</b></div>';
                            contentString += '<div>' + m.subTitle + '</div>';
                            contentString += '<div>' + m.linkContent + '</div>';
                            contentString + '</div>';
                            contentString + '</div>';
                            var markerInfowindow = new google.maps.InfoWindow({
                                content: contentString
                            });
                            var marker = new google.maps.Marker({
                                position: { lat: m.lat, lng: m.lon },
                                title: m.title,
                                icon: scope.config.customMarkerUrl
                            });
                            marker.addListener('click', function() {
                                markerInfowindow.open(map, marker);
                            });
                            clusterMarkers.push(marker);
                        });
                        var markerCluster = new MarkerClusterer(map, clusterMarkers);
                    }
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
			lat: 15,
			lon: 0,
			zoom: 3,
			customMapTypes: [watg1teamhome],
			customMarkerUrl: "src/assets/images/CustomMarker.png",
			showMyLocation: false,
			disableDefaultUI: false,
			mapTypeControl: false,
			fullscreenControl: false,
			disableAutoPan: false,
			shadowStyle: 1,
			dayNightOverlayFillColor: 'rgba(0,0,0,0.1)',
			markers: [{
					title: "London",
					subTitle: "123 Main Road<br/>12345 London, UK<br/><br/>Staff: 83",
					linkContent: "<a href='http://www.google.com'>My Link</a>",
					imgSrc: "https://media-cdn.tripadvisor.com/media/photo-s/02/6b/f3/50/houses-of-parliament.jpg",
					lat: 51.507351,
					lon: -0.127758
            },
				{
					title: "Singapore",
					subTitle: "Staff: 123",
					linkContent: "<a href='http://www.google.com'>My Link</a>",
					imgSrc: "",
					lat: 1.352083,
					lon: 103.991531
            }],
			clusterMarkers: [{
					title: "Irvine",
					subTitle: "123 Main Road<br/>12345 London, UK<br/><br/>Staff: 83",
					linkContent: "<a href='http://www.google.com'>My Link</a>",
					imgSrc: "https://media-cdn.tripadvisor.com/media/photo-s/02/6b/f3/50/houses-of-parliament.jpg",
					lat: 33.6537373,
					lon: -117.7473137
            },
				{
					title: "Los Angeles",
					subTitle: "Staff: 123",
					linkContent: "<a href='http://www.google.com'>My Link</a>",
					imgSrc: "",
					lat: 34.0736204,
					lon: -118.4003563
            }]
		};
	}
})();
