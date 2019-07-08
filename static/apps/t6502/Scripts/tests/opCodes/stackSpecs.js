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
    describe("Stack Operations", function () {
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

        describe("PHA - Push Accumulator to Stack", function () {
            beforeEach(function () {
                operation = new Emulator.PushAccumulatorSingle();
            });

            describe("given value in accumulator", function () {
                beforeEach(function () {
                    cpu.rA = 0x12;
                    operation.execute(cpu);
                });

                it("then should push the value to the stack", function () {
                    expect(cpu.stackPop()).toBe(0x12);
                });
            });
        });

        describe("PLA - Pull Accumulator from Stack", function () {
            beforeEach(function () {
                operation = new Emulator.PullAccumulatorSingle();
            });

            describe("given value in stack", function () {
                beforeEach(function () {
                    cpu.stackPush(0x12);
                    operation.execute(cpu);
                });

                it("then should set the accumulator to the value at the top of the stack", function () {
                    expect(cpu.rA).toBe(0x12);
                });
            });
        });

        describe("PHP - Push Processor Status to Stack", function () {
            beforeEach(function () {
                operation = new Emulator.PushProcessorStatusSingle();
            });

            describe("given processor status", function () {
                beforeEach(function () {
                    cpu.rP = parseInt("10101010", 2);
                    operation.execute(cpu);
                });

                it("then should push the value to the stack", function () {
                    expect(cpu.stackPop()).toBe(parseInt("10101010", 2));
                });
            });
        });

        describe("PLP - Pull Processor Status from Stack", function () {
            beforeEach(function () {
                operation = new Emulator.PullProcessorStatusSingle();
            });

            describe("given value in stack", function () {
                beforeEach(function () {
                    cpu.stackPush(parseInt("10101010", 2));
                    operation.execute(cpu);
                });

                it("then should set the processor status to the value at the top of the stack", function () {
                    expect(cpu.rP).toBe(parseInt("10101010", 2));
                });
            });
        });

        describe("TXS - Transfer X Register to Stack Pointer", function () {
            beforeEach(function () {
                operation = new Emulator.TransferXRegisterToStackPointerSingle();
            });

            describe("given value in x-register", function () {
                beforeEach(function () {
                    cpu.rX = 0x12;
                    operation.execute(cpu);
                });

                it("then should update the stack pointer to match the value", function () {
                    expect(cpu.rSP).toBe(0x12);
                });
            });
        });

        describe("TSX - Transfer Stack Pointer to X Register", function () {
            beforeEach(function () {
                operation = new Emulator.TransferStackPointerToXRegisterSingle();
            });

            describe("given value in stack pointer", function () {
                beforeEach(function () {
                    cpu.rSP = 0x12;
                    operation.execute(cpu);
                });

                it("then should transfer the value to the X register", function () {
                    expect(cpu.rX).toBe(0x12);
                });
            });
        });
    });
})(Tests || (Tests = {}));
