System.register(['angular2/core', '../services/consoleService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, consoleService_1;
    var Console;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (consoleService_1_1) {
                consoleService_1 = consoleService_1_1;
            }],
        execute: function() {
            Console = (function () {
                function Console(element, consoleService) {
                    this.element = element;
                    this.consoleService = consoleService;
                    this.lines = consoleService.lines;
                }
                Console.prototype.ngAfterViewInit = function () {
                    var div = this.element.nativeElement.getElementsByTagName('div')[0];
                    this.consoleService.logEvent.asObservable().debounceTime(100).subscribe(function (data) {
                        div.scrollTop = div.scrollHeight;
                    });
                };
                Console.prototype.clear = function () {
                    this.lines.length = 0;
                    this.lines.push("Consoled cleared.");
                };
                Console = __decorate([
                    core_1.Component({
                        selector: 'console',
                        templateUrl: 'templates/console.html'
                    }),
                    __param(1, core_1.Inject(consoleService_1.ConsoleService)), 
                    __metadata('design:paramtypes', [core_1.ElementRef, Object])
                ], Console);
                return Console;
            }());
            exports_1("Console", Console);
        }
    }
});
//# sourceMappingURL=console.js.map