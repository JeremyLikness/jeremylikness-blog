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
    var tests = [
        {
            memory: 0x10,
            register: 0x10,
            comparison: "Equal To",
            carryFlag: true,
            zeroFlag: true
        },
        {
            memory: 0x10,
            register: 0x20,
            comparison: "Greater Than",
            carryFlag: true,
            zeroFlag: false
        },
        {
            memory: 0x20,
            register: 0x10,
            comparison: "Less Than",
            carryFlag: false,
            zeroFlag: false
        }
    ];

    var status = function (value) {
        return value ? "set" : "reset";
    };

    var condition = function (test, mode) {
        return "given register value that is " + test.comparison + " the memory value when compared as " + mode;
    };

    var result = function (test) {
        return "then should " + status(test.carryFlag) + " the Carry Flag and " + status(test.zeroFlag) + " the Zero Flag";
    };

    describe("Comparison Operators", function () {
        var cpuSvc;
        var cpu;
        var consoleSvc;
        var operation;

        var zeroPage = 0x50;
        var xOffset = 0x05;
        var yOffset = 0x20;
        var memoryLocation = 0xC000;

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

        describe("CMP", function () {
            describe("CMP Immediate", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareAccumulatorImmediate();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Immediate"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, test.memory);
                                cpu.rA = test.register;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("CMP Zero Page", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareAccumulatorZeroPage();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Zero Page"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(zeroPage, test.memory);
                                cpu.rA = test.register;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("CMP Zero Page, X", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareAccumulatorZeroPageX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Zero Page, X"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(zeroPage + xOffset, test.memory);
                                cpu.rA = test.register;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("CMP Absolute", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareAccumulatorAbsolute();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Absolute"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation, test.memory);
                                cpu.rA = test.register;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("CMP Absolute, X", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareAccumulatorAbsoluteX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Absolute, X"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation + xOffset, test.memory);
                                cpu.rA = test.register;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("CMP Absolute, Y", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareAccumulatorAbsoluteY();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Absolute, Y"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation + yOffset, test.memory);
                                cpu.rA = test.register;
                                cpu.rY = yOffset;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("CMP Indirect, X", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareAccumulatorIndexedIndirectX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Indirect, X"), function () {
                            beforeEach(function () {
                                cpu.poke(zeroPage + xOffset, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(zeroPage + xOffset + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(memoryLocation, test.memory);
                                cpu.rA = test.register;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("CMP Indirect, Y", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareAccumulatorIndirectIndexedY();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Indirect, X"), function () {
                            beforeEach(function () {
                                cpu.poke(zeroPage, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(zeroPage + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(memoryLocation + yOffset, test.memory);
                                cpu.rA = test.register;
                                cpu.rY = yOffset;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });
        });

        describe("CPX", function () {
            describe("CPX Immediate", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareXImmediate();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Immediate"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, test.memory);
                                cpu.rX = test.register;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("CPX Zero Page", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareXZeroPage();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Zero Page"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(zeroPage, test.memory);
                                cpu.rX = test.register;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("CPX Absolute", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareXAbsolute();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Absolute"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation, test.memory);
                                cpu.rX = test.register;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });
        });

        describe("CPY", function () {
            describe("CPY Immediate", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareYImmediate();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Immediate"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, test.memory);
                                cpu.rY = test.register;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("CPY Zero Page", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareYZeroPage();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Zero Page"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(zeroPage, test.memory);
                                cpu.rY = test.register;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("CPY Absolute", function () {
                beforeEach(function () {
                    operation = new Emulator.CompareYAbsolute();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "Absolute"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation, test.memory);
                                cpu.rY = test.register;
                                operation.execute(cpu);
                            });

                            it(result(test), function () {
                                expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.carryFlag);
                                expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.zeroFlag);
                            });
                        });
                    };
                    executeTest(test);
                }
            });
        });
    });
})(Tests || (Tests = {}));
