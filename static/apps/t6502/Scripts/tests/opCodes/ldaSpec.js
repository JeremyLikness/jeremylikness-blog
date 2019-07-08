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
    describe("LDA - Load Accumulator", function () {
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

        describe("Values", function () {
            beforeEach(function () {
                operation = new Emulator.LoadAccumulatorImmediate();
            });

            describe("given any value", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x12);
                    operation.execute(cpu);
                });

                it("then should set the accumulator to the value", function () {
                    expect(cpu.rA).toBe(0x12);
                });
            });

            describe("given zero value", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x00);
                    operation.execute(cpu);
                });

                it("then should set the zero flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(true);
                });
            });

            describe("given non-zero value", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x01);
                    cpu.setFlag(Constants.ProcessorStatus.ZeroFlagSet, true);
                    operation.execute(cpu);
                });

                it("then should reset the zero flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(false);
                });
            });

            describe("given negative value", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x81);
                    operation.execute(cpu);
                });

                it("then should set the negative flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.NegativeFlagSet)).toBe(true);
                });
            });

            describe("given non-negative value", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x7f);
                    cpu.setFlag(Constants.ProcessorStatus.NegativeFlagSet, true);
                    operation.execute(cpu);
                });

                it("then should reset the negative flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.NegativeFlagSet)).toBe(false);
                });
            });
        });

        describe("Modes", function () {
            describe("Given LDA Absolute", function () {
                beforeEach(function () {
                    operation = new Emulator.LoadAccumulatorAbsolute();
                });

                describe("then should load the value at the specified address", function () {
                    beforeEach(function () {
                        cpu.poke(cpu.rPC, 0x00);
                        cpu.poke(cpu.rPC + 1, 0xc0);
                        cpu.poke(0xC000, 0x12);
                        operation.execute(cpu);
                    });

                    it("then should set the accumulator to the value", function () {
                        expect(cpu.rA).toBe(0x12);
                    });
                });
            });

            describe("Given LDA Absolute X", function () {
                beforeEach(function () {
                    operation = new Emulator.LoadAccumulatorAbsoluteX();
                });

                describe("given a value at the specified address with X offset", function () {
                    beforeEach(function () {
                        cpu.poke(cpu.rPC, 0x00);
                        cpu.poke(cpu.rPC + 1, 0xc0);
                        cpu.poke(0xC00A, 0x12);
                        cpu.rX = 0x0A;
                        operation.execute(cpu);
                    });

                    it("then should set the accumulator to the value", function () {
                        expect(cpu.rA).toBe(0x12);
                    });
                });
            });

            describe("Given LDA Zero Page", function () {
                beforeEach(function () {
                    operation = new Emulator.LoadAccumulatorZeroPage();
                });

                describe("given a value value at the specified zero page address", function () {
                    beforeEach(function () {
                        cpu.poke(cpu.rPC, 0x50);
                        cpu.poke(0x50, 0x12);
                        operation.execute(cpu);
                    });

                    it("then should set the accumulator to the value", function () {
                        expect(cpu.rA).toBe(0x12);
                    });
                });
            });
        });
    });
})(Tests || (Tests = {}));
