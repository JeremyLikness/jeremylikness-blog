/// <reference path='jasmine.d.ts'/>
/// <reference path='../app/defs/angular.d.ts'/>
/// <reference path='angular-mocks.d.ts'/>
/// <reference path='../app/defs/jquery.d.ts'/>
/// <reference path='../app/app.ts'/>
/// <reference path='../app/emulator/cpu.ts'/>
var Tests;
(function (Tests) {
    describe("cpu", function () {
        var cpu;
        var console;
        var display;
        var testValue = 0x6E;
        var testValue2 = 0x88;
        var testWord = 0x1234;
        var invalidValue = 0x101;
        var invalidAddress = 0x10001;

        function loadInfiniteLoop() {
            cpu.poke(0x200, 0x03);
            cpu.poke(0x201, 0x00);
            cpu.poke(0x202, 0x02);
        }

        function testFlag(mask) {
            return Boolean(cpu.rP & mask);
        }

        beforeEach(function () {
            module("app");
        });

        beforeEach(function () {
            inject(function (consoleService, displayService, $timeout) {
                console = consoleService;
                display = displayService;
                cpu = new Emulator.Cpu(console, display, $timeout);
            });
        });

        afterEach(function () {
            cpu.stop();
        });

        describe("given cpu when constructed", function () {
            it("then should set all default registers", function () {
                expect(cpu.rA).toBe(0x00);
                expect(cpu.rX).toBe(0x00);
                expect(cpu.rY).toBe(0x00);
                expect(cpu.rP).toBe(0x00);
                expect(cpu.rPC).toBe(Constants.Memory.DefaultStart);
                expect(cpu.rSP).toBe(Constants.Memory.Stack);
            });

            it("then should reset all timer information", function () {
                expect(cpu.started).toBe(null);
                expect(cpu.elapsedMilliseconds).toBe(0);
                expect(cpu.instructionsPerSecond).toBe(0);
            });

            it("then should reset running and error states", function () {
                expect(cpu.runningState).toBe(false);
                expect(cpu.errorState).toBe(false);
            });

            it("then should log to the console", function () {
                expect(console.lines.length).toBe(1);
            });
        });

        describe("given cpu that is running when stop called", function () {
            beforeEach(function () {
                loadInfiniteLoop();
            });

            it("then should set running state to false", function () {
                cpu.run();
                var done = false;

                runs(function () {
                    setTimeout(function () {
                        cpu.stop();
                        done = true;
                    }, 10);
                });

                waitsFor(function () {
                    return done;
                }, "Failed to stop the cpu.", 1000);

                runs(function () {
                    expect(cpu.runningState).toBe(false);
                });
            });
        });

        describe("given cpu that is running when halt called", function () {
            var consoleLines;

            beforeEach(function () {
                loadInfiniteLoop();

                cpu.run();
                var done = false;

                runs(function () {
                    setTimeout(function () {
                        consoleLines = console.lines.length;
                        cpu.halt();
                        done = true;
                    }, 10);
                });

                waitsFor(function () {
                    return done;
                }, "Failed to stop the cpu.", 1000);
            });

            it("then should set running state to false", function () {
                expect(cpu.runningState).toBe(false);
            });

            it("then should set error state to true", function () {
                expect(cpu.errorState).toBe(true);
            });

            it("then should log the halt to the console", function () {
                expect(console.lines.length).toBeGreaterThan(consoleLines);
            });
        });

        describe("given cpu that is running when run called", function () {
            it("then logs to the console that the cpu is already running", function () {
                loadInfiniteLoop();
                var initial = console.lines.length;
                cpu.run();
                var current = console.lines.length;
                expect(current).toBe(initial);
                cpu.run();
                expect(console.lines.length).toBe(current + 1);
                cpu.stop();
            });
        });

        describe("given cpu in error state when run called", function () {
            it("then logs to the console that the cpu cannot run", function () {
                var current = console.lines.length;
                loadInfiniteLoop();
                cpu.errorState = true;
                cpu.run();
                expect(console.lines.length).toBe(current + 1);
                expect(cpu.runningState).toBe(false);
            });
        });

        describe("given cpu in valid state when run called", function () {
            beforeEach(function () {
                loadInfiniteLoop();
                cpu.run();
            });

            afterEach(function () {
                cpu.stop();
            });

            it("then should set running state to true", function () {
                expect(cpu.runningState).toBe(true);
            });
        });

        describe("given cpu with stack available when stackPush called", function () {
            var result;

            beforeEach(function () {
                result = cpu.stackPush(testValue);
            });

            it("then should return true", function () {
                expect(result).toBe(true);
            });

            it("then should update the stack pointer", function () {
                expect(cpu.rSP).toBe(0xFF);
            });
        });

        describe("given cpu with no stack available when stackPush called", function () {
            var result;

            beforeEach(function () {
                cpu.rSP = -1;
            });

            it("then should throw an exception", function () {
                expect(function () {
                    cpu.stackPush(testValue);
                }).toThrow();
            });
        });

        describe("given cpu with information on stack when stackPop called", function () {
            beforeEach(function () {
                cpu.stackPush(testValue);
                cpu.stackPush(testValue2);
            });

            it("then should return the last value on the stack", function () {
                var actual = cpu.stackPop();
                expect(actual).toBe(testValue2);
            });
        });

        describe("given cpu with no information on stack when stackPop called", function () {
            it("then should throw an exception", function () {
                expect(function () {
                    var actual = cpu.stackPop();
                }).toThrow();
            });
        });

        describe("given cpu with address on stack when stackRts called", function () {
            beforeEach(function () {
                var addressAdjusted = testWord - 1;
                cpu.stackPush((addressAdjusted >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                cpu.stackPush(addressAdjusted & Constants.Memory.ByteMask);
            });

            it("then should set the program counter to 1 more than the address that was popped", function () {
                cpu.stackRts();
                expect(cpu.rPC).toBe(testWord);
            });
        });

        describe("given cpu when addressPop called", function () {
            beforeEach(function () {
                cpu.poke(cpu.rPC, testValue);
            });

            it("then should pop the value at that address", function () {
                var actual = cpu.addrPop();
                expect(actual).toBe(testValue);
            });
        });

        describe("given cpu when addressPopWord called", function () {
            beforeEach(function () {
                cpu.poke(cpu.rPC, testWord & Constants.Memory.ByteMask);
                cpu.poke(cpu.rPC + 1, (testWord >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
            });

            it("then should pop the word at that address", function () {
                var actual = cpu.addrPopWord();
                expect(actual).toBe(testWord);
            });
        });

        describe("given cpu when poke called with invalid address", function () {
            beforeEach(function () {
                cpu.poke(invalidAddress, testValue);
            });

            it("then should mask the invalid address to the valid range and set the address to the value", function () {
                var actual = cpu.peek(invalidAddress & Constants.Memory.Max);
                expect(actual).toBe(testValue);
            });
        });

        describe("given cpu when poke called with valid address", function () {
            beforeEach(function () {
                cpu.poke(testWord, testValue);
            });

            it("then should set the address to the value", function () {
                var actual = cpu.peek(testWord);
                expect(actual).toBe(testValue);
            });
        });

        describe("given cpu when poke called with invalid value", function () {
            beforeEach(function () {
                cpu.poke(testWord, invalidValue);
            });

            it("then should mask the value to the valid range and set the address to the masked value", function () {
                var actual = cpu.peek(testWord);
                expect(actual).toBe(invalidValue & Constants.Memory.ByteMask);
            });
        });

        describe("given cpu when peek called with invalid address", function () {
            beforeEach(function () {
                cpu.poke(invalidAddress, testValue);
            });

            it("then should mask the address to a valid range and return the byte at the masked address", function () {
                var actual = cpu.peek(invalidAddress);
                expect(actual).toBe(testValue);
            });
        });

        describe("given cpu when peek called with valid address", function () {
            beforeEach(function () {
                cpu.poke(testWord, testValue);
            });
            it("then should return the value at that address", function () {
                var actual = cpu.peek(testWord);
                expect(actual).toBe(testValue);
            });
        });

        describe("special memory scenarios", function () {
            describe("given cpu when display memory address is updated", function () {
                beforeEach(function () {
                    cpu.poke(Constants.Display.DisplayStart + 0x2, testValue);
                });

                it("then should update the display with the corresponding value", function () {
                    var actual = display.pixels[0x2];
                    expect(actual).toBe(testValue);
                });
            });

            describe("given cpu when peek called at the memory address of the random number generator", function () {
                it("then should return a random value between 0 and 255", function () {
                    var randomNumbers = [];
                    var idx;
                    for (idx = 0; idx < 10; idx++) {
                        var value = cpu.peek(Constants.Memory.ZeroPageRandomNumberGenerator);
                        expect(value).toBeGreaterThan(-1);
                        expect(value).toBeLessThan(0x100);
                        randomNumbers.push(value);
                    }
                    randomNumbers.sort();
                    expect(randomNumbers[0]).toNotBe(randomNumbers[randomNumbers.length - 1]);
                });
            });
        });

        describe("given value with negative bit set when setFlags called", function () {
            beforeEach(function () {
                cpu.setFlags(testValue2);
            });

            it("then should set the negative flag", function () {
                expect(testFlag(Constants.ProcessorStatus.NegativeFlagSet)).toBe(true);
            });
        });

        describe("given value with negative bit not set when setFlags called", function () {
            beforeEach(function () {
                cpu.setFlags(testValue);
            });

            it("then should reset the negative flag", function () {
                expect(testFlag(Constants.ProcessorStatus.NegativeFlagSet)).toBe(false);
            });
        });

        describe("given zero value when setFlags called", function () {
            beforeEach(function () {
                cpu.setFlags(0);
            });

            it("then should set the zero flag", function () {
                expect(testFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(true);
            });
        });

        describe("given non-zero value when setFlags called", function () {
            beforeEach(function () {
                cpu.setFlags(testValue);
            });

            it("then should reset the zero flag", function () {
                expect(testFlag(Constants.ProcessorStatus.ZeroFlagSet)).toBe(false);
            });
        });

        describe("given value without overflow when compareWithFlags called", function () {
        });

        describe("given value with overflow when compareWithFlags called", function () {
        });

        describe("given non-matching values when compareWithFlags called", function () {
        });

        describe("given matching values when compareWithFlags called", function () {
        });

        describe("given value greater than register when compareWithFlags called", function () {
        });

        describe("given value less than register when compareWithFlags called", function () {
        });

        describe("given op code value when getOperation called", function () {
        });
    });
})(Tests || (Tests = {}));
