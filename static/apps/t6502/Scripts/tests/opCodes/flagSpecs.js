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
    describe("Flag Operations", function () {
        var cpuSvc;
        var cpu;
        var consoleSvc;
        var operation;
        var registers;

        beforeEach(function () {
            module('app');
        });

        beforeEach(function () {
            inject(function (cpuService, consoleService) {
                cpuSvc = cpuService;
                consoleSvc = consoleService;
                cpu = cpuSvc.getCpu();
                registers = cpu.rP;
            });
        });

        describe("CLD - Clear Decimal Flag", function () {
            beforeEach(function () {
                operation = new Emulator.ClearDecimalSingle();
            });

            describe("given decimal flag not set", function () {
                beforeEach(function () {
                    operation.execute(cpu);
                });

                it("then should not affect registers", function () {
                    expect(cpu.rP).toBe(registers);
                });
            });

            describe("given decimal flag set", function () {
                beforeEach(function () {
                    cpu.setFlag(Constants.ProcessorStatus.DecimalFlagSet, true);
                    operation.execute(cpu);
                });

                it("then should set registers back to original", function () {
                    expect(cpu.rP).toBe(registers);
                });
            });
        });

        describe("SED - Set Decimal Flag", function () {
            beforeEach(function () {
                operation = new Emulator.SetDecimalSingle();
            });

            describe("given decimal flag not set", function () {
                beforeEach(function () {
                    operation.execute(cpu);
                });

                it("then should set decimal flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.DecimalFlagSet)).toBe(true);
                });
            });

            describe("given decimal flag set", function () {
                beforeEach(function () {
                    cpu.setFlag(Constants.ProcessorStatus.DecimalFlagSet, true);
                    registers = cpu.rP;
                    operation.execute(cpu);
                });

                it("then should not affect registers", function () {
                    expect(cpu.rP).toBe(registers);
                });
            });
        });

        describe("CLC - Clear Carry Flag", function () {
            beforeEach(function () {
                operation = new Emulator.ClearCarrySingle();
            });

            describe("given carry flag not set", function () {
                beforeEach(function () {
                    operation.execute(cpu);
                });

                it("then should not affect registers", function () {
                    expect(cpu.rP).toBe(registers);
                });
            });

            describe("given carry flag set", function () {
                beforeEach(function () {
                    cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
                    operation.execute(cpu);
                });

                it("then should set registers back to original", function () {
                    expect(cpu.rP).toBe(registers);
                });
            });
        });

        describe("SEC - Set Carry Flag", function () {
            beforeEach(function () {
                operation = new Emulator.SetCarrySingle();
            });

            describe("given carry flag not set", function () {
                beforeEach(function () {
                    operation.execute(cpu);
                });

                it("then should set carry flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(true);
                });
            });

            describe("given carry flag set", function () {
                beforeEach(function () {
                    cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
                    registers = cpu.rP;
                    operation.execute(cpu);
                });

                it("then should not affect registers", function () {
                    expect(cpu.rP).toBe(registers);
                });
            });
        });

        describe("CLC - Clear Overflow Flag", function () {
            beforeEach(function () {
                operation = new Emulator.ClearOverflowSingle();
            });

            describe("given overflow flag not set", function () {
                beforeEach(function () {
                    operation.execute(cpu);
                });

                it("then should not affect registers", function () {
                    expect(cpu.rP).toBe(registers);
                });
            });

            describe("given overflow flag set", function () {
                beforeEach(function () {
                    cpu.setFlag(Constants.ProcessorStatus.OverflowFlagSet, true);
                    operation.execute(cpu);
                });

                it("then should set registers back to original", function () {
                    expect(cpu.rP).toBe(registers);
                });
            });
        });
    });
})(Tests || (Tests = {}));
