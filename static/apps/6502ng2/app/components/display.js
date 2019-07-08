System.register(['angular2/core', '../emulator/palette', '../services/displayService', '../services/consoleService', '../globalConstants'], function(exports_1, context_1) {
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
    var core_1, palette_1, displayService_1, consoleService_1, globalConstants_1;
    var Display;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (palette_1_1) {
                palette_1 = palette_1_1;
            },
            function (displayService_1_1) {
                displayService_1 = displayService_1_1;
            },
            function (consoleService_1_1) {
                consoleService_1 = consoleService_1_1;
            },
            function (globalConstants_1_1) {
                globalConstants_1 = globalConstants_1_1;
            }],
        execute: function() {
            Display = (function () {
                function Display(displayService, consoleService) {
                    var _this = this;
                    this.displayService = displayService;
                    this.consoleService = consoleService;
                    this.canvasHeight = globalConstants_1.Constants.Display.CanvasYMax;
                    this.canvasWidth = globalConstants_1.Constants.Display.CanvasXMax;
                    consoleService.log("Initializing the display...");
                    this.pixelBuffer = new Array(globalConstants_1.Constants.Display.Size);
                    var paletteGenerator = new palette_1.Palette();
                    this.palette = paletteGenerator.getPalette();
                    consoleService.log("Palette has been generated.");
                    for (var y = 0; y < globalConstants_1.Constants.Display.YMax; y += 1) {
                        for (var x = 0; x < globalConstants_1.Constants.Display.XMax; x += 1) {
                            var idx = y * globalConstants_1.Constants.Display.XMax + x;
                            var xOffs = x * globalConstants_1.Constants.Display.XFactor;
                            var yOffs = y * globalConstants_1.Constants.Display.YFactor;
                            this.pixelBuffer[idx] = {
                                x: xOffs,
                                y: yOffs,
                                width: globalConstants_1.Constants.Display.XFactor,
                                height: globalConstants_1.Constants.Display.YFactor,
                                fill: this.palette[0]
                            };
                        }
                    }
                    displayService.callback = function (address, value) {
                        var safeAddress = address & globalConstants_1.Constants.Display.Max;
                        var safeValue = value & globalConstants_1.Constants.Memory.ByteMask;
                        _this.pixelBuffer[safeAddress].fill = _this.palette[safeValue];
                    };
                    consoleService.log("Build pixel map. Display initialized.");
                }
                Display = __decorate([
                    core_1.Component({
                        selector: 'display',
                        templateUrl: 'templates/display.html'
                    }),
                    __param(0, core_1.Inject(displayService_1.DisplayService)),
                    __param(1, core_1.Inject(consoleService_1.ConsoleService)), 
                    __metadata('design:paramtypes', [Object, Object])
                ], Display);
                return Display;
            }());
            exports_1("Display", Display);
        }
    }
});
//# sourceMappingURL=display.js.map