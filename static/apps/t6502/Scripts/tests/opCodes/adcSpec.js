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
    describe("ADC - Add with Carry", function () {
        var cpuSvc;
        var cpu;
        var consoleSvc;
        var operation;

        var zeroPage = 0x50;
        var xOffset = 0x05;
        var yOffset = 0x20;
        var memoryValue = 0x10;
        var accumulatorValue = 0x20;
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

        describe("ADC Immediate", function () {
            beforeEach(function () {
                operation = new Emulator.AddWithCarryImmediate();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, false);
            });

            describe("given not decimal mode and no carry flag set", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x46);
                    cpu.rA = 0x58;
                    operation.execute(cpu);
                });

                it("then should add the numbers and keep carry flag clear", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(false);
                    expect(cpu.rA).toBe(0x46 + 0x58);
                });
            });

            describe("given not decimal mode and carry flag set", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x46);
                    cpu.rA = 0x58;
                    cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
                    operation.execute(cpu);
                });

                it("then should add the numbers and reset the carry flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(false);
                    expect(cpu.rA).toBe(0x46 + 0x58 + 0x01);
                });
            });

            describe("given not decimal mode and addition results in carry", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0xFE);
                    cpu.rA = 0x02;
                    operation.execute(cpu);
                });

                it("then should add the numbers and set the carry flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(true);
                    expect(cpu.rA).toBe((0xFE + 0x02) & Constants.Memory.ByteMask);
                });
            });

            describe("given no unsigned carry but signed overflow", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x50);
                    cpu.rA = 0x50;
                    cpu.setFlag(Constants.ProcessorStatus.DecimalFlagSet, false);
                    operation.execute(cpu);
                });

                it("then should add the numbers and set the overflow flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.OverflowFlagSet)).toBe(true);
                    expect(cpu.rA).toBe(0xa0);
                });
            });

            describe("given unsigned carry and signed overflow", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0xd0);
                    cpu.rA = 0x90;
                    cpu.setFlag(Constants.ProcessorStatus.DecimalFlagSet, false);
                    operation.execute(cpu);
                });

                it("then should add the numbers and set the carry and set the overflow flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.OverflowFlagSet)).toBe(true);
                    expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(true);
                    expect(cpu.rA).toBe(0x60);
                });
            });

            describe("given decimal mode and no carry flag set", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x22);
                    cpu.rA = 0x22;
                    cpu.setFlag(Constants.ProcessorStatus.DecimalFlagSet, true);
                    operation.execute(cpu);
                });

                it("then should add the numbers and keep the carry flag clear", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(false);
                    expect(cpu.rA).toBe(0x44);
                });
            });

            describe("given decimal mode and carry flag set", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x22);
                    cpu.rA = 0x22;
                    cpu.setFlag(Constants.ProcessorStatus.DecimalFlagSet, true);
                    cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
                    operation.execute(cpu);
                });

                it("then should add the numbers and reset the carry flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(false);
                    expect(cpu.rA).toBe(0x45);
                });
            });

            describe("given decimal mode and addition that carries", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, 0x46);
                    cpu.rA = 0x58;
                    cpu.setFlag(Constants.ProcessorStatus.DecimalFlagSet, true);
                    operation.execute(cpu);
                });

                it("then should add the numbers and set the carry flag", function () {
                    expect(cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)).toBe(true);
                    expect(cpu.rA).toBe(0x04);
                });
            });
        });

        describe("ADC Zero Page", function () {
            beforeEach(function () {
                operation = new Emulator.AddWithCarryZeroPage();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, false);
            });

            describe("Given a zero page address", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, zeroPage);
                    cpu.poke(zeroPage, memoryValue);
                    cpu.rA = accumulatorValue;
                    operation.execute(cpu);
                });

                it("then should add the number at the address", function () {
                    expect(cpu.rA).toBe(memoryValue + accumulatorValue);
                });
            });
        });

        describe("ADC Zero Page, X", function () {
            beforeEach(function () {
                operation = new Emulator.AddWithCarryZeroPageX();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, false);
            });

            describe("Given a zero page address and X offset", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, zeroPage);
                    cpu.poke(zeroPage + xOffset, memoryValue);
                    cpu.rA = accumulatorValue;
                    cpu.rX = xOffset;
                    operation.execute(cpu);
                });

                it("then should add the number at the address computed with the X offset", function () {
                    expect(cpu.rA).toBe(memoryValue + accumulatorValue);
                });
            });
        });

        describe("ADC Absolute", function () {
            beforeEach(function () {
                operation = new Emulator.AddWithCarryAbsolute();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, false);
            });

            describe("Given an absolute address", function () {
                beforeEach(function () {
                    cpu.poke(cpu.rPC, memoryLocation & Constants.Memory.ByteMask);
                    cpu.poke(cpu.rPC + 1, (memoryLocation >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                    cpu.poke(memoryLocation, memoryValue);
                    cpu.rA = accumulatorValue;
                    operation.execute(cpu);
                });

                it("then should add the number at the address", function () {
                    expect(cpu.rA).toBe(memoryValue + accumulatorValue);
                });
            });
        });

        describe("ADC Absolute X", function () {
            beforeEach(function () {
                operation = new Emulator.AddWithCarryAbsoluteX();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, false);
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

                it("then should add the number at the address adjusted by the X offset", function () {
                    expect(cpu.rA).toBe(memoryValue + accumulatorValue);
                });
            });
        });

        describe("ADC Absolute Y", function () {
            beforeEach(function () {
                operation = new Emulator.AddWithCarryAbsoluteY();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, false);
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

                it("then should add the number at the address adjusted by the Y offset", function () {
                    expect(cpu.rA).toBe(memoryValue + accumulatorValue);
                });
            });
        });

        describe("ADC Indexed Indirect X", function () {
            beforeEach(function () {
                operation = new Emulator.AddWithCarryIndexedIndirectX();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, false);
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

                it("then should locate the address at the zero page offset and use the value at that address to add", function () {
                    expect(cpu.rA).toBe(memoryValue + accumulatorValue);
                });
            });
        });

        describe("ADC Indirect Indexed Y", function () {
            beforeEach(function () {
                operation = new Emulator.AddWithCarryIndirectIndexedY();
                cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, false);
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

                it("then should locate the address at the zero page offset then take that addres plus the y offset to add", function () {
                    expect(cpu.rA).toBe(memoryValue + accumulatorValue);
                });
            });
        });
    });
})(Tests || (Tests = {}));
