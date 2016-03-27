(function() {
	"use strict";
	angular.module("watgGoogleMapModule", []);
})();

(function() {
    "use strict";
    angular.module("watgGoogleMapModule").directive("watgGoogleMapDirective", watgGoogleMapDirective);

    function watgGoogleMapDirective() {
        return {
            restrict: "A",
            require: "ngModel",
            scope: {
                config: "="
            },
            link: link
        };

        function link(scope, element) {

        }
    }
}());
