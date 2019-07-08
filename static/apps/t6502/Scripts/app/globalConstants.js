var Constants;
(function (Constants) {
    var Memory = (function () {
        function Memory() {
        }
        Memory.Max = 0xFFFF;
        Memory.Size = Memory.Max + 0x01;
        Memory.ByteMask = 0xFF;
        Memory.NibbleMask = 0x0F;
        Memory.HighNibbleMask = 0xF0;
        Memory.Stack = 0x0100;
        Memory.BitsInByte = 8;
        Memory.DefaultStart = 0x0200;
        Memory.BranchBack = 0x7F;
        Memory.BranchOffset = 0x100;
        Memory.MaxInstructionsDecompile = 50;
        Memory.ZeroPageTimerSeconds = 0xFB;
        Memory.ZeroPageTimerMilliseconds = 0xFC;
        Memory.ZeroPageRandomNumberGenerator = 0xFD;
        Memory.ZeroPageCharacterOutput = 0xFE;
        Memory.ZeroPageCharacterInput = 0xFF;
        return Memory;
    })();
    Constants.Memory = Memory;

    var Display = (function () {
        function Display() {
        }
        Display.Max = 0x3FF;
        Display.Size = Display.Max + 0x01;
        Display.XMax = 0x20;
        Display.YMax = 0x20;
        Display.CanvasXMax = 0xC0;
        Display.CanvasYMax = 0xC0;
        Display.XFactor = Display.CanvasXMax / Display.XMax;
        Display.YFactor = Display.CanvasYMax / Display.YMax;
        Display.DisplayStart = 0xFC00;
        Display.ConsoleLines = 100;
        return Display;
    })();
    Constants.Display = Display;

    var ProcessorStatus = (function () {
        function ProcessorStatus() {
        }
        ProcessorStatus.CarryFlagSet = 0x01;
        ProcessorStatus.CarryFlagReset = Memory.ByteMask - ProcessorStatus.CarryFlagSet;
        ProcessorStatus.ZeroFlagSet = 0x02;
        ProcessorStatus.ZeroFlagReset = Memory.ByteMask - ProcessorStatus.ZeroFlagSet;
        ProcessorStatus.DecimalFlagSet = 0x08;
        ProcessorStatus.DecimalFlagReset = Memory.ByteMask - ProcessorStatus.DecimalFlagSet;
        ProcessorStatus.OverflowFlagSet = 0x40;
        ProcessorStatus.OverflowFlagReset = Memory.ByteMask - ProcessorStatus.OverflowFlagSet;
        ProcessorStatus.NegativeFlagSet = 0x80;
        ProcessorStatus.NegativeFlagReset = Memory.ByteMask - ProcessorStatus.NegativeFlagSet;
        return ProcessorStatus;
    })();
    Constants.ProcessorStatus = ProcessorStatus;
})(Constants || (Constants = {}));
