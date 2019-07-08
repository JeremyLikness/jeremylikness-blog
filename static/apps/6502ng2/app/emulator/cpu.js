System.register(['angular2/core', './opscodes', '../services/consoleService', '../services/displayService', '../globalConstants'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, opscodes_1, consoleService_1, displayService_1, globalConstants_1;
    var Cpu;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (opscodes_1_1) {
                opscodes_1 = opscodes_1_1;
            },
            function (consoleService_1_1) {
                consoleService_1 = consoleService_1_1;
            },
            function (displayService_1_1) {
                displayService_1 = displayService_1_1;
            },
            function (globalConstants_1_1) {
                globalConstants_1 = globalConstants_1_1;
            }],
        execute: function() {
            Cpu = (function () {
                function Cpu(consoleService, displayService) {
                    var _this = this;
                    this.consoleService = consoleService;
                    this.displayService = displayService;
                    this.memory = new Array(globalConstants_1.Constants.Memory.Size);
                    this.instructions = 0;
                    this.lastCheck = 0;
                    this.operationMap = [];
                    this.log = function (msg) { return _this.consoleService.log(msg); };
                    opscodes_1.OpCodes.FillOps(this.operationMap);
                    this.autoRefresh = true;
                    this.debug = false;
                    this.reset();
                }
                Cpu.prototype.stop = function () {
                    this.runningState = false;
                };
                Cpu.prototype.halt = function () {
                    this.stop();
                    this.errorState = true;
                    this.consoleService.log("Processing has been halted. RESET to continue.");
                };
                Cpu.prototype.reset = function () {
                    var idx;
                    this.rA = 0x00;
                    this.rX = 0x00;
                    this.rY = 0x00;
                    this.rP = 0x00;
                    this.rPC = globalConstants_1.Constants.Memory.DefaultStart;
                    this.rSP = globalConstants_1.Constants.Memory.Stack;
                    this.started = null;
                    this.elapsedMilliseconds = 0;
                    this.instructionsPerSecond = 0;
                    this.lastCheck = null;
                    this.instructions = 0;
                    for (idx = 0; idx < this.memory.length; idx++) {
                        this.memory[idx] = 0x00;
                    }
                    // reset the display 
                    for (idx = 0; idx < this.displayService.pixels.length; idx++) {
                        if (this.displayService.pixels[idx] !== 0x0) {
                            this.displayService.draw(idx, 0x0);
                        }
                    }
                    this.runningState = false;
                    this.errorState = false;
                    this.consoleService.log("CPU has been successfully reset.");
                };
                Cpu.prototype.step = function () {
                    if (this.errorState) {
                        this.consoleService.log("Cannot run in error state. Please RESET first.");
                        return;
                    }
                    this.runningState = true;
                    this.started = new Date();
                    this.lastCheck = this.started.getTime();
                    this.execute();
                    this.stop();
                };
                // kicks of the execution of code
                Cpu.prototype.run = function () {
                    var _this = this;
                    if (this.runningState) {
                        this.consoleService.log("Already running.");
                        return;
                    }
                    if (this.errorState) {
                        this.consoleService.log("Cannot run in error state. Please RESET first.");
                        return;
                    }
                    this.runningState = true;
                    this.started = new Date();
                    this.lastCheck = this.started.getTime();
                    window.setTimeout(function () { return _this.executeBatch.apply(_this); }, 0);
                };
                // this is the main execution loop that pauses every few sets to allow events, etc.
                // to be processed. Adjust the number of instructions down if the app is not responsive
                Cpu.prototype.executeBatch = function () {
                    var _this = this;
                    if (!this.runningState || this.errorState) {
                        return;
                    }
                    var instructions = 0xff;
                    while (instructions--) {
                        this.execute();
                    }
                    // run again
                    if (this.autoRefresh) {
                        window.setTimeout(function () { return _this.executeBatch.apply(_this); }, 0);
                    }
                    var now = new Date();
                    this.elapsedMilliseconds = now.getTime() - this.started.getTime();
                    if (now.getTime() - this.lastCheck > 1000) {
                        this.instructionsPerSecond = this.instructions;
                        this.instructions = 0;
                        this.lastCheck = now.getTime();
                    }
                };
                // main loop - op codes update their own program counter so this just contiuously
                // grabs an instruction, runs it, and grabs the next
                Cpu.prototype.execute = function () {
                    if (!this.runningState || this.errorState) {
                        return;
                    }
                    try {
                        var oldAddress = this.rPC;
                        var op = this.operationMap[this.addrPop()];
                        if (this.debug) {
                            this.consoleService.log(op.decompile(oldAddress, [
                                op.opCode,
                                this.memory[oldAddress + 1],
                                this.memory[oldAddress + 2]
                            ]));
                        }
                        op.execute(this);
                    }
                    catch (exception) {
                        this.consoleService.log("Unexpected exception: " + exception);
                        this.halt();
                    }
                    // track instructions per second 
                    this.instructions += 1;
                };
                Cpu.prototype.checkFlag = function (flag) {
                    return (this.rP & flag) > 0;
                };
                Cpu.prototype.setFlag = function (flag, setFlag) {
                    var resetFlag = globalConstants_1.Constants.Memory.ByteMask - flag;
                    if (setFlag) {
                        this.rP |= flag;
                    }
                    else {
                        this.rP &= resetFlag;
                    }
                };
                // push a value to the stack or throw an exception when full
                Cpu.prototype.stackPush = function (value) {
                    if (this.rSP >= 0x0) {
                        this.rSP -= 1;
                        this.memory[this.rSP + globalConstants_1.Constants.Memory.Stack] = value;
                        return true;
                    }
                    else {
                        throw "Stack overflow.";
                    }
                };
                // pop a value from the stack or throw an exception when empty
                Cpu.prototype.stackPop = function () {
                    if (this.rSP < globalConstants_1.Constants.Memory.Stack) {
                        var value = this.memory[this.rSP + globalConstants_1.Constants.Memory.Stack];
                        this.rSP++;
                        return value;
                    }
                    else {
                        throw "Tried to pop empty stack.";
                    }
                };
                // execute a "return from subroutine" by popping the return value from the stack
                Cpu.prototype.stackRts = function () {
                    this.rPC = this.stackPop() + 0x01 + (this.stackPop() << globalConstants_1.Constants.Memory.BitsInByte);
                };
                // pop the address and increment the PC 
                Cpu.prototype.addrPop = function () {
                    var value = this.peek(this.rPC);
                    this.rPC += 1;
                    return value;
                };
                // grab a word, low byte first 
                Cpu.prototype.addrPopWord = function () {
                    var word = this.addrPop() + (this.addrPop() << globalConstants_1.Constants.Memory.BitsInByte);
                    return word;
                };
                // set a value. Will recognize when a value is set in display memory and 
                // use the display service to update that
                Cpu.prototype.poke = function (address, value) {
                    this.memory[address & globalConstants_1.Constants.Memory.Max] = value & globalConstants_1.Constants.Memory.ByteMask;
                    if (address >= globalConstants_1.Constants.Display.DisplayStart && address <= globalConstants_1.Constants.Display.DisplayStart + globalConstants_1.Constants.Display.Max) {
                        this.displayService.draw(address, value);
                    }
                };
                Cpu.prototype.peek = function (address) {
                    // special address 
                    if (address === globalConstants_1.Constants.Memory.ZeroPageRandomNumberGenerator) {
                        return Math.floor(Math.random() * 0x100);
                    }
                    return this.memory[address & 0xFFFF];
                };
                Cpu.prototype.setFlags = function (value) {
                    if (value & globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet) {
                        this.rP |= globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet;
                    }
                    else {
                        this.rP &= globalConstants_1.Constants.ProcessorStatus.NegativeFlagReset;
                    }
                    if (value) {
                        this.rP &= globalConstants_1.Constants.ProcessorStatus.ZeroFlagReset;
                    }
                    else {
                        this.rP |= globalConstants_1.Constants.ProcessorStatus.ZeroFlagSet;
                    }
                };
                Cpu.prototype.compareWithFlags = function (registerValue, value) {
                    var temp, offset;
                    offset = globalConstants_1.Constants.Memory.ByteMask + registerValue - value + 1;
                    this.setFlag(globalConstants_1.Constants.ProcessorStatus.CarryFlagSet, offset >= 0x100);
                    temp = offset & globalConstants_1.Constants.Memory.ByteMask;
                    this.setFlags(temp);
                };
                Cpu.prototype.addrAbsoluteX = function () {
                    return (this.addrPopWord() + this.rX) & globalConstants_1.Constants.Memory.Max;
                };
                Cpu.prototype.addrAbsoluteY = function () {
                    return (this.addrPopWord() + this.rY) & globalConstants_1.Constants.Memory.Max;
                };
                Cpu.prototype.addrIndirect = function () {
                    var addressLocation = this.addrPopWord();
                    var newAddress = this.peek(addressLocation) + (this.peek(addressLocation + 1) << globalConstants_1.Constants.Memory.BitsInByte);
                    return newAddress & globalConstants_1.Constants.Memory.Max;
                };
                Cpu.prototype.addrIndexedIndirectX = function () {
                    var zeroPage = (this.addrPop() + this.rX) & globalConstants_1.Constants.Memory.ByteMask;
                    var address = this.peek(zeroPage) + (this.peek(zeroPage + 1) << globalConstants_1.Constants.Memory.BitsInByte);
                    return address;
                };
                Cpu.prototype.addrIndirectIndexedY = function () {
                    var zeroPage = this.addrPop();
                    var target = this.peek(zeroPage) + (this.peek(zeroPage + 1) << globalConstants_1.Constants.Memory.BitsInByte)
                        + this.rY;
                    return target;
                };
                Cpu.prototype.addrZeroPageX = function () {
                    var zeroPage = (this.addrPop() + this.rX) & globalConstants_1.Constants.Memory.ByteMask;
                    return zeroPage;
                };
                Cpu.prototype.addrZeroPageY = function () {
                    var zeroPage = (this.addrPop() + this.rY) & globalConstants_1.Constants.Memory.ByteMask;
                    return zeroPage;
                };
                Cpu.prototype.getOperation = function (value) {
                    return this.operationMap[value & globalConstants_1.Constants.Memory.ByteMask];
                };
                Cpu = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject(consoleService_1.ConsoleService)),
                    __param(1, core_1.Inject(displayService_1.DisplayService)), 
                    __metadata('design:paramtypes', [Object, Object])
                ], Cpu);
                return Cpu;
            }());
            exports_1("Cpu", Cpu);
        }
    }
});
//# sourceMappingURL=cpu.js.map