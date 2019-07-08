///<reference path="../globalConstants.ts"/>
///<reference path="../app.ts"/>
var Services;
(function (Services) {
    var DisplayService = (function () {
        function DisplayService() {
            this.pixels = new Array(Constants.Display.Size);
            this.callback = null;
        }
        DisplayService.prototype.draw = function (address, value) {
            var target = address & Constants.Display.Max;
            this.pixels[target] = value & Constants.Memory.ByteMask;

            if (this.callback !== null) {
                this.callback(address, value);
            }
        };
        return DisplayService;
    })();
    Services.DisplayService = DisplayService;

    Main.App.Services.service("displayService", DisplayService);
})(Services || (Services = {}));
