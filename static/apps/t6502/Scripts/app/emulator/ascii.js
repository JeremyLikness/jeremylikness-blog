var Emulator;
(function (Emulator) {
    var Ascii = (function () {
        function Ascii() {
        }
        Ascii.NUL = 0;
        Ascii.SOH = 1;
        Ascii.STX = 2;
        Ascii.ETX = 3;

        Ascii.charMap = [
            '',
            '',
            '',
            '',
            ''
        ];
        return Ascii;
    })();
    Emulator.Ascii = Ascii;
})(Emulator || (Emulator = {}));
