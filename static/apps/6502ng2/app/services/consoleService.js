System.register(['angular2/core', '../globalConstants'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, globalConstants_1;
    var ConsoleService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (globalConstants_1_1) {
                globalConstants_1 = globalConstants_1_1;
            }],
        execute: function() {
            ConsoleService = (function () {
                function ConsoleService() {
                    this.logEvent = new core_1.EventEmitter();
                    this.lines = [];
                }
                ConsoleService.prototype.log = function (message) {
                    this.lines.push(message);
                    if (this.lines.length > globalConstants_1.Constants.Display.ConsoleLines) {
                        this.lines.splice(0, 1);
                    }
                    this.logEvent.emit(message);
                };
                return ConsoleService;
            }());
            exports_1("ConsoleService", ConsoleService);
        }
    }
});
//# sourceMappingURL=consoleService.js.map