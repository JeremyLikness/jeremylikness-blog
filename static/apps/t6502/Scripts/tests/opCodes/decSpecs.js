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
    describe("Decrement Specs", function () {
        var cpuSvc;
        var cpu;
        var consoleSvc;
        var operation;
        var regularValue = 0x12;
        var regularValueAfter = regularValue - 1;
        var negativeValue = 0x82;
        var negativeValueAfter = negativeValue - 1;
        var flipValue = 0x00;
        var flipValueAfter = 0xFF;
        var address = 0xC000;
        var zeroPage = 0x50;
        var xOffset = 0x05;

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

        describe("DEX - Decrement X Register", function () {
            beforeEach(function () {
                operation = new Emulator.DecXSingle();
            });

            describe("given any value greater than 0x0", function () {
                beforeEach(function () {
                    cpu.rX = regularValue;
                    operation.execute(cpu);
                });

                it("then should set the X register to one less than the value", function () {
                    expect(cpu.rX).toBe(regularValueAfter);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.NegativeFlagSet)).toBe(false);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(false);
                });
            });

            describe("given any negative value greater than 0x80", function () {
                beforeEach(function () {
                    cpu.rX = negativeValue;
                    operation.execute(cpu);
                });

                it("then should set the X register to one less than the value and set the negative flag", function () {
                    expect(cpu.rX).toBe(negativeValueAfter);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.NegativeFlagSet)).toBe(true);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(false);
                });
            });

            describe("given 0x00", function () {
                beforeEach(function () {
                    cpu.rX = flipValue;
                    operation.execute(cpu);
                });

                it("then should set the X register to 0xFF (roll) and set the negative flag", function () {
                    expect(cpu.rX).toBe(flipValueAfter);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(false);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.NegativeFlagSet)).toBe(true);
                });
            });
        });

        describe("DEY - Decrement Y Register", function () {
            beforeEach(function () {
                operation = new Emulator.DecYSingle();
            });

            describe("given any value greater than 0x0", function () {
                beforeEach(function () {
                    cpu.rY = regularValue;
                    operation.execute(cpu);
                });

                it("then should set the Y register to one less than the value", function () {
                    expect(cpu.rY).toBe(regularValueAfter);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.NegativeFlagSet)).toBe(false);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(false);
                });
            });

            describe("given any negative greater than 0x80", function () {
                beforeEach(function () {
                    cpu.rY = negativeValue;
                    operation.execute(cpu);
                });

                it("then should set the Y register to one less than the value and set the negative flag", function () {
                    expect(cpu.rY).toBe(negativeValueAfter);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.NegativeFlagSet)).toBe(true);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(false);
                });
            });

            describe("given 0x00", function () {
                beforeEach(function () {
                    cpu.rY = flipValue;
                    operation.execute(cpu);
                });

                it("then should set the Y register to 0xFF (roll) and set the negative flag", function () {
                    expect(cpu.rY).toBe(flipValueAfter);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(false);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.NegativeFlagSet)).toBe(true);
                });
            });
        });
    });
})(Tests || (Tests = {}));
