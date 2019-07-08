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
    describe("Branch Operations", function () {
        var cpuSvc;
        var cpu;
        var consoleSvc;
        var operation;
        var flagToTest;
        var flagName;
        var reverseFlag;
        var address;

        function setText() {
            return reverseFlag ? "not branch" : "branch";
        }

        function resetText() {
            return reverseFlag ? "branch" : "not branch";
        }

        function branchtest() {
            describe("Given " + flagName + " is set", function () {
                beforeEach(function () {
                    cpu.setFlag(flagToTest, true);
                    cpu.poke(cpu.rPC, 0x06);
                    address = cpu.rPC;
                    operation.execute(cpu);
                });

                it("then should " + setText(), function () {
                    expect(cpu.rPC).toBe(reverseFlag ? address + 1 : address + 7);
                });
            });

            describe("Given " + flagName + " is not set", function () {
                beforeEach(function () {
                    cpu.setFlag(flagToTest, false);
                    cpu.poke(cpu.rPC, 0x06);
                    address = cpu.rPC;
                    operation.execute(cpu);
                });

                it("then should " + resetText(), function () {
                    expect(cpu.rPC).toBe(reverseFlag ? address + 7 : address + 1);
                });
            });
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

        describe("BMI - Branch on minus", function () {
            operation = new Emulator.BranchMinusRelative();
            flagToTest = Constants.ProcessorStatus.NegativeFlagSet;
            flagName = "Negative Flag";
            reverseFlag = false;
            branchtest();
        });

        describe("BPL - Branch on plus (positive)", function () {
            operation = new Emulator.BranchPlusRelative();
            flagToTest = Constants.ProcessorStatus.NegativeFlagSet;
            flagName = "Negative Flag";
            reverseFlag = true;
            branchtest();
        });

        describe("BEQ - Branch on zero (equal)", function () {
            operation = new Emulator.BranchEqualRelative();
            flagToTest = Constants.ProcessorStatus.ZeroFlagSet;
            flagName = "Zero Flag";
            reverseFlag = false;
            branchtest();
        });

        describe("BNE - Branch on not zero (not equal)", function () {
            operation = new Emulator.BranchNotEqualRelative();
            flagToTest = Constants.ProcessorStatus.ZeroFlagSet;
            flagName = "Zero Flag";
            reverseFlag = true;
            branchtest();
        });

        describe("BVC - Branch on overflow clear", function () {
            operation = new Emulator.BranchOverflowClearRelative();
            flagToTest = Constants.ProcessorStatus.OverflowFlagSet;
            flagName = "Overflow Flag";
            reverseFlag = true;
            branchtest();
        });

        describe("BVC - Branch on overflow set", function () {
            operation = new Emulator.BranchOverflowSetRelative();
            flagToTest = Constants.ProcessorStatus.OverflowFlagSet;
            flagName = "Overflow Flag";
            reverseFlag = false;
            branchtest();
        });

        describe("BCS - Branch on carry set", function () {
            operation = new Emulator.BranchCarrySetRelative();
            flagToTest = Constants.ProcessorStatus.CarryFlagSet;
            flagName = "Carry Flag";
            reverseFlag = false;
            branchtest();
        });

        describe("BCC - Branch on carry clear", function () {
            operation = new Emulator.BranchCarryClearRelative();
            flagToTest = Constants.ProcessorStatus.CarryFlagSet;
            flagName = "Carry Flag";
            reverseFlag = true;
            branchtest();
        });
    });
})(Tests || (Tests = {}));
