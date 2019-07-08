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
    var tests = [];

    var condition = function (test, operation, mode) {
        return "given memory value of " + test.memory.toString(10) + " and accumulator value of " + test.operand.toString(10) + " when " + operation + " applied as " + mode;
    };

    var result = function (test, result) {
        return "then should update the accumulator with a value of " + result;
    };

    describe("Bitwise Operators", function () {
        var cpuSvc;
        var cpu;
        var consoleSvc;
        var operation;

        var zeroPage = 0x50;
        var xOffset = 0x05;
        var yOffset = 0x20;
        var memoryLocation = 0xC000;

        var max = 0xFF;
        var min = 0x00;

        while (max >= 0) {
            tests.push({
                memory: max,
                operand: min
            });

            max -= 0x1F;
            min = (min + 0x13) & 0xFF;
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

        describe("AND", function () {
            describe("AND Immediate", function () {
                beforeEach(function () {
                    operation = new Emulator.AndImmediate();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "AND", "Immediate"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, test.memory);
                                cpu.rA = test.operand;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory & test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("AND Zero Page", function () {
                beforeEach(function () {
                    operation = new Emulator.AndZeroPage();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "AND", "Zero Page"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(zeroPage, test.memory);
                                cpu.rA = test.operand;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory & test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("AND Zero Page, X", function () {
                beforeEach(function () {
                    operation = new Emulator.AndZeroPageX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "AND", "Zero Page, X"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(zeroPage + xOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory & test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("AND Absolute", function () {
                beforeEach(function () {
                    operation = new Emulator.AndAbsolute();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "AND", "Absolute"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation, test.memory);
                                cpu.rA = test.operand;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory & test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("AND Absolute, X", function () {
                beforeEach(function () {
                    operation = new Emulator.AndAbsoluteX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "AND", "Absolute, X"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation + xOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory & test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("AND Absolute, Y", function () {
                beforeEach(function () {
                    operation = new Emulator.AndAbsoluteY();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "AND", "Absolute, Y"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation + yOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rY = yOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory & test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("AND Indirect, X", function () {
                beforeEach(function () {
                    operation = new Emulator.AndIndirectX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "AND", "Indirect, X"), function () {
                            beforeEach(function () {
                                cpu.poke(zeroPage + xOffset, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(zeroPage + xOffset + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(memoryLocation, test.memory);
                                cpu.rA = test.operand;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory & test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("AND Indirect, Y", function () {
                beforeEach(function () {
                    operation = new Emulator.AndIndirectY();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "AND", "Indirect, X"), function () {
                            beforeEach(function () {
                                cpu.poke(zeroPage, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(zeroPage + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(memoryLocation + yOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rY = yOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory & test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });
        });

        describe("EOR", function () {
            describe("EOR Immediate", function () {
                beforeEach(function () {
                    operation = new Emulator.ExclusiveOrImmediate();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "EOR", "Immediate"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, test.memory);
                                cpu.rA = test.operand;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory ^ test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("EOR Zero Page", function () {
                beforeEach(function () {
                    operation = new Emulator.ExclusiveOrZeroPage();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "EOR", "Zero Page"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(zeroPage, test.memory);
                                cpu.rA = test.operand;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory ^ test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("EOR Zero Page, X", function () {
                beforeEach(function () {
                    operation = new Emulator.ExclusiveOrZeroPageX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "EOR", "Zero Page, X"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(zeroPage + xOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory ^ test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("EOR Absolute", function () {
                beforeEach(function () {
                    operation = new Emulator.ExclusiveOrAbsolute();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "EOR", "Absolute"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation, test.memory);
                                cpu.rA = test.operand;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory ^ test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("EOR Absolute, X", function () {
                beforeEach(function () {
                    operation = new Emulator.ExclusiveOrAbsoluteX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "EOR", "Absolute, X"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation + xOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory ^ test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("EOR Absolute, Y", function () {
                beforeEach(function () {
                    operation = new Emulator.ExclusiveOrAbsoluteY();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "EOR", "Absolute, Y"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation + yOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rY = yOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory ^ test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("EOR Indirect, X", function () {
                beforeEach(function () {
                    operation = new Emulator.ExclusiveOrIndirectX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "EOR", "Indirect, X"), function () {
                            beforeEach(function () {
                                cpu.poke(zeroPage + xOffset, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(zeroPage + xOffset + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(memoryLocation, test.memory);
                                cpu.rA = test.operand;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory ^ test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("EOR Indirect, Y", function () {
                beforeEach(function () {
                    operation = new Emulator.ExclusiveOrIndirectY();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "EOR", "Indirect, X"), function () {
                            beforeEach(function () {
                                cpu.poke(zeroPage, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(zeroPage + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(memoryLocation + yOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rY = yOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory ^ test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });
        });

        describe("ORA (OR Accumulator)", function () {
            describe("ORA Immediate", function () {
                beforeEach(function () {
                    operation = new Emulator.OrImmediate();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "ORA", "Immediate"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, test.memory);
                                cpu.rA = test.operand;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory | test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("ORA Zero Page", function () {
                beforeEach(function () {
                    operation = new Emulator.OrZeroPage();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "ORA", "Zero Page"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(zeroPage, test.memory);
                                cpu.rA = test.operand;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory | test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("ORA Zero Page, X", function () {
                beforeEach(function () {
                    operation = new Emulator.OrZeroPageX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "ORA", "Zero Page, X"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(zeroPage + xOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory | test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("ORA Absolute", function () {
                beforeEach(function () {
                    operation = new Emulator.OrAbsolute();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "ORA", "Absolute"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation, test.memory);
                                cpu.rA = test.operand;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory | test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("ORA Absolute, X", function () {
                beforeEach(function () {
                    operation = new Emulator.OrAbsoluteX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "ORA", "Absolute, X"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation + xOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory | test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("ORA Absolute, Y", function () {
                beforeEach(function () {
                    operation = new Emulator.OrAbsoluteY();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "ORA", "Absolute, Y"), function () {
                            beforeEach(function () {
                                cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(memoryLocation + yOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rY = yOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory | test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("ORA Indirect, X", function () {
                beforeEach(function () {
                    operation = new Emulator.OrIndirectX();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "ORA", "Indirect, X"), function () {
                            beforeEach(function () {
                                cpu.poke(zeroPage + xOffset, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(zeroPage + xOffset + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(memoryLocation, test.memory);
                                cpu.rA = test.operand;
                                cpu.rX = xOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory | test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });

            describe("ORA Indirect, Y", function () {
                beforeEach(function () {
                    operation = new Emulator.OrIndirectY();
                });

                var idx;

                for (idx = 0; idx < tests.length; idx++) {
                    var test = tests[idx];
                    var executeTest = function (test) {
                        describe(condition(test, "ORA", "Indirect, X"), function () {
                            beforeEach(function () {
                                cpu.poke(zeroPage, memoryLocation & Constants.Memory.ByteMask);
                                cpu.poke(zeroPage + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                                cpu.poke(cpu.rPC, zeroPage);
                                cpu.poke(memoryLocation + yOffset, test.memory);
                                cpu.rA = test.operand;
                                cpu.rY = yOffset;
                                operation.execute(cpu);
                            });

                            var resultValue = test.memory | test.operand;

                            it(result(test, resultValue), function () {
                                expect(cpu.rA).toBe(resultValue);
                            });
                        });
                    };
                    executeTest(test);
                }
            });
        });
    });
})(Tests || (Tests = {}));
