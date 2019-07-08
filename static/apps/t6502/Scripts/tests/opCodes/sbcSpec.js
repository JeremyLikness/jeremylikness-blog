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
    function status(item) {
        return item ? "set" : "reset";
    }

    function given(test) {
        return "given carry flag " + status(test.carryFlag) + " and accumulator with value of " + test.accumulator.toString(10) + " when SBC executed with value of " + test.immediate.toString(10);
    }

    function then(test) {
        return "then should provide result of " + test.expectedResult.toString(10) + " with carry flag " + status(test.expectedCarry) + " and negative flag " + status(test.expectedNegative) + " and zero flag " + status(test.expectedZero) + " and negative flag " + status(test.expectedNegative);
    }

    var nonDecimalTests = [
        {
            carryFlag: true,
            accumulator: 0x20,
            immediate: 0x10,
            expectedResult: 0x10,
            expectedCarry: true,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: false
        },
        {
            carryFlag: true,
            accumulator: 0x20,
            immediate: 0x20,
            expectedResult: 0x00,
            expectedCarry: true,
            expectedOverflow: false,
            expectedZero: true,
            expectedNegative: false
        },
        {
            carryFlag: true,
            accumulator: 0x20,
            immediate: 0x21,
            expectedResult: 0xFF,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: true,
            accumulator: 0x20,
            immediate: 0x81,
            expectedResult: 0x9F,
            expectedCarry: false,
            expectedOverflow: true,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: true,
            accumulator: 0x90,
            immediate: 0x40,
            expectedResult: 0x50,
            expectedCarry: true,
            expectedOverflow: true,
            expectedZero: false,
            expectedNegative: false
        },
        {
            carryFlag: true,
            accumulator: 0x90,
            immediate: 0x90,
            expectedResult: 0x00,
            expectedCarry: true,
            expectedOverflow: false,
            expectedZero: true,
            expectedNegative: false
        },
        {
            carryFlag: true,
            accumulator: 0x90,
            immediate: 0xa0,
            expectedResult: 0xF0,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: false,
            accumulator: 0x20,
            immediate: 0x10,
            expectedResult: 0x0F,
            expectedCarry: true,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: false
        },
        {
            carryFlag: false,
            accumulator: 0x20,
            immediate: 0x20,
            expectedResult: 0xFF,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: false,
            accumulator: 0x20,
            immediate: 0x21,
            expectedResult: 0xFE,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: false,
            accumulator: 0x20,
            immediate: 0x81,
            expectedResult: 0x9E,
            expectedCarry: false,
            expectedOverflow: true,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: false,
            accumulator: 0x90,
            immediate: 0x40,
            expectedResult: 0x4F,
            expectedCarry: true,
            expectedOverflow: true,
            expectedZero: false,
            expectedNegative: false
        },
        {
            carryFlag: false,
            accumulator: 0x90,
            immediate: 0x90,
            expectedResult: 0xFF,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: false,
            accumulator: 0x90,
            immediate: 0xa0,
            expectedResult: 0xEF,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        }
    ];

    var decimalTests = [
        {
            carryFlag: true,
            accumulator: 0x22,
            immediate: 0x11,
            expectedResult: 0x11,
            expectedCarry: true,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: false
        },
        {
            carryFlag: true,
            accumulator: 0x22,
            immediate: 0x22,
            expectedResult: 0x00,
            expectedCarry: true,
            expectedOverflow: false,
            expectedZero: true,
            expectedNegative: false
        },
        {
            carryFlag: true,
            accumulator: 0x22,
            immediate: 0x23,
            expectedResult: 0x99,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: true,
            accumulator: 0x22,
            immediate: 0x82,
            expectedResult: 0x40,
            expectedCarry: false,
            expectedOverflow: true,
            expectedZero: false,
            expectedNegative: false
        },
        {
            carryFlag: true,
            accumulator: 0x99,
            immediate: 0x44,
            expectedResult: 0x55,
            expectedCarry: true,
            expectedOverflow: true,
            expectedZero: false,
            expectedNegative: false
        },
        {
            carryFlag: true,
            accumulator: 0x99,
            immediate: 0x99,
            expectedResult: 0x00,
            expectedCarry: true,
            expectedOverflow: false,
            expectedZero: true,
            expectedNegative: false
        },
        {
            carryFlag: true,
            accumulator: 0x99,
            immediate: 0xaa,
            expectedResult: 0x89,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: false,
            accumulator: 0x22,
            immediate: 0x11,
            expectedResult: 0x10,
            expectedCarry: true,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: false
        },
        {
            carryFlag: false,
            accumulator: 0x22,
            immediate: 0x22,
            expectedResult: 0x99,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: false,
            accumulator: 0x22,
            immediate: 0x23,
            expectedResult: 0x98,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: false,
            accumulator: 0x22,
            immediate: 0x82,
            expectedResult: 0x39,
            expectedCarry: false,
            expectedOverflow: true,
            expectedZero: false,
            expectedNegative: false
        },
        {
            carryFlag: false,
            accumulator: 0x99,
            immediate: 0x44,
            expectedResult: 0x54,
            expectedCarry: true,
            expectedOverflow: true,
            expectedZero: false,
            expectedNegative: false
        },
        {
            carryFlag: false,
            accumulator: 0x99,
            immediate: 0x99,
            expectedResult: 0x99,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        },
        {
            carryFlag: false,
            accumulator: 0x99,
            immediate: 0xaa,
            expectedResult: 0x88,
            expectedCarry: false,
            expectedOverflow: false,
            expectedZero: false,
            expectedNegative: true
        }
    ];

    describe("SBC - Subtract with Carry", function () {
        var cpuSvc;
        var cpu;
        var consoleSvc;
        var operation;

        var zeroPage = 0x50;
        var xOffset = 0x05;
        var yOffset = 0x20;
        var memoryValue = 0x10;
        var accumulatorValue = 0x30;
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

        describe("SBC Immediate", function () {
            var testSuite = function (test, decimalFlag) {
                describe(given(test), function () {
                    beforeEach(function () {
                        cpu.setFlag(Constants.ProcessorStatus.DecimalFlagSet, decimalFlag);
                        cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, test.carryFlag);
                        cpu.rA = test.accumulator;
                        cpu.poke(cpu.rPC, test.immediate);
                        operation.execute(cpu);
                    });

                    it(then(test), function () {
                        expect(cpu.rA).toBe(test.expectedResult);
                        expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(test.expectedCarry);
                        expect(cpu.checkFlag(Constants.ProcessorStatus.NegativeFlagSet)).toBe(test.expectedNegative);
                        expect(cpu.checkFlag(Constants.ProcessorStatus.OverflowFlagSet)).toBe(test.expectedOverflow);
                        expect(cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(test.expectedZero);
                    });
                });
            };

            beforeEach(function () {
                operation = new Emulator.SubtractWithCarryImmediate();
                cpu.rP = 0x0;
            });

            var idx;

            describe("given binary mode", function () {
                for (idx = 0; idx < nonDecimalTests.length; idx++) {
                    var testItem = nonDecimalTests[idx];
                    testSuite(testItem, false);
                }
            });

            describe("given decimal mode", function () {
                for (idx = 0; idx < decimalTests.length; idx++) {
                    var testItem = decimalTests[idx];
                    testSuite(testItem, true);
                }
            });
        });

        describe("SBC Zero Page", function () {
            beforeEach(function () {
                operation = new Emulator.SubtractWithCarryZeroPage();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
            });

            describe("Given a zero page address", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, zeroPage);
                    cpu.poke(zeroPage, memoryValue);
                    cpu.rA = accumulatorValue;
                    operation.execute(cpu);
                });

                it("then should subtract the number at the address", function () {
                    expect(cpu.rA).toBe(accumulatorValue - memoryValue);
                });
            });
        });

        describe("SBC Zero Page, X", function () {
            beforeEach(function () {
                operation = new Emulator.SubtractWithCarryZeroPageX();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
            });

            describe("Given a zero page address and X offset", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, zeroPage);
                    cpu.poke(zeroPage + xOffset, memoryValue);
                    cpu.rA = accumulatorValue;
                    cpu.rX = xOffset;
                    operation.execute(cpu);
                });

                it("then should subtract the number at the address computed with the X offset", function () {
                    expect(cpu.rA).toBe(accumulatorValue - memoryValue);
                });
            });
        });

        describe("SBC Absolute", function () {
            beforeEach(function () {
                operation = new Emulator.SubtractWithCarryAbsolute();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
            });

            describe("Given an absolute address", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                    cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                    cpu.poke(memoryLocation, memoryValue);
                    cpu.rA = accumulatorValue;
                    operation.execute(cpu);
                });

                it("then should subtract the number at the address", function () {
                    expect(cpu.rA).toBe(accumulatorValue - memoryValue);
                });
            });
        });

        describe("SBC Absolute X", function () {
            beforeEach(function () {
                operation = new Emulator.SubtractWithCarryAbsoluteX();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
            });

            describe("Given an absolute address and X offset", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                    cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                    cpu.poke(memoryLocation + xOffset, memoryValue);
                    cpu.rA = accumulatorValue;
                    cpu.rX = xOffset;
                    operation.execute(cpu);
                });

                it("then should subtract the number at the address adjusted by the X offset", function () {
                    expect(cpu.rA).toBe(accumulatorValue - memoryValue);
                });
            });
        });

        describe("SBC Absolute Y", function () {
            beforeEach(function () {
                operation = new Emulator.SubtractWithCarryAbsoluteY();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
            });

            describe("Given an absolute address and Y offset", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                    cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                    cpu.poke(memoryLocation + yOffset, memoryValue);
                    cpu.rA = accumulatorValue;
                    cpu.rY = yOffset;
                    operation.execute(cpu);
                });

                it("then should subtract the number at the address adjusted by the Y offset", function () {
                    expect(cpu.rA).toBe(accumulatorValue - memoryValue);
                });
            });
        });

        describe("SBC Indexed Indirect X", function () {
            beforeEach(function () {
                operation = new Emulator.SubtractWithCarryIndexedIndirectX();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
            });

            describe("Given a zero page address and X offset", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, zeroPage);
                    cpu.poke(zeroPage + xOffset, memoryLocation & Constants.Memory.ByteMask);
                    cpu.poke(zeroPage + xOffset + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                    cpu.poke(memoryLocation, memoryValue);
                    cpu.rA = accumulatorValue;
                    cpu.rX = xOffset;
                    operation.execute(cpu);
                });

                it("then should locate the address at the zero page offset and use the value at that address to subtract", function () {
                    expect(cpu.rA).toBe(accumulatorValue - memoryValue);
                });
            });
        });

        describe("SBC Indirect Indexed Y", function () {
            beforeEach(function () {
                operation = new Emulator.SubtractWithCarryIndirectIndexedY();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
            });

            describe("Given a zero page address and Y offset", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, zeroPage);
                    cpu.poke(zeroPage, memoryLocation & Constants.Memory.ByteMask);
                    cpu.poke(zeroPage + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                    cpu.poke(memoryLocation + yOffset, memoryValue);
                    cpu.rA = accumulatorValue;
                    cpu.rY = yOffset;
                    operation.execute(cpu);
                });

                it("then should locate the address at the zero page offset then take that addres plus the y offset to subtract", function () {
                    expect(cpu.rA).toBe(accumulatorValue - memoryValue);
                });
            });
        });
    });
})(Tests || (Tests = {}));
