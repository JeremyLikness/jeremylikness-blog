System.register(['angular2/core', 'angular2/platform/browser', 'angular2/http', './components/console', './components/cpuStats', './components/display', './components/compiler', './emulator/compiler', './emulator/opsCodes', './emulator/cpu', './services/consoleService', './services/displayService'], function(exports_1, context_1) {
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
    var core_1, browser_1, http_1, console_1, cpuStats_1, display_1, compiler_1, compiler_2, opsCodes_1, cpu_1, consoleService_1, displayService_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (console_1_1) {
                console_1 = console_1_1;
            },
            function (cpuStats_1_1) {
                cpuStats_1 = cpuStats_1_1;
            },
            function (display_1_1) {
                display_1 = display_1_1;
            },
            function (compiler_1_1) {
                compiler_1 = compiler_1_1;
            },
            function (compiler_2_1) {
                compiler_2 = compiler_2_1;
            },
            function (opsCodes_1_1) {
                opsCodes_1 = opsCodes_1_1;
            },
            function (cpu_1_1) {
                cpu_1 = cpu_1_1;
            },
            function (consoleService_1_1) {
                consoleService_1 = consoleService_1_1;
            },
            function (displayService_1_1) {
                displayService_1 = displayService_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(consoleService) {
                    this.consoleService = consoleService;
                }
                AppComponent.prototype.ngAfterViewInit = function () {
                    this.consoleService.log("Application initialized.");
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'emulator',
                        directives: [console_1.Console, cpuStats_1.CpuStats, display_1.Display, compiler_1.Compiler],
                        templateUrl: 'templates/app.html'
                    }),
                    __param(0, core_1.Inject(consoleService_1.ConsoleService)), 
                    __metadata('design:paramtypes', [Object])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
            browser_1.bootstrap(AppComponent, [
                opsCodes_1.OpCodes,
                compiler_2.Compiler,
                consoleService_1.ConsoleService,
                displayService_1.DisplayService,
                http_1.HTTP_PROVIDERS,
                cpu_1.Cpu
            ]);
        }
    }
});
//# sourceMappingURL=app.js.map