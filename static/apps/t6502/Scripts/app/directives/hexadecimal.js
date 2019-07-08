///<reference path="../app.ts"/>
var Directives;
(function (Directives) {
    var Hexadecimal = (function () {
        function Hexadecimal() {
        }
        Hexadecimal.Factory = function () {
            return {
                restrict: "A",
                require: 'ngModel',
                link: function (scope, element, attrs, ctrl) {
                    ctrl.$parsers.push(function (value) {
                        var address = parseInt(value, 16);
                        var isValid = !isNaN(address) && address >= 0 && address < Constants.Memory.Size;
                        ctrl.$setValidity('hexadecimal', isValid);
                        return isValid ? value : undefined;
                    });
                }
            };
        };
        return Hexadecimal;
    })();
    Directives.Hexadecimal = Hexadecimal;

    Main.App.Directives.directive("hexadecimal", [Hexadecimal.Factory]);
})(Directives || (Directives = {}));
