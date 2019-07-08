///<reference path="../app.ts"/>
var Filters;
(function (Filters) {
    var EightBitsFilter = (function () {
        function EightBitsFilter() {
        }
        EightBitsFilter.Factory = function () {
            return function (input) {
                var padding = "00000000";

                if (angular.isNumber(input)) {
                    var result = padding + input.toString(2);
                    return result.substring(result.length - 8, result.length);
                }

                return input;
            };
        };
        return EightBitsFilter;
    })();
    Filters.EightBitsFilter = EightBitsFilter;

    Main.App.Filters.filter("eightbits", [EightBitsFilter.Factory]);
})(Filters || (Filters = {}));
