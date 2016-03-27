(function() {
	"use strict";
	angular.module("watgAutocompleteModule", []);
})();

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
