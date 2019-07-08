/// <reference path='../jasmine.d.ts'/>
/// <reference path='../../app/defs/angular.d.ts'/>
/// <reference path='../angular-mocks.d.ts'/>
/// <reference path='../../app/defs/jquery.d.ts'/>
/// <reference path='../../app/app.ts'/>
/// <reference path='../../app/services/cpuService.ts'/>
/// <reference path='../../app/services/consoleService.ts'/>
/// <reference path='../../app/emulator/compiler.ts'/>
/// <reference path='../../app/emulator/opCodes.ts'/>
var Tests;
(function (Tests) {
    describe("JSR - Jump to Subroutine", function () {
        var cpuSvc;
        var cpu;
        var consoleSvc;
        var operation;

        function toHexAddress(address) {
            var padding = "0000";
            var result = padding + address.toString(16);
            return result.substring(result.length - 4, result.length).toUpperCase();
        }

        beforeEach(function () {
            module('app');
        });

        beforeEach(function () {
            inject(function (cpuService, consoleService) {
                cpuSvc = cpuService;
                consoleSvc = consoleService;
                cpu = cpuSvc.getCpu();
            });
        });

        describe("JSR Absolute", function () {
            var address;

            beforeEach(function () {
                operation = new Emulator.JmpSubroutineAbsolute();
            });

            describe("given absolute address", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x00);
                    cpu.poke(cpu.rPC + 1, 0xC0);
                    address = cpu.rPC + 2;
                    operation.execute(cpu);
                });

                it("then should push the PC address less 1 on the stack", function () {
                    var adjustedAddress = address - 1;
                    expect(cpu.peek(cpu.rSP + Constants.Memory.Stack)).toBe(adjustedAddress & Constants.Memory.ByteMask);
                    expect(cpu.peek(cpu.rSP + Constants.Memory.Stack + 1)).toBe((adjustedAddress >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                });

                it("then should set the PC to the target address", function () {
                    expect(cpu.rPC).toBe(0xC000);
                });
            });
        });
    });
})(Tests || (Tests = {}));
