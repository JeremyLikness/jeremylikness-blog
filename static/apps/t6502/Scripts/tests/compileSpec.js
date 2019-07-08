/// <reference path='jasmine.d.ts'/>
/// <reference path='../app/defs/angular.d.ts'/>
/// <reference path='angular-mocks.d.ts'/>
/// <reference path='../app/defs/jquery.d.ts'/>
/// <reference path='../app/app.ts'/>
/// <reference path='../app/services/cpuService.ts'/>
/// <reference path='../app/services/consoleService.ts'/>
/// <reference path='../app/emulator/compiler.ts'/>
/// <reference path='../app/emulator/opCodes.ts'/>
var Tests;
(function (Tests) {
    describe("compiler", function () {
        var cpuSvc;
        var cpu;
        var consoleSvc;
        var compiler;

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
                compiler = cpuSvc.getCompiler();
            });
        });

        describe("given compiler when decompiler called with code", function () {
            beforeEach(function () {
                var jmpAbsolute = new Emulator.JmpAbsolute();
                var address = cpu.rPC;

                // $0200: JMP $0200
                cpu.poke(cpu.rPC, jmpAbsolute.opCode);
                cpu.poke(cpu.rPC + 1, address & Constants.Memory.ByteMask);
                cpu.poke(cpu.rPC + 2, address >> Constants.Memory.BitsInByte);
            });

            it("then should return the decompiled code", function () {
                var actual = compiler.decompile(cpu.rPC);
                expect(actual).toContain("$" + toHexAddress(cpu.rPC) + ": JMP $" + toHexAddress(cpu.rPC));
            });
        });

        describe("given compiler when compile called with simple code", function () {
            beforeEach(function () {
                compiler.compile("JMP $" + toHexAddress(cpu.rPC));
            });

            it("then should compile the code at the default address", function () {
                var jmpOpcode = new Emulator.JmpAbsolute();
                var expected = [
                    jmpOpcode.opCode,
                    cpu.rPC & Constants.Memory.ByteMask,
                    (cpu.rPC >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask
                ];
                var actual = [
                    cpu.peek(cpu.rPC),
                    cpu.peek(cpu.rPC + 1),
                    cpu.peek(cpu.rPC + 2)
                ];
                expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
            });
        });

        describe("given compiler when compile called with comments", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile(";this is a comment     \n" + ";this is another comment.");
            });

            it("then should ignore the comments", function () {
                expect(result).toBe(true);
            });
        });

        describe("given compiler when a memory label is specified", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("$C000: JMP $C000");
            });

            it("then should compile starting at the memory address", function () {
                var jmpOpcode = new Emulator.JmpAbsolute();
                var expected = [
                    jmpOpcode.opCode,
                    0x00,
                    0xc0
                ];
                var actual = [
                    cpu.peek(0xc000),
                    cpu.peek(0xc001),
                    cpu.peek(0xc002)
                ];
                expect(result).toBe(true);
                expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
            });

            it("then should set the program counter to the start address", function () {
                expect(cpu.rPC).toBe(0xc000);
            });
        });

        describe("given compiler when a start address is specified", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("* = $C000      \n" + "JMP $C000        ");
            });

            it("then should set the start address to the specified address and compile the code", function () {
                var jmpOpcode = new Emulator.JmpAbsolute();
                var expected = [
                    jmpOpcode.opCode,
                    0x00,
                    0xc0
                ];
                var actual = [
                    cpu.peek(0xc000),
                    cpu.peek(0xc001),
                    cpu.peek(0xc002)
                ];
                expect(result).toBe(true);
                expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
            });

            it("then should set the program counter to the start address", function () {
                expect(cpu.rPC).toBe(0xc000);
            });
        });

        describe("given compiler when a start address is specified with decimal", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("* = 49152      \n" + "JMP 49152        ");
            });

            it("then should set the start address to the specified address and compile the code", function () {
                var jmpOpcode = new Emulator.JmpAbsolute();
                var expected = [
                    jmpOpcode.opCode,
                    0x00,
                    0xc0
                ];
                var actual = [
                    cpu.peek(0xc000),
                    cpu.peek(0xc001),
                    cpu.peek(0xc002)
                ];
                expect(result).toBe(true);
                expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
            });

            it("then should set the program counter to the start address", function () {
                expect(cpu.rPC).toBe(0xc000);
            });
        });

        describe("given compiler when source is provided with labels", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("LOOP: JMP LOOP");
            });

            it("then should resolve the labels and compile the code using the appropriate addresses", function () {
                var jmpOpcode = new Emulator.JmpAbsolute();
                var expected = [
                    jmpOpcode.opCode,
                    cpu.rPC & Constants.Memory.ByteMask,
                    (cpu.rPC >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask
                ];
                var actual = [
                    cpu.peek(cpu.rPC),
                    cpu.peek(cpu.rPC + 1),
                    cpu.peek(cpu.rPC + 2)
                ];
                expect(result).toBe(true);
                expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
            });
        });

        describe("given compiler when source is provided with labels that match hex", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("ADD: JMP ADD");
            });

            it("then should resolve the labels and compile the code using the appropriate addresses", function () {
                var jmpOpcode = new Emulator.JmpAbsolute();
                var expected = [
                    jmpOpcode.opCode,
                    cpu.rPC & Constants.Memory.ByteMask,
                    (cpu.rPC >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask
                ];
                var actual = [
                    cpu.peek(cpu.rPC),
                    cpu.peek(cpu.rPC + 1),
                    cpu.peek(cpu.rPC + 2)
                ];
                expect(result).toBe(true);
                expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
            });
        });

        describe("given compiler when source is provided with duplicate labels", function () {
            var result;
            var currentCode;

            beforeEach(function () {
                currentCode = [
                    cpu.peek(cpu.rPC),
                    cpu.peek(cpu.rPC + 1),
                    cpu.peek(cpu.rPC + 2)
                ];

                result = compiler.compile("LOOP: JMP LOOP      \n" + "LOOP: JMP LOOP");
            });

            it("then should not compile and log a message to the console", function () {
                expect(result).toBe(false);
                var actual = [
                    cpu.peek(cpu.rPC),
                    cpu.peek(cpu.rPC + 1),
                    cpu.peek(cpu.rPC + 2)
                ];
                expect(JSON.stringify(actual)).toBe(JSON.stringify(currentCode));
            });
        });

        describe("given compiler when source is provided with invalid op codes", function () {
            var result;
            var currentCode;

            beforeEach(function () {
                currentCode = [
                    cpu.peek(cpu.rPC),
                    cpu.peek(cpu.rPC + 1),
                    cpu.peek(cpu.rPC + 2)
                ];

                result = compiler.compile("BLEH $C000");
            });

            it("then should not compile and log a message to the console", function () {
                expect(result).toBe(false);
                var actual = [
                    cpu.peek(cpu.rPC),
                    cpu.peek(cpu.rPC + 1),
                    cpu.peek(cpu.rPC + 2)
                ];
                expect(JSON.stringify(actual)).toBe(JSON.stringify(currentCode));
            });
        });

        describe("given compiler when a return from subroutine is specified", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("* = 49152      \n" + "RTS        ");
            });

            it("then should set the RTS op code at the memory location", function () {
                var rtsCode = new Emulator.RtsSingle();
                expect(result).toBe(true);
                expect(cpu.peek(0xc000)).toEqual(rtsCode.opCode);
            });

            it("then should set the program counter to the start address", function () {
                expect(cpu.rPC).toBe(0xc000);
            });
        });

        describe("given compiler when immediate mode is specified", function () {
            var result;
            var opCode = new Emulator.LoadAccumulatorImmediate();

            beforeEach(function () {
                result = compiler.compile("LDA #$0A   \n" + "LDA #22   ; this is a comment");
            });

            it("then should handle a hex value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(0x0A);
            });

            it("then should handle the decimal value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC + 2)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 3)).toBe(22);
            });
        });

        describe("given compiler when immediate mode is specified", function () {
            describe("when high byte is specified", function () {
                var result;
                var opCode = new Emulator.LoadAccumulatorImmediate();

                beforeEach(function () {
                    result = compiler.compile("LABEL: LDA #>LABEL");
                });

                it("then should handle the high value of the label", function () {
                    expect(result).toBe(true);
                    expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                    expect(cpu.peek(cpu.rPC + 1)).toBe((cpu.rPC >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                });
            });

            describe("when low byte is specified", function () {
                var result;
                var opCode = new Emulator.LoadAccumulatorImmediate();

                beforeEach(function () {
                    result = compiler.compile("LABEL: LDA #<LABEL");
                });

                it("then should handle the low value of the label", function () {
                    expect(result).toBe(true);
                    expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                    expect(cpu.peek(cpu.rPC + 1)).toBe(cpu.rPC & Constants.Memory.ByteMask);
                });
            });

            describe("when label isn't defined yet", function () {
                var result;
                var opCode = new Emulator.LoadAccumulatorImmediate();

                beforeEach(function () {
                    result = compiler.compile("LDA #<LABEL\nLABEL:");
                });

                it("then should handle the low value of the label", function () {
                    expect(result).toBe(true);
                    expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                    expect(cpu.peek(cpu.rPC + 1)).toBe((cpu.rPC + opCode.sizeBytes) & Constants.Memory.ByteMask);
                });
            });

            describe("when label is never defined", function () {
                var result;
                var opCode = new Emulator.LoadAccumulatorImmediate();

                beforeEach(function () {
                    result = compiler.compile("LDA #<NOLABEL");
                });

                it("then should not compile", function () {
                    expect(result).toBe(false);
                });
            });
        });

        describe("given compiler when immediate mode is specified with invalid value", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("LDA #$AAB");
            });

            it("then should not compile", function () {
                expect(result).toBe(false);
            });
        });

        describe("given compiler when absolute mode is specified", function () {
            var result;
            var opCode = new Emulator.IncAbsolute();

            beforeEach(function () {
                result = compiler.compile("INC $c000   \n" + "INC 49152   ; this is a comment");
            });

            it("then should handle a hex value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(0x00);
                expect(cpu.peek(cpu.rPC + 2)).toBe(0xc0);
            });

            it("then should handle the decimal value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC + 3)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 4)).toBe(0x00);
                expect(cpu.peek(cpu.rPC + 5)).toBe(0xc0);
            });
        });

        describe("given compiler when zero page is specified", function () {
            var result;
            var opCode = new Emulator.StoreAccumulatorZeroPage();

            beforeEach(function () {
                result = compiler.compile("STA $01   \n" + "STA 254   ");
            });

            it("then should handle a hex value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(0x01);
            });

            it("then should handle the decimal value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC + 2)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 3)).toBe(254);
            });
        });

        describe("given compiler when immediate mode is specified with invalid value", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("LDA $C0000");
            });

            it("then should not compile", function () {
                expect(result).toBe(false);
            });
        });

        describe("given compiler when absolute mode with X index is specified", function () {
            var result;
            var opCode = new Emulator.IncAbsoluteX();

            beforeEach(function () {
                result = compiler.compile("INC $c000, X   \n" + "INC 49152, X   ; this is a comment");
            });

            it("then should handle a hex value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(0x00);
                expect(cpu.peek(cpu.rPC + 2)).toBe(0xc0);
            });

            it("then should handle the decimal value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC + 3)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 4)).toBe(0x00);
                expect(cpu.peek(cpu.rPC + 5)).toBe(0xc0);
            });
        });

        describe("given compiler when absolute mode with X index using label is specified", function () {
            var result;
            var opCode = new Emulator.IncAbsoluteX();

            beforeEach(function () {
                result = compiler.compile("LABEL: INC LABEL, X");
            });

            it("then should handle the label", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(cpu.rPC & Constants.Memory.ByteMask);
                expect(cpu.peek(cpu.rPC + 2)).toBe((cpu.rPC >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
            });
        });

        describe("given compiler when absolute mode with X index using future label is specified", function () {
            var result;
            var opCode = new Emulator.IncAbsoluteX();

            beforeEach(function () {
                result = compiler.compile("INC LABEL, X\nLABEL:");
            });

            it("then should handle the label", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(cpu.rPC + opCode.sizeBytes & Constants.Memory.ByteMask);
                expect(cpu.peek(cpu.rPC + 2)).toBe(((cpu.rPC + opCode.sizeBytes) >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
            });
        });

        describe("given compiler when absolute mode with X index is specified with invalid value", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("INC $C0000, X");
            });

            it("then should not compile", function () {
                expect(result).toBe(false);
            });
        });

        describe("given compiler when absolute mode with Y index is specified", function () {
            var result;
            var opCode = new Emulator.StoreAccumulatorAbsoluteY();

            beforeEach(function () {
                result = compiler.compile("STA $c000, Y   \n" + "STA 49152,Y   ; this is a comment");
            });

            it("then should handle a hex value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(0x00);
                expect(cpu.peek(cpu.rPC + 2)).toBe(0xc0);
            });

            it("then should handle the decimal value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC + 3)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 4)).toBe(0x00);
                expect(cpu.peek(cpu.rPC + 5)).toBe(0xc0);
            });
        });

        describe("given compiler when absolute mode with Y index is specified with invalid value", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("STA $C0000, Y");
            });

            it("then should not compile", function () {
                expect(result).toBe(false);
            });
        });

        describe("given compiler when branch with address encountered", function () {
            var result;
            var opCode = new Emulator.BranchNotEqualRelative();

            beforeEach(function () {
                result = compiler.compile("$c000: BNE $C000");
            });

            it("then should compile to correct branch", function () {
                expect(result).toBe(true);
                expect(cpu.peek(0xC000)).toBe(opCode.opCode);
                expect(cpu.peek(0xC001)).toBe(0xFE);
            });
        });

        describe("given compiler when branch with label encountered", function () {
            var result;
            var opCode = new Emulator.BranchNotEqualRelative();

            beforeEach(function () {
                result = compiler.compile("LABEL: BNE LABEL");
            });

            it("then should compile to correct branch", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(0xFE);
            });
        });

        describe("given compiler when branch with future label encountered", function () {
            var result;
            var opCode = new Emulator.BranchNotEqualRelative();

            beforeEach(function () {
                result = compiler.compile("BNE LABEL\nLABEL:");
            });

            it("then should compile to correct branch", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(0x00);
            });
        });

        describe("given compiler when indexed indirect x encountered", function () {
            var result;
            var opCode = new Emulator.ExclusiveOrIndirectX();

            beforeEach(function () {
                result = compiler.compile("EOR ($44,X)");
            });

            it("then should compile to correct code", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(0x44);
            });
        });

        describe("given compiler when indirect indexed y encountered", function () {
            var result;
            var opCode = new Emulator.StoreAccumulatorIndirectY();

            beforeEach(function () {
                result = compiler.compile("STA ($44),Y");
            });

            it("then should compile to correct code", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(0x44);
            });
        });

        describe("given compiler when indirect mode is specified", function () {
            var result;
            var opCode = new Emulator.JmpIndirect();

            beforeEach(function () {
                result = compiler.compile("JMP ($c000)   \n" + "JMP (49152)   ; this is a comment");
            });

            it("then should handle a hex value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(0x00);
                expect(cpu.peek(cpu.rPC + 2)).toBe(0xc0);
            });

            it("then should handle the decimal value", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC + 3)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 4)).toBe(0x00);
                expect(cpu.peek(cpu.rPC + 5)).toBe(0xc0);
            });
        });

        describe("given compiler when indirect mode using label is specified", function () {
            var result;
            var opCode = new Emulator.JmpIndirect();

            beforeEach(function () {
                result = compiler.compile("LABEL: JMP (LABEL)");
            });

            it("then should handle the label", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(cpu.rPC & Constants.Memory.ByteMask);
                expect(cpu.peek(cpu.rPC + 2)).toBe((cpu.rPC >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
            });
        });

        describe("given compiler when indirect mode using future label is specified", function () {
            var result;
            var opCode = new Emulator.JmpIndirect();

            beforeEach(function () {
                result = compiler.compile("JMP (LABEL)\nLABEL:");
            });

            it("then should handle the label", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(opCode.opCode);
                expect(cpu.peek(cpu.rPC + 1)).toBe(cpu.rPC + opCode.sizeBytes & Constants.Memory.ByteMask);
                expect(cpu.peek(cpu.rPC + 2)).toBe(((cpu.rPC + opCode.sizeBytes) >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
            });
        });

        describe("given compiler when indirect mode is specified with invalid value", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("JMP ($C0000)");
            });

            it("then should not compile", function () {
                expect(result).toBe(false);
            });
        });

        describe("given compiler when label math encountered", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("main: LDA #$12 \n" + "ac_value = main + 5\n" + "LDA #<ac_value\n" + "LDA #>ac_value\n");
            });

            it("then should compile and update the label accordingly", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC + 3)).toBe(5);
                expect(cpu.peek(cpu.rPC + 5)).toBe(cpu.rPC >> Constants.Memory.BitsInByte);
            });
        });

        describe("given compiler when label math encountered with future label", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("ac_value = main + 5\n" + "main: LDA #$12 \n" + "LDA #<ac_value\n" + "LDA #>ac_value\n");
            });

            it("then should compile and update the label accordingly", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC + 3)).toBe(5);
                expect(cpu.peek(cpu.rPC + 5)).toBe(cpu.rPC >> Constants.Memory.BitsInByte);
            });
        });

        describe("given compiler when DCB command encountered", function () {
            var result;

            beforeEach(function () {
                result = compiler.compile("Label: DCB 12, 13, $10, $11\n");
            });

            it("then should compile the bytes directly to memory", function () {
                expect(result).toBe(true);
                expect(cpu.peek(cpu.rPC)).toBe(12);
                expect(cpu.peek(cpu.rPC + 1)).toBe(13);
                expect(cpu.peek(cpu.rPC + 2)).toBe(0x10);
                expect(cpu.peek(cpu.rPC + 3)).toBe(0x11);
            });
        });
    });
})(Tests || (Tests = {}));
