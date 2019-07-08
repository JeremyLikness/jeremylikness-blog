System.register(['../globalConstants'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var globalConstants_1;
    var DisplayService;
    return {
        setters:[
            function (globalConstants_1_1) {
                globalConstants_1 = globalConstants_1_1;
            }],
        execute: function() {
            DisplayService = (function () {
                function DisplayService() {
                    this.pixels = new Array(globalConstants_1.Constants.Display.Size);
                    this.callback = function (address, value) { };
                }
                DisplayService.prototype.draw = function (address, value) {
                    var target = address & globalConstants_1.Constants.Display.Max;
                    this.pixels[target] = value & globalConstants_1.Constants.Memory.ByteMask;
                    this.callback(address, value);
                };
                ;
                return DisplayService;
            }());
            exports_1("DisplayService", DisplayService);
        }
    }
});
//# sourceMappingURL=displayService.js.map