///<reference path="../app.ts"/>
var Filters;
(function (Filters) {
    var HexadecimalFilter = (function () {
        function HexadecimalFilter() {
        }
        HexadecimalFilter.Factory = function () {
            return function (input) {
                if (angular.isNumber(input)) {
                    return "0x" + Number(input).toString(16).toUpperCase();
                }

                return input;
            };
        };
        return HexadecimalFilter;
    })();
    Filters.HexadecimalFilter = HexadecimalFilter;

    Main.App.Filters.filter("hexadecimal", [HexadecimalFilter.Factory]);
})(Filters || (Filters = {}));
