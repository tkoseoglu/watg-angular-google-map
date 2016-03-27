(function() {
	"use strict";
	angular.module("watgAutocompleteModule", [
    	"ngRoute",
        "ngSanitize"
    ]);
})();

(function() {
	var app = angular.module('watgAutocompleteModule');
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
    angular.module("watgAutocompleteModule").directive("watgAutocompleteOld", watgAutocompleteOld);

    function watgAutocompleteOld() {
        return {
            restrict: "A",
            require: "ngModel",
            scope: {
                selectedItem: "=",
                config: "="
            },
            link: link
        };

        function link(scope, element) {
            console.log(scope.config);
            console.log(scope.selectedItem);
            if (scope.config !== null && scope.config !== undefined && scope.config.url !== undefined) {
                $(function() {
                    element.autocomplete({
                        source: function(request, response) {
                            $.ajax({
                                url: scope.config.url,
                                dataType: "json",
                                xhrFields: {
                                    "withCredentials": true
                                },
                                data: {
                                    namePart: request.term
                                },
                                success: function(data) {
                                    if (data) {
                                        if (data.length === 0 && scope.selectedItem) {
                                            scope.selectedItem = {};
                                            scope.$apply();
                                        }
                                        response($.map(data, function(item) {
                                            if (data.length === 1) {
                                                scope.selectedItem = item;
                                                scope.$apply();
                                            }
                                            return {
                                                id: item.Id,
                                                value: item[scope.config.displayValue],
                                                item: item
                                            };
                                        }));
                                    }
                                },
                                error: function(data) {
                                    console.log(data);
                                }
                            });
                        },
                        delay: scope.config.delay,
                        minLength: scope.config.minLength,
                        select: function(event, ui) {
                            scope.selectedItem = ui.item.item;
                            scope.$apply();
                        },
                        open: function() {
                            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                        },
                        close: function() {
                            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                        }
                    });
                });
            } else {
                console.error("watg-angular-google-map: No configuration found");
            }
        }
    }
}());

(function() {
    "use strict";
    angular.module("watgAutocompleteModule").directive("watgAutocomplete", watgAutocomplete);

    function watgAutocomplete() {
        return {
            restrict: "E",
            require: "ngModel",
            template: "<input type='text' class='form-control' />",
            replace: "true",
            scope: {
                selectedItem: "=",
                config: "="
            },
            link: link
        };

        function link(scope, element) {
            try {
                if (scope.config !== null && scope.config !== undefined && scope.config.url !== undefined) {
                    element.autocomplete({
                        source: function(request, response) {
                            $.ajax({
                                url: scope.config.url,
                                dataType: "json",
                                xhrFields: {
                                    "withCredentials": true
                                },
                                data: {
                                    namePart: request.term
                                },
                                success: function(data) {
                                    if (data) {
                                        if (scope.config.forceSelection && data.length === 0 && scope.selectedItem) {
                                            scope.selectedItem = {};
                                            scope.$apply();
                                        }
                                        response($.map(data, function(item) {
                                            if (scope.config.forceSelection && data.length === 1) {
                                                scope.selectedItem = item;
                                                scope.$apply();
                                            }
                                            var value = item[scope.config.displayValue];
                                            if (scope.config.displayValue2 && item[scope.config.displayValue2] !== undefined) {
                                                var value2 = item[scope.config.displayValue2];
                                                if (value2 !== null) {
                                                    if (scope.config.displayValue3 && value2[scope.config.displayValue3] !== undefined) {
                                                        var value3 = item[scope.config.displayValue2][scope.config.displayValue3]
                                                        value += " (" + value3 + ")";
                                                    } else {
                                                        value += " (" + value2 + ")";
                                                    }
                                                }
                                            }
                                            return {
                                                id: item.Id,
                                                value: value,
                                                item: item
                                            };
                                        }));
                                    }
                                },
                                error: function(data) {
                                    console.log(data);
                                }
                            });
                        },
                        delay: scope.config.delay,
                        minLength: scope.config.minLength,
                        select: function(event, ui) {
                            scope.selectedItem = ui.item.item;
                            scope.$apply();
                        },
                        open: function() {
                            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                        },
                        close: function() {
                            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                        }
                    });
                } else {
                    console.error("watg-angular-google-map: No configuration found");
                }
            } catch (e) {
                console.error("watg-angular-google-map: error " + e);
            }
        }
    }
}());

(function() {
	"use strict";
	angular.module("watgAutocompleteModule").controller("testController", ['$scope', testController]);

	function testController($scope) {
		$scope.autoCompleteConfigStaff = {
            url: "http://irv9909zdqzq1/watgxapirest/api/Staff/AutoCompleteStaff",
            displayValue: 'FullName',
            delay: 200,
            minLength:1
        };
        $scope.autoCompleteConfigCountry = {
            url: "http://irv9909zdqzq1/watgxapirest/api/Common/AutoCompleteWatgCountries",
            displayValue: 'Name',
            delay: 200,
            minLength:1
        };
		$scope.staff = {};
		$scope.country = {};
	}
})();
