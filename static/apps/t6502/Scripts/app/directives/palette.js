var Directives;
(function (Directives) {
    var IPaletteEntry = (function () {
        function IPaletteEntry() {
        }
        return IPaletteEntry;
    })();
    Directives.IPaletteEntry = IPaletteEntry;

    var Palette = (function () {
        function Palette() {
            this.palette = null;
        }
        Palette.prototype.toHex = function (value) {
            var result = value.toString(16);
            return result.length == 1 ? "0" + result : result;
        };

        Palette.prototype.toLuminosity = function (red, green, blue) {
            return Math.sqrt((0.241 * (red ^ 2)) + (0.691 * (green ^ 2)) + (0.068 * (blue ^ 2)));
        };

        Palette.prototype.generatePalette = function () {
            this.palette = [];
            var lowValues = [0x10, 0x40, 0x70, 0xa0, 0xd0, 0xff];
            var greenValues = [0x10, 0x38, 0x60, 0x88, 0xb0, 0xd8, 0xff];
            var red, green, blue;
            var redValue, blueValue, greenValue;
            var idx;

            var paletteEntries = Array((((5 * 7) + 6) * 6) + 5);

            for (red = 0; red < 6; red += 1) {
                for (green = 0; green < 7; green += 1) {
                    for (blue = 0; blue < 6; blue += 1) {
                        redValue = lowValues[red];
                        greenValue = greenValues[green];
                        blueValue = lowValues[blue];
                        idx = (((red * 7) + green) * 6) + blue;

                        if (idx === 0) {
                            redValue = greenValue = blueValue = 0;
                        }

                        paletteEntries[idx] = {
                            red: redValue,
                            green: greenValue,
                            blue: blueValue,
                            hexValue: "#" + this.toHex(redValue) + this.toHex(greenValue) + this.toHex(blueValue),
                            luminosity: this.toLuminosity(redValue, greenValue, blueValue)
                        };
                    }
                }
            }

            paletteEntries.sort(function (a, b) {
                return a.luminosity - b.luminosity;
            });

            for (idx = 0; idx < paletteEntries.length; idx++) {
                this.palette.push(paletteEntries[idx].hexValue);
            }

            this.palette[0xfb] = "#111111";
            this.palette[0xfc] = "#555555";
            this.palette[0xfd] = "#999999";
            this.palette[0xfe] = "#cccccc";
            this.palette[0xff] = "#ffffff";
        };

        Palette.prototype.getPalette = function () {
            if (this.palette === null) {
                this.generatePalette();
            }

            return this.palette;
        };
        return Palette;
    })();
    Directives.Palette = Palette;
})(Directives || (Directives = {}));
