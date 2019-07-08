///<reference path="../app.ts"/>
///<reference path="../services/consoleService.ts"/>
var Directives;
(function (Directives) {
    var Console = (function () {
        function Console() {
        }
        Console.Factory = function (consoleService) {
            return {
                restrict: "E",
                template: "<div class='console'><span ng-repeat='line in lines'>{{line}}<br/></span></div>",
                scope: {},
                link: function (scope, element, attrs) {
                    var element = angular.element(element);
                    scope.lines = consoleService.lines;
                    scope.$watch("lines", function (newValue) {
                        var div = $(element).get(0).childNodes[0];
                        $(div).scrollTop(div.scrollHeight);
                    }, true);
                }
            };
        };
        return Console;
    })();
    Directives.Console = Console;

    Main.App.Directives.directive("console", ["consoleService", Console.Factory]);
})(Directives || (Directives = {}));
