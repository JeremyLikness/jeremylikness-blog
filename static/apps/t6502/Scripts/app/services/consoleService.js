///<reference path="../app.ts"/>
///<reference path="../globalConstants.ts"/>
var Services;
(function (Services) {
    var ConsoleService = (function () {
        function ConsoleService() {
            this.lines = [];
        }
        ConsoleService.prototype.log = function (message) {
            this.lines.push(message);

            if (this.lines.length > Constants.Display.ConsoleLines) {
                this.lines.splice(0, 1);
            }
        };
        return ConsoleService;
    })();
    Services.ConsoleService = ConsoleService;

    Main.App.Services.service("consoleService", ConsoleService);
})(Services || (Services = {}));
