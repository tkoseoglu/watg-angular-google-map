(function() {
	"use strict";
	angular.module("watgGoogleMapModule", []);
})();

(function() {
    "use strict";
    angular.module("watgGoogleMapModule").directive("watgGoogleMap", watgGoogleMapDirective);

    function watgGoogleMapDirective() {
        return {
            restrict: "E",
            template: "<div id='map' style='height:600px;width:1025px;background-color: #fff'></div>",
            replace: "true",
            scope: {
                config: "=",
                selectedMapTypeId:"="
            },
            link: link
        };

        function link(scope, element) {
            console.log("Hello...");
            var map;

            function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
            }

            function initMap() {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: scope.config.lat, lng: scope.config.lon },
                    zoom:  scope.config.zoom,
                    disableDefaultUI: true,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    disableAutoPan: false,
                    shadowStyle: 1
                });
                //styling
                map.mapTypes.set(scope.selectedMapTypeId, scope.config.customMapTypes[0]);
                map.setMapTypeId(scope.selectedMapTypeId);
                //markers
                scope.config.markers.forEach(function(m) {
                    var contentString = '<div id="content">' + '<div id="siteNotice">' + '</div>' + '<h1 id="firstHeading" class="firstHeading">' + m.title + '</h1>' + '<div id="bodyContent">' + '<p><b>Staff:</b>' + m.staff + '</p>' + '<p><a href="my.watg.com/#team?officeName=">Team Members</a></p>' + '</div>';
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    var marker = new google.maps.Marker({
                        position: { lat: m.lat, lng: m.lon },
                        map: map,
                        title: m.title,
                        icon: 'src/assets/images/CustomMarker.png'
                    });
                    marker.addListener('click', function() {
                        infowindow.open(map, marker);
                    });
                });
                //show my location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var infoWindow = new google.maps.InfoWindow({ map: map });
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
                new DayNightOverlay({
                    map: map
                });
            }
            initMap();
        }
    }
}());
