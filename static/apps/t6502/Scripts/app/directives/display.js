///<reference path="../app.ts"/>
///<reference path="../services/consoleService.ts"/>
///<reference path="../services/displayService.ts"/>
///<reference path="palette.ts"/>
var Directives;
(function (Directives) {
    var Display = (function () {
        function Display() {
        }
        Display.MakeSvg = function (tag, attrs) {
            var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var attr in attrs) {
                el.setAttribute(attr, attrs[attr]);
            }
            return el;
        };

        Display.Factory = function (consoleService, displayService) {
            var pixelBuffer;
            var displayBuffer;
            var palette;

            return {
                restrict: "E",
                template: "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">" + "<rect x=\"0\" y=\"0\" width=\"" + Constants.Display.CanvasXMax + "\" height=\"" + Constants.Display.CanvasYMax + "\"" + " style=\"fill:white;\"/></svg>",
                scope: {},
                link: function (scope, element, attrs) {
                    var element = angular.element(element);
                    var x, xoffs, y, yoffs, idx;

                    var svg = $(element).get(0).childNodes[0];

                    consoleService.log("Initializing the display...");

                    pixelBuffer = angular.copy(displayService.pixels);

                    displayBuffer = [];

                    var paletteGenerator = new Directives.Palette();
                    palette = paletteGenerator.getPalette();

                    consoleService.log("Palette has been generated.");

                    for (y = 0; y < Constants.Display.YMax; y += 1) {
                        for (x = 0; x < Constants.Display.XMax; x += 1) {
                            idx = y * Constants.Display.XMax + x;
                            xoffs = x * Constants.Display.XFactor;
                            yoffs = y * Constants.Display.YFactor;
                            var pixel = Display.MakeSvg("rect", {
                                x: xoffs,
                                y: yoffs,
                                width: Constants.Display.XFactor,
                                height: Constants.Display.YFactor
                            });
                            pixel.setAttribute("style", "fill:" + palette[0]);
                            displayBuffer[idx] = pixel;
                            svg.appendChild(pixel);
                        }
                    }

                    consoleService.log("Built pixel map.");

                    // this directive is tightly coupled to the service so the service literally
                    // takes one callback so it can update the display when the memory is poked
                    displayService.callback = function (address, value) {
                        var safeAddress = address & Constants.Display.Max;
                        var safeValue = value & Constants.Memory.ByteMask;
                        pixelBuffer[safeAddress] = safeValue;
                        displayBuffer[safeAddress].removeAttribute("style");
                        displayBuffer[safeAddress].setAttribute("style", "fill:" + palette[safeValue]);
                    };

                    consoleService.log("Display initialized.");
                }
            };
        };
        return Display;
    })();
    Directives.Display = Display;

    Main.App.Directives.directive("display", ["consoleService", "displayService", Display.Factory]);
})(Directives || (Directives = {}));
