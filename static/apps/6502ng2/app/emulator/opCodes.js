System.register(['./baseOpCode', './opsCodes', '../globalConstants'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var baseOpCode_1, opsCodes_1, globalConstants_1;
    var registeredOperations, InvalidOp, AddWithCarryImmediate, AddWithCarryZeroPage, AddWithCarryZeroPageX, AddWithCarryAbsolute, AddWithCarryAbsoluteX, AddWithCarryAbsoluteY, AddWithCarryIndexedIndirectX, AddWithCarryIndirectIndexedY, AndImmediate, AndZeroPage, AndZeroPageX, AndAbsolute, AndAbsoluteX, AndAbsoluteY, AndIndirectX, AndIndirectY, BitAbsolute, BitZeroPage, BranchNotEqualRelative, BranchEqualRelative, BranchMinusRelative, BranchPlusRelative, BranchOverflowClearRelative, BranchOverflowSetRelative, BranchCarryClearRelative, BranchCarrySetRelative, CompareAccumulatorImmediate, CompareAccumulatorZeroPage, CompareAccumulatorZeroPageX, CompareAccumulatorAbsolute, CompareAccumulatorAbsoluteX, CompareAccumulatorAbsoluteY, CompareAccumulatorIndexedIndirectX, CompareAccumulatorIndirectIndexedY, CompareXImmediate, CompareXZeroPage, CompareXAbsolute, CompareYImmediate, CompareYZeroPage, CompareYAbsolute, DecXSingle, DecYSingle, ExclusiveOrImmediate, ExclusiveOrZeroPage, ExclusiveOrZeroPageX, ExclusiveOrAbsolute, ExclusiveOrAbsoluteX, ExclusiveOrAbsoluteY, ExclusiveOrIndirectX, ExclusiveOrIndirectY, ClearCarrySingle, SetCarrySingle, ClearOverflowSingle, ClearDecimalSingle, SetDecimalSingle, IncAbsolute, IncAbsoluteX, IncZeroPage, IncZeroPageX, IncYSingle, IncrementXSingle, JmpIndirect, JmpAbsolute, JmpSubroutineAbsolute, LoadAccumulatorImmediate, LoadAccumulatorAbsolute, LoadAccumulatorAbsoluteX, LoadAccumulatorZeroPage, LoadAccumulatorIndexedIndirectY, LoadYRegisterAbsolute, LoadYRegisterImmediate, LoadYRegisterZeroPage, LoadXRegisterImmediate, LoadXRegisterZeroPage, NoOperationSingle, OrImmediate, OrZeroPage, OrZeroPageX, OrAbsolute, OrAbsoluteX, OrAbsoluteY, OrIndirectX, OrIndirectY, RtsSingle, PullProcessorStatusSingle, PushProcessorStatusSingle, PullAccumulatorSingle, PushAccumulatorSingle, TransferXRegisterToStackPointerSingle, TransferStackPointerToXRegisterSingle, StoreAccumulatorAbsolute, StoreAccumulatorAbsoluteX, StoreAccumulatorAbsoluteY, StoreAccumulatorIndirectY, StoreAccumulatorIndirectX, StoreAccumulatorZeroPage, StoreYRegisterAbsolute, SubtractWithCarryImmediate, SubtractWithCarryZeroPage, SubtractWithCarryZeroPageX, SubtractWithCarryAbsolute, SubtractWithCarryAbsoluteX, SubtractWithCarryAbsoluteY, SubtractWithCarryIndexedIndirectX, SubtractWithCarryIndirectIndexedY, TransferAccumulatorToXSingle, TransferAccumulatorToYSingle, TransferXToAccumulatorSingle, TransferYToAccumulatorSingle;
    function IsOpCode(target) {
        registeredOperations.push(new target());
    }
    return {
        setters:[
            function (baseOpCode_1_1) {
                baseOpCode_1 = baseOpCode_1_1;
            },
            function (opsCodes_1_1) {
                opsCodes_1 = opsCodes_1_1;
            },
            function (globalConstants_1_1) {
                globalConstants_1 = globalConstants_1_1;
            }],
        execute: function() {
            exports_1("registeredOperations", registeredOperations = []);
            /* ==================
               === Invalid OP ===
               ================== */
            InvalidOp = (function (_super) {
                __extends(InvalidOp, _super);
                function InvalidOp(value) {
                    _super.call(this, "???", 0x01, opsCodes_1.OpCodes.ModeSingle, value & globalConstants_1.Constants.Memory.ByteMask);
                }
                InvalidOp.prototype.execute = function (cpu) {
                    var prev = cpu.rPC - 1;
                    var opCode = cpu.peek(prev);
                    throw "Invalid op code 0x" + opCode.toString(16).toUpperCase() +
                        " encountered at $" + prev.toString(16).toUpperCase();
                };
                return InvalidOp;
            }(baseOpCode_1.BaseOpCode));
            exports_1("InvalidOp", InvalidOp);
            /* ===========
                === ADC ===
                =========== */
            AddWithCarryImmediate = (function (_super) {
                __extends(AddWithCarryImmediate, _super);
                function AddWithCarryImmediate() {
                    _super.call(this, "ADC", 0x02, opsCodes_1.OpCodes.ModeImmediate, 0x69);
                }
                AddWithCarryImmediate.prototype.execute = function (cpu) {
                    opsCodes_1.OpCodes.AddWithCarry(cpu, cpu.addrPop());
                };
                AddWithCarryImmediate = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AddWithCarryImmediate);
                return AddWithCarryImmediate;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AddWithCarryImmediate", AddWithCarryImmediate);
            AddWithCarryZeroPage = (function (_super) {
                __extends(AddWithCarryZeroPage, _super);
                function AddWithCarryZeroPage() {
                    _super.call(this, "ADC", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0x65);
                }
                AddWithCarryZeroPage.prototype.execute = function (cpu) {
                    var zeroPage = cpu.addrPop();
                    opsCodes_1.OpCodes.AddWithCarry(cpu, cpu.peek(zeroPage));
                };
                AddWithCarryZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AddWithCarryZeroPage);
                return AddWithCarryZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AddWithCarryZeroPage", AddWithCarryZeroPage);
            AddWithCarryZeroPageX = (function (_super) {
                __extends(AddWithCarryZeroPageX, _super);
                function AddWithCarryZeroPageX() {
                    _super.call(this, "ADC", 0x02, opsCodes_1.OpCodes.ModeZeroPageX, 0x75);
                }
                AddWithCarryZeroPageX.prototype.execute = function (cpu) {
                    opsCodes_1.OpCodes.AddWithCarry(cpu, cpu.peek(cpu.addrZeroPageX()));
                };
                AddWithCarryZeroPageX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AddWithCarryZeroPageX);
                return AddWithCarryZeroPageX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AddWithCarryZeroPageX", AddWithCarryZeroPageX);
            AddWithCarryAbsolute = (function (_super) {
                __extends(AddWithCarryAbsolute, _super);
                function AddWithCarryAbsolute() {
                    _super.call(this, "ADC", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0x6D);
                }
                AddWithCarryAbsolute.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrPopWord());
                    opsCodes_1.OpCodes.AddWithCarry(cpu, targetValue);
                };
                AddWithCarryAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AddWithCarryAbsolute);
                return AddWithCarryAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AddWithCarryAbsolute", AddWithCarryAbsolute);
            AddWithCarryAbsoluteX = (function (_super) {
                __extends(AddWithCarryAbsoluteX, _super);
                function AddWithCarryAbsoluteX() {
                    _super.call(this, "ADC", 0x03, opsCodes_1.OpCodes.ModeAbsoluteX, 0x7D);
                }
                AddWithCarryAbsoluteX.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrAbsoluteX());
                    opsCodes_1.OpCodes.AddWithCarry(cpu, targetValue);
                };
                AddWithCarryAbsoluteX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AddWithCarryAbsoluteX);
                return AddWithCarryAbsoluteX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AddWithCarryAbsoluteX", AddWithCarryAbsoluteX);
            AddWithCarryAbsoluteY = (function (_super) {
                __extends(AddWithCarryAbsoluteY, _super);
                function AddWithCarryAbsoluteY() {
                    _super.call(this, "ADC", 0x03, opsCodes_1.OpCodes.ModeAbsoluteY, 0x79);
                }
                AddWithCarryAbsoluteY.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrAbsoluteY());
                    opsCodes_1.OpCodes.AddWithCarry(cpu, targetValue);
                };
                AddWithCarryAbsoluteY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AddWithCarryAbsoluteY);
                return AddWithCarryAbsoluteY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AddWithCarryAbsoluteY", AddWithCarryAbsoluteY);
            AddWithCarryIndexedIndirectX = (function (_super) {
                __extends(AddWithCarryIndexedIndirectX, _super);
                function AddWithCarryIndexedIndirectX() {
                    _super.call(this, "ADC", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectX, 0x61);
                }
                AddWithCarryIndexedIndirectX.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrIndexedIndirectX());
                    opsCodes_1.OpCodes.AddWithCarry(cpu, targetValue);
                };
                AddWithCarryIndexedIndirectX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AddWithCarryIndexedIndirectX);
                return AddWithCarryIndexedIndirectX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AddWithCarryIndexedIndirectX", AddWithCarryIndexedIndirectX);
            AddWithCarryIndirectIndexedY = (function (_super) {
                __extends(AddWithCarryIndirectIndexedY, _super);
                function AddWithCarryIndirectIndexedY() {
                    _super.call(this, "ADC", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectY, 0x71);
                }
                AddWithCarryIndirectIndexedY.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrIndirectIndexedY());
                    opsCodes_1.OpCodes.AddWithCarry(cpu, targetValue);
                };
                AddWithCarryIndirectIndexedY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AddWithCarryIndirectIndexedY);
                return AddWithCarryIndirectIndexedY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AddWithCarryIndirectIndexedY", AddWithCarryIndirectIndexedY);
            /* ===========
                === AND ===
                =========== */
            AndImmediate = (function (_super) {
                __extends(AndImmediate, _super);
                function AndImmediate() {
                    _super.call(this, "AND", 0x02, opsCodes_1.OpCodes.ModeImmediate, 0x29);
                }
                AndImmediate.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA & cpu.addrPop();
                    cpu.setFlags(cpu.rA);
                };
                AndImmediate = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AndImmediate);
                return AndImmediate;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AndImmediate", AndImmediate);
            AndZeroPage = (function (_super) {
                __extends(AndZeroPage, _super);
                function AndZeroPage() {
                    _super.call(this, "AND", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0x25);
                }
                AndZeroPage.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA & cpu.peek(cpu.addrPop());
                    cpu.setFlags(cpu.rA);
                };
                AndZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AndZeroPage);
                return AndZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AndZeroPage", AndZeroPage);
            AndZeroPageX = (function (_super) {
                __extends(AndZeroPageX, _super);
                function AndZeroPageX() {
                    _super.call(this, "AND", 0x02, opsCodes_1.OpCodes.ModeZeroPageX, 0x35);
                }
                AndZeroPageX.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA & cpu.peek(cpu.addrZeroPageX());
                    cpu.setFlags(cpu.rA);
                };
                AndZeroPageX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AndZeroPageX);
                return AndZeroPageX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AndZeroPageX", AndZeroPageX);
            AndAbsolute = (function (_super) {
                __extends(AndAbsolute, _super);
                function AndAbsolute() {
                    _super.call(this, "AND", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0x2D);
                }
                AndAbsolute.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA & cpu.peek(cpu.addrPopWord());
                    cpu.setFlags(cpu.rA);
                };
                AndAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AndAbsolute);
                return AndAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AndAbsolute", AndAbsolute);
            AndAbsoluteX = (function (_super) {
                __extends(AndAbsoluteX, _super);
                function AndAbsoluteX() {
                    _super.call(this, "AND", 0x03, opsCodes_1.OpCodes.ModeAbsoluteX, 0x3D);
                }
                AndAbsoluteX.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA & cpu.peek(cpu.addrAbsoluteX());
                    cpu.setFlags(cpu.rA);
                };
                AndAbsoluteX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AndAbsoluteX);
                return AndAbsoluteX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AndAbsoluteX", AndAbsoluteX);
            AndAbsoluteY = (function (_super) {
                __extends(AndAbsoluteY, _super);
                function AndAbsoluteY() {
                    _super.call(this, "AND", 0x03, opsCodes_1.OpCodes.ModeAbsoluteY, 0x39);
                }
                AndAbsoluteY.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA & cpu.peek(cpu.addrAbsoluteY());
                    cpu.setFlags(cpu.rA);
                };
                AndAbsoluteY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AndAbsoluteY);
                return AndAbsoluteY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AndAbsoluteY", AndAbsoluteY);
            AndIndirectX = (function (_super) {
                __extends(AndIndirectX, _super);
                function AndIndirectX() {
                    _super.call(this, "AND", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectX, 0x21);
                }
                AndIndirectX.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA & cpu.peek(cpu.addrIndexedIndirectX());
                    cpu.setFlags(cpu.rA);
                };
                AndIndirectX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AndIndirectX);
                return AndIndirectX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AndIndirectX", AndIndirectX);
            AndIndirectY = (function (_super) {
                __extends(AndIndirectY, _super);
                function AndIndirectY() {
                    _super.call(this, "AND", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectY, 0x31);
                }
                AndIndirectY.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA & cpu.peek(cpu.addrIndirectIndexedY());
                    cpu.setFlags(cpu.rA);
                };
                AndIndirectY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], AndIndirectY);
                return AndIndirectY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("AndIndirectY", AndIndirectY);
            /* ===========
                === BIT ===
                =========== */
            BitAbsolute = (function (_super) {
                __extends(BitAbsolute, _super);
                function BitAbsolute() {
                    _super.call(this, "BIT", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0x2C);
                }
                BitAbsolute.prototype.execute = function (cpu) {
                    var address = cpu.addrPopWord();
                    var value = cpu.peek(address);
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.ZeroFlagSet, (cpu.rA & value) === 0);
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet, !!(value & globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet));
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet, !!(value & globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet));
                };
                BitAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], BitAbsolute);
                return BitAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("BitAbsolute", BitAbsolute);
            BitZeroPage = (function (_super) {
                __extends(BitZeroPage, _super);
                function BitZeroPage() {
                    _super.call(this, "BIT", 0x02, opsCodes_1.OpCodes.ModeAbsolute, 0x24);
                }
                BitZeroPage.prototype.execute = function (cpu) {
                    var zeroPage = cpu.addrPop();
                    var value = cpu.peek(zeroPage);
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.ZeroFlagSet, (cpu.rA & value) === 0);
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet, (value & globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet) > 0);
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet, (value & globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet) > 0);
                };
                BitZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], BitZeroPage);
                return BitZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("BitZeroPage", BitZeroPage);
            /* ================
                === BRANCHES ===
                ================ */
            BranchNotEqualRelative = (function (_super) {
                __extends(BranchNotEqualRelative, _super);
                function BranchNotEqualRelative() {
                    _super.call(this, "BNE", 0x02, opsCodes_1.OpCodes.ModeRelative, 0xD0);
                }
                BranchNotEqualRelative.prototype.execute = function (cpu) {
                    var branch = cpu.addrPop();
                    if (!cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.ZeroFlagSet)) {
                        cpu.rPC = opsCodes_1.OpCodes.computeBranch(cpu.rPC, branch);
                    }
                };
                BranchNotEqualRelative = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], BranchNotEqualRelative);
                return BranchNotEqualRelative;
            }(baseOpCode_1.BaseOpCode));
            exports_1("BranchNotEqualRelative", BranchNotEqualRelative);
            BranchEqualRelative = (function (_super) {
                __extends(BranchEqualRelative, _super);
                function BranchEqualRelative() {
                    _super.call(this, "BEQ", 0x02, opsCodes_1.OpCodes.ModeRelative, 0xF0);
                }
                BranchEqualRelative.prototype.execute = function (cpu) {
                    var branch = cpu.addrPop();
                    if (cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.ZeroFlagSet)) {
                        cpu.rPC = opsCodes_1.OpCodes.computeBranch(cpu.rPC, branch);
                    }
                };
                BranchEqualRelative = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], BranchEqualRelative);
                return BranchEqualRelative;
            }(baseOpCode_1.BaseOpCode));
            exports_1("BranchEqualRelative", BranchEqualRelative);
            BranchMinusRelative = (function (_super) {
                __extends(BranchMinusRelative, _super);
                function BranchMinusRelative() {
                    _super.call(this, "BMI", 0x02, opsCodes_1.OpCodes.ModeRelative, 0x30);
                }
                BranchMinusRelative.prototype.execute = function (cpu) {
                    var branch = cpu.addrPop();
                    if (cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet)) {
                        cpu.rPC = opsCodes_1.OpCodes.computeBranch(cpu.rPC, branch);
                    }
                };
                BranchMinusRelative = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], BranchMinusRelative);
                return BranchMinusRelative;
            }(baseOpCode_1.BaseOpCode));
            exports_1("BranchMinusRelative", BranchMinusRelative);
            BranchPlusRelative = (function (_super) {
                __extends(BranchPlusRelative, _super);
                function BranchPlusRelative() {
                    _super.call(this, "BPL", 0x02, opsCodes_1.OpCodes.ModeRelative, 0x10);
                }
                BranchPlusRelative.prototype.execute = function (cpu) {
                    var branch = cpu.addrPop();
                    if (!cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet)) {
                        cpu.rPC = opsCodes_1.OpCodes.computeBranch(cpu.rPC, branch);
                    }
                };
                BranchPlusRelative = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], BranchPlusRelative);
                return BranchPlusRelative;
            }(baseOpCode_1.BaseOpCode));
            exports_1("BranchPlusRelative", BranchPlusRelative);
            BranchOverflowClearRelative = (function (_super) {
                __extends(BranchOverflowClearRelative, _super);
                function BranchOverflowClearRelative() {
                    _super.call(this, "BVC", 0x02, opsCodes_1.OpCodes.ModeRelative, 0x50);
                }
                BranchOverflowClearRelative.prototype.execute = function (cpu) {
                    var branch = cpu.addrPop();
                    if (!cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet)) {
                        cpu.rPC = opsCodes_1.OpCodes.computeBranch(cpu.rPC, branch);
                    }
                };
                BranchOverflowClearRelative = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], BranchOverflowClearRelative);
                return BranchOverflowClearRelative;
            }(baseOpCode_1.BaseOpCode));
            exports_1("BranchOverflowClearRelative", BranchOverflowClearRelative);
            BranchOverflowSetRelative = (function (_super) {
                __extends(BranchOverflowSetRelative, _super);
                function BranchOverflowSetRelative() {
                    _super.call(this, "BVS", 0x02, opsCodes_1.OpCodes.ModeRelative, 0x70);
                }
                BranchOverflowSetRelative.prototype.execute = function (cpu) {
                    var branch = cpu.addrPop();
                    if (cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet)) {
                        cpu.rPC = opsCodes_1.OpCodes.computeBranch(cpu.rPC, branch);
                    }
                };
                BranchOverflowSetRelative = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], BranchOverflowSetRelative);
                return BranchOverflowSetRelative;
            }(baseOpCode_1.BaseOpCode));
            exports_1("BranchOverflowSetRelative", BranchOverflowSetRelative);
            BranchCarryClearRelative = (function (_super) {
                __extends(BranchCarryClearRelative, _super);
                function BranchCarryClearRelative() {
                    _super.call(this, "BCC", 0x02, opsCodes_1.OpCodes.ModeRelative, 0x90);
                }
                BranchCarryClearRelative.prototype.execute = function (cpu) {
                    var branch = cpu.addrPop();
                    if (!cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.CarryFlagSet)) {
                        cpu.rPC = opsCodes_1.OpCodes.computeBranch(cpu.rPC, branch);
                    }
                };
                BranchCarryClearRelative = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], BranchCarryClearRelative);
                return BranchCarryClearRelative;
            }(baseOpCode_1.BaseOpCode));
            exports_1("BranchCarryClearRelative", BranchCarryClearRelative);
            BranchCarrySetRelative = (function (_super) {
                __extends(BranchCarrySetRelative, _super);
                function BranchCarrySetRelative() {
                    _super.call(this, "BCS", 0x02, opsCodes_1.OpCodes.ModeRelative, 0xB0);
                }
                BranchCarrySetRelative.prototype.execute = function (cpu) {
                    var branch = cpu.addrPop();
                    if (cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.CarryFlagSet)) {
                        cpu.rPC = opsCodes_1.OpCodes.computeBranch(cpu.rPC, branch);
                    }
                };
                BranchCarrySetRelative = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], BranchCarrySetRelative);
                return BranchCarrySetRelative;
            }(baseOpCode_1.BaseOpCode));
            exports_1("BranchCarrySetRelative", BranchCarrySetRelative);
            /* ===========
                === CMP ===
                =========== */
            CompareAccumulatorImmediate = (function (_super) {
                __extends(CompareAccumulatorImmediate, _super);
                function CompareAccumulatorImmediate() {
                    _super.call(this, "CMP", 0x02, opsCodes_1.OpCodes.ModeImmediate, 0xC9);
                }
                CompareAccumulatorImmediate.prototype.execute = function (cpu) {
                    cpu.compareWithFlags(cpu.rA, cpu.addrPop());
                };
                CompareAccumulatorImmediate = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareAccumulatorImmediate);
                return CompareAccumulatorImmediate;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareAccumulatorImmediate", CompareAccumulatorImmediate);
            CompareAccumulatorZeroPage = (function (_super) {
                __extends(CompareAccumulatorZeroPage, _super);
                function CompareAccumulatorZeroPage() {
                    _super.call(this, "CMP", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0xC5);
                }
                CompareAccumulatorZeroPage.prototype.execute = function (cpu) {
                    var zeroPage = cpu.addrPop();
                    cpu.compareWithFlags(cpu.rA, cpu.peek(zeroPage));
                };
                CompareAccumulatorZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareAccumulatorZeroPage);
                return CompareAccumulatorZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareAccumulatorZeroPage", CompareAccumulatorZeroPage);
            CompareAccumulatorZeroPageX = (function (_super) {
                __extends(CompareAccumulatorZeroPageX, _super);
                function CompareAccumulatorZeroPageX() {
                    _super.call(this, "CMP", 0x02, opsCodes_1.OpCodes.ModeZeroPageX, 0xD5);
                }
                CompareAccumulatorZeroPageX.prototype.execute = function (cpu) {
                    cpu.compareWithFlags(cpu.rA, cpu.peek(cpu.addrZeroPageX()));
                };
                CompareAccumulatorZeroPageX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareAccumulatorZeroPageX);
                return CompareAccumulatorZeroPageX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareAccumulatorZeroPageX", CompareAccumulatorZeroPageX);
            CompareAccumulatorAbsolute = (function (_super) {
                __extends(CompareAccumulatorAbsolute, _super);
                function CompareAccumulatorAbsolute() {
                    _super.call(this, "CMP", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0xCD);
                }
                CompareAccumulatorAbsolute.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrPopWord());
                    cpu.compareWithFlags(cpu.rA, targetValue);
                };
                CompareAccumulatorAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareAccumulatorAbsolute);
                return CompareAccumulatorAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareAccumulatorAbsolute", CompareAccumulatorAbsolute);
            CompareAccumulatorAbsoluteX = (function (_super) {
                __extends(CompareAccumulatorAbsoluteX, _super);
                function CompareAccumulatorAbsoluteX() {
                    _super.call(this, "CMP", 0x03, opsCodes_1.OpCodes.ModeAbsoluteX, 0xDD);
                }
                CompareAccumulatorAbsoluteX.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrAbsoluteX());
                    cpu.compareWithFlags(cpu.rA, targetValue);
                };
                CompareAccumulatorAbsoluteX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareAccumulatorAbsoluteX);
                return CompareAccumulatorAbsoluteX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareAccumulatorAbsoluteX", CompareAccumulatorAbsoluteX);
            CompareAccumulatorAbsoluteY = (function (_super) {
                __extends(CompareAccumulatorAbsoluteY, _super);
                function CompareAccumulatorAbsoluteY() {
                    _super.call(this, "CMP", 0x03, opsCodes_1.OpCodes.ModeAbsoluteY, 0xD9);
                }
                CompareAccumulatorAbsoluteY.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrAbsoluteY());
                    cpu.compareWithFlags(cpu.rA, targetValue);
                };
                CompareAccumulatorAbsoluteY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareAccumulatorAbsoluteY);
                return CompareAccumulatorAbsoluteY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareAccumulatorAbsoluteY", CompareAccumulatorAbsoluteY);
            CompareAccumulatorIndexedIndirectX = (function (_super) {
                __extends(CompareAccumulatorIndexedIndirectX, _super);
                function CompareAccumulatorIndexedIndirectX() {
                    _super.call(this, "CMP", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectX, 0xC1);
                }
                CompareAccumulatorIndexedIndirectX.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrIndexedIndirectX());
                    cpu.compareWithFlags(cpu.rA, targetValue);
                };
                CompareAccumulatorIndexedIndirectX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareAccumulatorIndexedIndirectX);
                return CompareAccumulatorIndexedIndirectX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareAccumulatorIndexedIndirectX", CompareAccumulatorIndexedIndirectX);
            CompareAccumulatorIndirectIndexedY = (function (_super) {
                __extends(CompareAccumulatorIndirectIndexedY, _super);
                function CompareAccumulatorIndirectIndexedY() {
                    _super.call(this, "CMP", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectY, 0xD1);
                }
                CompareAccumulatorIndirectIndexedY.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrIndirectIndexedY());
                    cpu.compareWithFlags(cpu.rA, targetValue);
                };
                CompareAccumulatorIndirectIndexedY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareAccumulatorIndirectIndexedY);
                return CompareAccumulatorIndirectIndexedY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareAccumulatorIndirectIndexedY", CompareAccumulatorIndirectIndexedY);
            /* ===========
                === CPX ===
                =========== */
            CompareXImmediate = (function (_super) {
                __extends(CompareXImmediate, _super);
                function CompareXImmediate() {
                    _super.call(this, "CPX", 0x02, opsCodes_1.OpCodes.ModeImmediate, 0xE0);
                }
                CompareXImmediate.prototype.execute = function (cpu) {
                    cpu.compareWithFlags(cpu.rX, cpu.addrPop());
                };
                CompareXImmediate = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareXImmediate);
                return CompareXImmediate;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareXImmediate", CompareXImmediate);
            CompareXZeroPage = (function (_super) {
                __extends(CompareXZeroPage, _super);
                function CompareXZeroPage() {
                    _super.call(this, "CPX", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0xE4);
                }
                CompareXZeroPage.prototype.execute = function (cpu) {
                    var zeroPage = cpu.addrPop();
                    cpu.compareWithFlags(cpu.rX, cpu.peek(zeroPage));
                };
                CompareXZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareXZeroPage);
                return CompareXZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareXZeroPage", CompareXZeroPage);
            CompareXAbsolute = (function (_super) {
                __extends(CompareXAbsolute, _super);
                function CompareXAbsolute() {
                    _super.call(this, "CPX", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0xEC);
                }
                CompareXAbsolute.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrPopWord());
                    cpu.compareWithFlags(cpu.rX, targetValue);
                };
                CompareXAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareXAbsolute);
                return CompareXAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareXAbsolute", CompareXAbsolute);
            /* ===========
                === CPY ===
                =========== */
            CompareYImmediate = (function (_super) {
                __extends(CompareYImmediate, _super);
                function CompareYImmediate() {
                    _super.call(this, "CPY", 0x02, opsCodes_1.OpCodes.ModeImmediate, 0xC0);
                }
                CompareYImmediate.prototype.execute = function (cpu) {
                    cpu.compareWithFlags(cpu.rY, cpu.addrPop());
                };
                CompareYImmediate = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareYImmediate);
                return CompareYImmediate;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareYImmediate", CompareYImmediate);
            CompareYZeroPage = (function (_super) {
                __extends(CompareYZeroPage, _super);
                function CompareYZeroPage() {
                    _super.call(this, "CPY", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0xC4);
                }
                CompareYZeroPage.prototype.execute = function (cpu) {
                    var zeroPage = cpu.addrPop();
                    cpu.compareWithFlags(cpu.rY, cpu.peek(zeroPage));
                };
                CompareYZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareYZeroPage);
                return CompareYZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareYZeroPage", CompareYZeroPage);
            CompareYAbsolute = (function (_super) {
                __extends(CompareYAbsolute, _super);
                function CompareYAbsolute() {
                    _super.call(this, "CPY", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0xCC);
                }
                CompareYAbsolute.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrPopWord());
                    cpu.compareWithFlags(cpu.rY, targetValue);
                };
                CompareYAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], CompareYAbsolute);
                return CompareYAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("CompareYAbsolute", CompareYAbsolute);
            DecXSingle = (function (_super) {
                __extends(DecXSingle, _super);
                function DecXSingle() {
                    _super.call(this, "DEX", 0x01, opsCodes_1.OpCodes.ModeSingle, 0xCA);
                }
                DecXSingle.prototype.execute = function (cpu) {
                    cpu.rX -= 1;
                    if (cpu.rX < 0) {
                        cpu.rX = globalConstants_1.Constants.Memory.ByteMask;
                    }
                    cpu.setFlags(cpu.rX);
                };
                DecXSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], DecXSingle);
                return DecXSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("DecXSingle", DecXSingle);
            DecYSingle = (function (_super) {
                __extends(DecYSingle, _super);
                function DecYSingle() {
                    _super.call(this, "DEY", 0x01, opsCodes_1.OpCodes.ModeSingle, 0x88);
                }
                DecYSingle.prototype.execute = function (cpu) {
                    cpu.rY -= 1;
                    if (cpu.rY < 0) {
                        cpu.rY = globalConstants_1.Constants.Memory.ByteMask;
                    }
                    cpu.setFlags(cpu.rY);
                };
                DecYSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], DecYSingle);
                return DecYSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("DecYSingle", DecYSingle);
            /* ===========
                === EOR ===
                =========== */
            ExclusiveOrImmediate = (function (_super) {
                __extends(ExclusiveOrImmediate, _super);
                function ExclusiveOrImmediate() {
                    _super.call(this, "EOR", 0x02, opsCodes_1.OpCodes.ModeImmediate, 0x49);
                }
                ExclusiveOrImmediate.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA ^ cpu.addrPop();
                    cpu.setFlags(cpu.rA);
                };
                ExclusiveOrImmediate = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], ExclusiveOrImmediate);
                return ExclusiveOrImmediate;
            }(baseOpCode_1.BaseOpCode));
            exports_1("ExclusiveOrImmediate", ExclusiveOrImmediate);
            ExclusiveOrZeroPage = (function (_super) {
                __extends(ExclusiveOrZeroPage, _super);
                function ExclusiveOrZeroPage() {
                    _super.call(this, "EOR", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0x45);
                }
                ExclusiveOrZeroPage.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA ^ cpu.peek(cpu.addrPop());
                    cpu.setFlags(cpu.rA);
                };
                ExclusiveOrZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], ExclusiveOrZeroPage);
                return ExclusiveOrZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("ExclusiveOrZeroPage", ExclusiveOrZeroPage);
            ExclusiveOrZeroPageX = (function (_super) {
                __extends(ExclusiveOrZeroPageX, _super);
                function ExclusiveOrZeroPageX() {
                    _super.call(this, "EOR", 0x02, opsCodes_1.OpCodes.ModeZeroPageX, 0x55);
                }
                ExclusiveOrZeroPageX.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA ^ cpu.peek(cpu.addrZeroPageX());
                    cpu.setFlags(cpu.rA);
                };
                ExclusiveOrZeroPageX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], ExclusiveOrZeroPageX);
                return ExclusiveOrZeroPageX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("ExclusiveOrZeroPageX", ExclusiveOrZeroPageX);
            ExclusiveOrAbsolute = (function (_super) {
                __extends(ExclusiveOrAbsolute, _super);
                function ExclusiveOrAbsolute() {
                    _super.call(this, "EOR", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0x4D);
                }
                ExclusiveOrAbsolute.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA ^ cpu.peek(cpu.addrPopWord());
                    cpu.setFlags(cpu.rA);
                };
                ExclusiveOrAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], ExclusiveOrAbsolute);
                return ExclusiveOrAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("ExclusiveOrAbsolute", ExclusiveOrAbsolute);
            ExclusiveOrAbsoluteX = (function (_super) {
                __extends(ExclusiveOrAbsoluteX, _super);
                function ExclusiveOrAbsoluteX() {
                    _super.call(this, "EOR", 0x03, opsCodes_1.OpCodes.ModeAbsoluteX, 0x5D);
                }
                ExclusiveOrAbsoluteX.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA ^ cpu.peek(cpu.addrAbsoluteX());
                    cpu.setFlags(cpu.rA);
                };
                ExclusiveOrAbsoluteX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], ExclusiveOrAbsoluteX);
                return ExclusiveOrAbsoluteX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("ExclusiveOrAbsoluteX", ExclusiveOrAbsoluteX);
            ExclusiveOrAbsoluteY = (function (_super) {
                __extends(ExclusiveOrAbsoluteY, _super);
                function ExclusiveOrAbsoluteY() {
                    _super.call(this, "EOR", 0x03, opsCodes_1.OpCodes.ModeAbsoluteY, 0x59);
                }
                ExclusiveOrAbsoluteY.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA ^ cpu.peek(cpu.addrAbsoluteY());
                    cpu.setFlags(cpu.rA);
                };
                ExclusiveOrAbsoluteY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], ExclusiveOrAbsoluteY);
                return ExclusiveOrAbsoluteY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("ExclusiveOrAbsoluteY", ExclusiveOrAbsoluteY);
            ExclusiveOrIndirectX = (function (_super) {
                __extends(ExclusiveOrIndirectX, _super);
                function ExclusiveOrIndirectX() {
                    _super.call(this, "EOR", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectX, 0x41);
                }
                ExclusiveOrIndirectX.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA ^ cpu.peek(cpu.addrIndexedIndirectX());
                    cpu.setFlags(cpu.rA);
                };
                ExclusiveOrIndirectX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], ExclusiveOrIndirectX);
                return ExclusiveOrIndirectX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("ExclusiveOrIndirectX", ExclusiveOrIndirectX);
            ExclusiveOrIndirectY = (function (_super) {
                __extends(ExclusiveOrIndirectY, _super);
                function ExclusiveOrIndirectY() {
                    _super.call(this, "EOR", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectY, 0x51);
                }
                ExclusiveOrIndirectY.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA ^ cpu.peek(cpu.addrIndirectIndexedY());
                    cpu.setFlags(cpu.rA);
                };
                ExclusiveOrIndirectY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], ExclusiveOrIndirectY);
                return ExclusiveOrIndirectY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("ExclusiveOrIndirectY", ExclusiveOrIndirectY);
            /* =======================
                === Flag Operations ===
                ======================= */
            ClearCarrySingle = (function (_super) {
                __extends(ClearCarrySingle, _super);
                function ClearCarrySingle() {
                    _super.call(this, "CLC", 0x01, opsCodes_1.OpCodes.ModeSingle, 0x18);
                }
                ClearCarrySingle.prototype.execute = function (cpu) {
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.CarryFlagSet, false);
                };
                ClearCarrySingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], ClearCarrySingle);
                return ClearCarrySingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("ClearCarrySingle", ClearCarrySingle);
            SetCarrySingle = (function (_super) {
                __extends(SetCarrySingle, _super);
                function SetCarrySingle() {
                    _super.call(this, "SEC", 0x01, opsCodes_1.OpCodes.ModeSingle, 0x38);
                }
                SetCarrySingle.prototype.execute = function (cpu) {
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.CarryFlagSet, true);
                };
                SetCarrySingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], SetCarrySingle);
                return SetCarrySingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("SetCarrySingle", SetCarrySingle);
            ClearOverflowSingle = (function (_super) {
                __extends(ClearOverflowSingle, _super);
                function ClearOverflowSingle() {
                    _super.call(this, "CLV", 0x01, opsCodes_1.OpCodes.ModeSingle, 0xB8);
                }
                ClearOverflowSingle.prototype.execute = function (cpu) {
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet, false);
                };
                ClearOverflowSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], ClearOverflowSingle);
                return ClearOverflowSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("ClearOverflowSingle", ClearOverflowSingle);
            ClearDecimalSingle = (function (_super) {
                __extends(ClearDecimalSingle, _super);
                function ClearDecimalSingle() {
                    _super.call(this, "CLD", 0x01, opsCodes_1.OpCodes.ModeSingle, 0xD8);
                }
                ClearDecimalSingle.prototype.execute = function (cpu) {
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.DecimalFlagSet, false);
                };
                ClearDecimalSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], ClearDecimalSingle);
                return ClearDecimalSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("ClearDecimalSingle", ClearDecimalSingle);
            SetDecimalSingle = (function (_super) {
                __extends(SetDecimalSingle, _super);
                function SetDecimalSingle() {
                    _super.call(this, "SED", 0x01, opsCodes_1.OpCodes.ModeSingle, 0xF8);
                }
                SetDecimalSingle.prototype.execute = function (cpu) {
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.DecimalFlagSet, true);
                };
                SetDecimalSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], SetDecimalSingle);
                return SetDecimalSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("SetDecimalSingle", SetDecimalSingle);
            /* =================
                === INC (X,Y) ===
                ================= */
            IncAbsolute = (function (_super) {
                __extends(IncAbsolute, _super);
                function IncAbsolute() {
                    _super.call(this, "INC", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0xEE);
                }
                IncAbsolute.prototype.execute = function (cpu) {
                    var target = cpu.addrPopWord();
                    var value = cpu.peek(target);
                    value = (value + 1) & globalConstants_1.Constants.Memory.ByteMask;
                    cpu.poke(target, value);
                    cpu.setFlags(value);
                };
                IncAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], IncAbsolute);
                return IncAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("IncAbsolute", IncAbsolute);
            IncAbsoluteX = (function (_super) {
                __extends(IncAbsoluteX, _super);
                function IncAbsoluteX() {
                    _super.call(this, "INC", 0x03, opsCodes_1.OpCodes.ModeAbsoluteX, 0xFE);
                }
                IncAbsoluteX.prototype.execute = function (cpu) {
                    var target = cpu.addrAbsoluteX();
                    var value = cpu.peek(target);
                    value = (value + 1) & globalConstants_1.Constants.Memory.ByteMask;
                    cpu.poke(target, value);
                    cpu.setFlags(value);
                };
                IncAbsoluteX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], IncAbsoluteX);
                return IncAbsoluteX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("IncAbsoluteX", IncAbsoluteX);
            IncZeroPage = (function (_super) {
                __extends(IncZeroPage, _super);
                function IncZeroPage() {
                    _super.call(this, "INC", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0xE6);
                }
                IncZeroPage.prototype.execute = function (cpu) {
                    var target = cpu.addrPop();
                    var value = cpu.peek(target);
                    value = (value + 1) & globalConstants_1.Constants.Memory.ByteMask;
                    cpu.poke(target, value);
                    cpu.setFlags(value);
                };
                IncZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], IncZeroPage);
                return IncZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("IncZeroPage", IncZeroPage);
            IncZeroPageX = (function (_super) {
                __extends(IncZeroPageX, _super);
                function IncZeroPageX() {
                    _super.call(this, "INC", 0x02, opsCodes_1.OpCodes.ModeZeroPageX, 0xF6);
                }
                IncZeroPageX.prototype.execute = function (cpu) {
                    var target = cpu.addrZeroPageX();
                    var value = cpu.peek(target);
                    value = (value + 1) & globalConstants_1.Constants.Memory.ByteMask;
                    cpu.poke(target, value);
                    cpu.setFlags(value);
                };
                IncZeroPageX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], IncZeroPageX);
                return IncZeroPageX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("IncZeroPageX", IncZeroPageX);
            IncYSingle = (function (_super) {
                __extends(IncYSingle, _super);
                function IncYSingle() {
                    _super.call(this, "INY", 0x01, opsCodes_1.OpCodes.ModeSingle, 0xC8);
                }
                IncYSingle.prototype.execute = function (cpu) {
                    cpu.rY = ((cpu.rY) + 1) & globalConstants_1.Constants.Memory.ByteMask;
                    cpu.setFlags(cpu.rY);
                };
                IncYSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], IncYSingle);
                return IncYSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("IncYSingle", IncYSingle);
            IncrementXSingle = (function (_super) {
                __extends(IncrementXSingle, _super);
                function IncrementXSingle() {
                    _super.call(this, "INX", 0x01, opsCodes_1.OpCodes.ModeSingle, 0xE8);
                }
                IncrementXSingle.prototype.execute = function (cpu) {
                    cpu.rX = (cpu.rX + 1) & globalConstants_1.Constants.Memory.ByteMask;
                    cpu.setFlags(cpu.rX);
                };
                IncrementXSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], IncrementXSingle);
                return IncrementXSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("IncrementXSingle", IncrementXSingle);
            /* ===========
                === JMP ===
                =========== */
            JmpIndirect = (function (_super) {
                __extends(JmpIndirect, _super);
                function JmpIndirect() {
                    _super.call(this, "JMP", 0x03, opsCodes_1.OpCodes.ModeIndirect, 0x6C);
                }
                JmpIndirect.prototype.execute = function (cpu) {
                    cpu.rPC = cpu.addrIndirect();
                };
                JmpIndirect = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], JmpIndirect);
                return JmpIndirect;
            }(baseOpCode_1.BaseOpCode));
            exports_1("JmpIndirect", JmpIndirect);
            JmpAbsolute = (function (_super) {
                __extends(JmpAbsolute, _super);
                function JmpAbsolute() {
                    _super.call(this, "JMP", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0x4C);
                }
                JmpAbsolute.prototype.execute = function (cpu) {
                    var newAddress = cpu.addrPopWord();
                    cpu.rPC = newAddress;
                };
                JmpAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], JmpAbsolute);
                return JmpAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("JmpAbsolute", JmpAbsolute);
            JmpSubroutineAbsolute = (function (_super) {
                __extends(JmpSubroutineAbsolute, _super);
                function JmpSubroutineAbsolute() {
                    _super.call(this, "JSR", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0x20);
                }
                JmpSubroutineAbsolute.prototype.execute = function (cpu) {
                    var newAddress = cpu.addrPopWord();
                    cpu.stackPush(((cpu.rPC - 1) >> globalConstants_1.Constants.Memory.BitsInByte) & globalConstants_1.Constants.Memory.ByteMask);
                    cpu.stackPush((cpu.rPC - 1) & (globalConstants_1.Constants.Memory.ByteMask));
                    cpu.rPC = newAddress;
                };
                JmpSubroutineAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], JmpSubroutineAbsolute);
                return JmpSubroutineAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("JmpSubroutineAbsolute", JmpSubroutineAbsolute);
            LoadAccumulatorImmediate = (function (_super) {
                __extends(LoadAccumulatorImmediate, _super);
                function LoadAccumulatorImmediate() {
                    _super.call(this, "LDA", 0x02, opsCodes_1.OpCodes.ModeImmediate, 0xA9);
                }
                LoadAccumulatorImmediate.prototype.execute = function (cpu) {
                    cpu.rA = cpu.addrPop();
                    cpu.setFlags(cpu.rA);
                };
                LoadAccumulatorImmediate = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], LoadAccumulatorImmediate);
                return LoadAccumulatorImmediate;
            }(baseOpCode_1.BaseOpCode));
            exports_1("LoadAccumulatorImmediate", LoadAccumulatorImmediate);
            LoadAccumulatorAbsolute = (function (_super) {
                __extends(LoadAccumulatorAbsolute, _super);
                function LoadAccumulatorAbsolute() {
                    _super.call(this, "LDA", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0xAD);
                }
                LoadAccumulatorAbsolute.prototype.execute = function (cpu) {
                    var memory = cpu.addrPopWord();
                    cpu.rA = cpu.peek(memory);
                    cpu.setFlags(cpu.rA);
                };
                LoadAccumulatorAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], LoadAccumulatorAbsolute);
                return LoadAccumulatorAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("LoadAccumulatorAbsolute", LoadAccumulatorAbsolute);
            LoadAccumulatorAbsoluteX = (function (_super) {
                __extends(LoadAccumulatorAbsoluteX, _super);
                function LoadAccumulatorAbsoluteX() {
                    _super.call(this, "LDA", 0x03, opsCodes_1.OpCodes.ModeAbsoluteX, 0xBD);
                }
                LoadAccumulatorAbsoluteX.prototype.execute = function (cpu) {
                    cpu.rA = cpu.peek(cpu.addrAbsoluteX());
                    cpu.setFlags(cpu.rA);
                };
                LoadAccumulatorAbsoluteX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], LoadAccumulatorAbsoluteX);
                return LoadAccumulatorAbsoluteX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("LoadAccumulatorAbsoluteX", LoadAccumulatorAbsoluteX);
            LoadAccumulatorZeroPage = (function (_super) {
                __extends(LoadAccumulatorZeroPage, _super);
                function LoadAccumulatorZeroPage() {
                    _super.call(this, "LDA", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0xA5);
                }
                LoadAccumulatorZeroPage.prototype.execute = function (cpu) {
                    cpu.rA = cpu.peek(cpu.addrPop());
                    cpu.setFlags(cpu.rA);
                };
                LoadAccumulatorZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], LoadAccumulatorZeroPage);
                return LoadAccumulatorZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("LoadAccumulatorZeroPage", LoadAccumulatorZeroPage);
            LoadAccumulatorIndexedIndirectY = (function (_super) {
                __extends(LoadAccumulatorIndexedIndirectY, _super);
                function LoadAccumulatorIndexedIndirectY() {
                    _super.call(this, "LDA", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectY, 0xB1);
                }
                LoadAccumulatorIndexedIndirectY.prototype.execute = function (cpu) {
                    cpu.rA = cpu.peek(cpu.addrIndirectIndexedY());
                    cpu.setFlags(cpu.rA);
                };
                LoadAccumulatorIndexedIndirectY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], LoadAccumulatorIndexedIndirectY);
                return LoadAccumulatorIndexedIndirectY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("LoadAccumulatorIndexedIndirectY", LoadAccumulatorIndexedIndirectY);
            LoadYRegisterAbsolute = (function (_super) {
                __extends(LoadYRegisterAbsolute, _super);
                function LoadYRegisterAbsolute() {
                    _super.call(this, "LDY", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0xAC);
                }
                LoadYRegisterAbsolute.prototype.execute = function (cpu) {
                    var target = cpu.addrPopWord();
                    cpu.rY = cpu.peek(target);
                    cpu.setFlags(cpu.rY);
                };
                LoadYRegisterAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], LoadYRegisterAbsolute);
                return LoadYRegisterAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("LoadYRegisterAbsolute", LoadYRegisterAbsolute);
            LoadYRegisterImmediate = (function (_super) {
                __extends(LoadYRegisterImmediate, _super);
                function LoadYRegisterImmediate() {
                    _super.call(this, "LDY", 0x02, opsCodes_1.OpCodes.ModeImmediate, 0xA0);
                }
                LoadYRegisterImmediate.prototype.execute = function (cpu) {
                    cpu.rY = cpu.addrPop();
                    cpu.setFlags(cpu.rY);
                };
                LoadYRegisterImmediate = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], LoadYRegisterImmediate);
                return LoadYRegisterImmediate;
            }(baseOpCode_1.BaseOpCode));
            exports_1("LoadYRegisterImmediate", LoadYRegisterImmediate);
            LoadYRegisterZeroPage = (function (_super) {
                __extends(LoadYRegisterZeroPage, _super);
                function LoadYRegisterZeroPage() {
                    _super.call(this, "LDY", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0xA4);
                }
                LoadYRegisterZeroPage.prototype.execute = function (cpu) {
                    var zeroPage = cpu.addrPop();
                    cpu.rY = cpu.peek(zeroPage);
                    cpu.setFlags(cpu.rY);
                };
                LoadYRegisterZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], LoadYRegisterZeroPage);
                return LoadYRegisterZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("LoadYRegisterZeroPage", LoadYRegisterZeroPage);
            LoadXRegisterImmediate = (function (_super) {
                __extends(LoadXRegisterImmediate, _super);
                function LoadXRegisterImmediate() {
                    _super.apply(this, arguments);
                    this.opName = "LDX";
                    this.sizeBytes = 0x02;
                    this.addressingMode = opsCodes_1.OpCodes.ModeImmediate;
                    this.opCode = 0xa2;
                }
                LoadXRegisterImmediate.prototype.decompile = function (address, bytes) {
                    return opsCodes_1.OpCodes.ToDecompiledLine(opsCodes_1.OpCodes.ToWord(address), this.opName, "#$" + opsCodes_1.OpCodes.ToByte(bytes[1]));
                };
                LoadXRegisterImmediate.prototype.execute = function (cpu) {
                    cpu.rX = cpu.addrPop();
                    cpu.setFlags(cpu.rX);
                };
                LoadXRegisterImmediate = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], LoadXRegisterImmediate);
                return LoadXRegisterImmediate;
            }(Function));
            exports_1("LoadXRegisterImmediate", LoadXRegisterImmediate);
            LoadXRegisterZeroPage = (function (_super) {
                __extends(LoadXRegisterZeroPage, _super);
                function LoadXRegisterZeroPage() {
                    _super.apply(this, arguments);
                    this.opName = "LDX";
                    this.sizeBytes = 0x02;
                    this.addressingMode = opsCodes_1.OpCodes.ModeZeroPage;
                    this.opCode = 0xa6;
                }
                LoadXRegisterZeroPage.prototype.decompile = function (address, bytes) {
                    return opsCodes_1.OpCodes.ToDecompiledLine(opsCodes_1.OpCodes.ToWord(address), this.opName, "$" + opsCodes_1.OpCodes.ToByte(bytes[1]));
                };
                LoadXRegisterZeroPage.prototype.execute = function (cpu) {
                    var zeroPage = cpu.addrPop();
                    cpu.rX = cpu.peek(zeroPage);
                    cpu.setFlags(cpu.rX);
                };
                LoadXRegisterZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], LoadXRegisterZeroPage);
                return LoadXRegisterZeroPage;
            }(Function));
            exports_1("LoadXRegisterZeroPage", LoadXRegisterZeroPage);
            /* ===========
                === NOP ===
                =========== */
            NoOperationSingle = (function (_super) {
                __extends(NoOperationSingle, _super);
                function NoOperationSingle() {
                    _super.call(this, "NOP", 0x01, opsCodes_1.OpCodes.ModeSingle, 0xEA);
                }
                NoOperationSingle.prototype.execute = function (cpu) {
                    return;
                };
                NoOperationSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], NoOperationSingle);
                return NoOperationSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("NoOperationSingle", NoOperationSingle);
            /* ===========
                === ORA ===
                =========== */
            OrImmediate = (function (_super) {
                __extends(OrImmediate, _super);
                function OrImmediate() {
                    _super.call(this, "ORA", 0x02, opsCodes_1.OpCodes.ModeImmediate, 0x09);
                }
                OrImmediate.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA | cpu.addrPop();
                    cpu.setFlags(cpu.rA);
                };
                OrImmediate = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], OrImmediate);
                return OrImmediate;
            }(baseOpCode_1.BaseOpCode));
            exports_1("OrImmediate", OrImmediate);
            OrZeroPage = (function (_super) {
                __extends(OrZeroPage, _super);
                function OrZeroPage() {
                    _super.call(this, "ORA", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0x05);
                }
                OrZeroPage.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA | cpu.peek(cpu.addrPop());
                    cpu.setFlags(cpu.rA);
                };
                OrZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], OrZeroPage);
                return OrZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("OrZeroPage", OrZeroPage);
            OrZeroPageX = (function (_super) {
                __extends(OrZeroPageX, _super);
                function OrZeroPageX() {
                    _super.call(this, "ORA", 0x02, opsCodes_1.OpCodes.ModeZeroPageX, 0x15);
                }
                OrZeroPageX.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA | cpu.peek(cpu.addrZeroPageX());
                    cpu.setFlags(cpu.rA);
                };
                OrZeroPageX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], OrZeroPageX);
                return OrZeroPageX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("OrZeroPageX", OrZeroPageX);
            OrAbsolute = (function (_super) {
                __extends(OrAbsolute, _super);
                function OrAbsolute() {
                    _super.call(this, "ORA", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0x0D);
                }
                OrAbsolute.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA | cpu.peek(cpu.addrPopWord());
                    cpu.setFlags(cpu.rA);
                };
                OrAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], OrAbsolute);
                return OrAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("OrAbsolute", OrAbsolute);
            OrAbsoluteX = (function (_super) {
                __extends(OrAbsoluteX, _super);
                function OrAbsoluteX() {
                    _super.call(this, "ORA", 0x03, opsCodes_1.OpCodes.ModeAbsoluteX, 0x1D);
                }
                OrAbsoluteX.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA | cpu.peek(cpu.addrAbsoluteX());
                    cpu.setFlags(cpu.rA);
                };
                OrAbsoluteX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], OrAbsoluteX);
                return OrAbsoluteX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("OrAbsoluteX", OrAbsoluteX);
            OrAbsoluteY = (function (_super) {
                __extends(OrAbsoluteY, _super);
                function OrAbsoluteY() {
                    _super.call(this, "ORA", 0x03, opsCodes_1.OpCodes.ModeAbsoluteY, 0x19);
                }
                OrAbsoluteY.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA | cpu.peek(cpu.addrAbsoluteY());
                    cpu.setFlags(cpu.rA);
                };
                OrAbsoluteY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], OrAbsoluteY);
                return OrAbsoluteY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("OrAbsoluteY", OrAbsoluteY);
            OrIndirectX = (function (_super) {
                __extends(OrIndirectX, _super);
                function OrIndirectX() {
                    _super.call(this, "ORA", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectX, 0x01);
                }
                OrIndirectX.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA | cpu.peek(cpu.addrIndexedIndirectX());
                    cpu.setFlags(cpu.rA);
                };
                OrIndirectX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], OrIndirectX);
                return OrIndirectX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("OrIndirectX", OrIndirectX);
            OrIndirectY = (function (_super) {
                __extends(OrIndirectY, _super);
                function OrIndirectY() {
                    _super.call(this, "ORA", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectY, 0x11);
                }
                OrIndirectY.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rA | cpu.peek(cpu.addrIndirectIndexedY());
                    cpu.setFlags(cpu.rA);
                };
                OrIndirectY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], OrIndirectY);
                return OrIndirectY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("OrIndirectY", OrIndirectY);
            /* ===========
                === RTS ===
                =========== */
            RtsSingle = (function (_super) {
                __extends(RtsSingle, _super);
                function RtsSingle() {
                    _super.call(this, "RTS", 0x01, opsCodes_1.OpCodes.ModeSingle, 0x60);
                }
                RtsSingle.prototype.execute = function (cpu) {
                    cpu.stackRts();
                };
                RtsSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], RtsSingle);
                return RtsSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("RtsSingle", RtsSingle);
            /* ==========================
                === Stack Instructions ===
                ========================== */
            PullProcessorStatusSingle = (function (_super) {
                __extends(PullProcessorStatusSingle, _super);
                function PullProcessorStatusSingle() {
                    _super.call(this, "PLP", 0x01, opsCodes_1.OpCodes.ModeSingle, 0x28);
                }
                PullProcessorStatusSingle.prototype.execute = function (cpu) {
                    cpu.rP = cpu.stackPop();
                };
                PullProcessorStatusSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], PullProcessorStatusSingle);
                return PullProcessorStatusSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("PullProcessorStatusSingle", PullProcessorStatusSingle);
            PushProcessorStatusSingle = (function (_super) {
                __extends(PushProcessorStatusSingle, _super);
                function PushProcessorStatusSingle() {
                    _super.call(this, "PHP", 0x01, opsCodes_1.OpCodes.ModeSingle, 0x08);
                }
                PushProcessorStatusSingle.prototype.execute = function (cpu) {
                    cpu.stackPush(cpu.rP);
                };
                PushProcessorStatusSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], PushProcessorStatusSingle);
                return PushProcessorStatusSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("PushProcessorStatusSingle", PushProcessorStatusSingle);
            PullAccumulatorSingle = (function (_super) {
                __extends(PullAccumulatorSingle, _super);
                function PullAccumulatorSingle() {
                    _super.call(this, "PLA", 0x01, opsCodes_1.OpCodes.ModeSingle, 0x68);
                }
                PullAccumulatorSingle.prototype.execute = function (cpu) {
                    cpu.rA = cpu.stackPop();
                    cpu.setFlags(cpu.rA);
                };
                PullAccumulatorSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], PullAccumulatorSingle);
                return PullAccumulatorSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("PullAccumulatorSingle", PullAccumulatorSingle);
            PushAccumulatorSingle = (function (_super) {
                __extends(PushAccumulatorSingle, _super);
                function PushAccumulatorSingle() {
                    _super.call(this, "PHA", 0x01, opsCodes_1.OpCodes.ModeSingle, 0x48);
                }
                PushAccumulatorSingle.prototype.execute = function (cpu) {
                    cpu.stackPush(cpu.rA);
                };
                PushAccumulatorSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], PushAccumulatorSingle);
                return PushAccumulatorSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("PushAccumulatorSingle", PushAccumulatorSingle);
            TransferXRegisterToStackPointerSingle = (function (_super) {
                __extends(TransferXRegisterToStackPointerSingle, _super);
                function TransferXRegisterToStackPointerSingle() {
                    _super.call(this, "TXS", 0x01, opsCodes_1.OpCodes.ModeSingle, 0x9A);
                }
                TransferXRegisterToStackPointerSingle.prototype.execute = function (cpu) {
                    cpu.rSP = cpu.rX;
                };
                TransferXRegisterToStackPointerSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], TransferXRegisterToStackPointerSingle);
                return TransferXRegisterToStackPointerSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("TransferXRegisterToStackPointerSingle", TransferXRegisterToStackPointerSingle);
            TransferStackPointerToXRegisterSingle = (function (_super) {
                __extends(TransferStackPointerToXRegisterSingle, _super);
                function TransferStackPointerToXRegisterSingle() {
                    _super.call(this, "TSX", 0x01, opsCodes_1.OpCodes.ModeSingle, 0xBA);
                }
                TransferStackPointerToXRegisterSingle.prototype.execute = function (cpu) {
                    cpu.rX = cpu.rSP;
                };
                TransferStackPointerToXRegisterSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], TransferStackPointerToXRegisterSingle);
                return TransferStackPointerToXRegisterSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("TransferStackPointerToXRegisterSingle", TransferStackPointerToXRegisterSingle);
            /* ===========
                === STA ===
                =========== */
            StoreAccumulatorAbsolute = (function (_super) {
                __extends(StoreAccumulatorAbsolute, _super);
                function StoreAccumulatorAbsolute() {
                    _super.call(this, "STA", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0x8D);
                }
                StoreAccumulatorAbsolute.prototype.execute = function (cpu) {
                    var targetAddress = cpu.addrPopWord();
                    cpu.poke(targetAddress, cpu.rA);
                };
                StoreAccumulatorAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], StoreAccumulatorAbsolute);
                return StoreAccumulatorAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("StoreAccumulatorAbsolute", StoreAccumulatorAbsolute);
            StoreAccumulatorAbsoluteX = (function (_super) {
                __extends(StoreAccumulatorAbsoluteX, _super);
                function StoreAccumulatorAbsoluteX() {
                    _super.call(this, "STA", 0x03, opsCodes_1.OpCodes.ModeAbsoluteX, 0x9D);
                }
                StoreAccumulatorAbsoluteX.prototype.execute = function (cpu) {
                    cpu.poke(cpu.addrAbsoluteX(), cpu.rA);
                };
                StoreAccumulatorAbsoluteX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], StoreAccumulatorAbsoluteX);
                return StoreAccumulatorAbsoluteX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("StoreAccumulatorAbsoluteX", StoreAccumulatorAbsoluteX);
            StoreAccumulatorAbsoluteY = (function (_super) {
                __extends(StoreAccumulatorAbsoluteY, _super);
                function StoreAccumulatorAbsoluteY() {
                    _super.call(this, "STA", 0x03, opsCodes_1.OpCodes.ModeAbsoluteY, 0x99);
                }
                StoreAccumulatorAbsoluteY.prototype.execute = function (cpu) {
                    cpu.poke(cpu.addrAbsoluteY(), cpu.rA);
                };
                StoreAccumulatorAbsoluteY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], StoreAccumulatorAbsoluteY);
                return StoreAccumulatorAbsoluteY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("StoreAccumulatorAbsoluteY", StoreAccumulatorAbsoluteY);
            StoreAccumulatorIndirectY = (function (_super) {
                __extends(StoreAccumulatorIndirectY, _super);
                function StoreAccumulatorIndirectY() {
                    _super.call(this, "STA", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectY, 0x91);
                }
                StoreAccumulatorIndirectY.prototype.execute = function (cpu) {
                    cpu.poke(cpu.addrIndirectIndexedY(), cpu.rA);
                };
                StoreAccumulatorIndirectY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], StoreAccumulatorIndirectY);
                return StoreAccumulatorIndirectY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("StoreAccumulatorIndirectY", StoreAccumulatorIndirectY);
            StoreAccumulatorIndirectX = (function (_super) {
                __extends(StoreAccumulatorIndirectX, _super);
                function StoreAccumulatorIndirectX() {
                    _super.call(this, "STA", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectX, 0xA1);
                }
                StoreAccumulatorIndirectX.prototype.execute = function (cpu) {
                    cpu.poke(cpu.addrIndexedIndirectX(), cpu.rA);
                };
                StoreAccumulatorIndirectX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], StoreAccumulatorIndirectX);
                return StoreAccumulatorIndirectX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("StoreAccumulatorIndirectX", StoreAccumulatorIndirectX);
            StoreAccumulatorZeroPage = (function (_super) {
                __extends(StoreAccumulatorZeroPage, _super);
                function StoreAccumulatorZeroPage() {
                    _super.call(this, "STA", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0x85);
                }
                StoreAccumulatorZeroPage.prototype.execute = function (cpu) {
                    var zeroPage = cpu.addrPop();
                    cpu.poke(zeroPage, cpu.rA);
                };
                StoreAccumulatorZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], StoreAccumulatorZeroPage);
                return StoreAccumulatorZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("StoreAccumulatorZeroPage", StoreAccumulatorZeroPage);
            StoreYRegisterAbsolute = (function (_super) {
                __extends(StoreYRegisterAbsolute, _super);
                function StoreYRegisterAbsolute() {
                    _super.call(this, "STY", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0x8C);
                }
                StoreYRegisterAbsolute.prototype.execute = function (cpu) {
                    var targetAddress = cpu.addrPopWord();
                    cpu.poke(targetAddress, cpu.rY);
                };
                StoreYRegisterAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], StoreYRegisterAbsolute);
                return StoreYRegisterAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("StoreYRegisterAbsolute", StoreYRegisterAbsolute);
            /* ===========
                === SBC ===
                =========== */
            SubtractWithCarryImmediate = (function (_super) {
                __extends(SubtractWithCarryImmediate, _super);
                function SubtractWithCarryImmediate() {
                    _super.call(this, "SBC", 0x02, opsCodes_1.OpCodes.ModeImmediate, 0xE9);
                }
                SubtractWithCarryImmediate.prototype.execute = function (cpu) {
                    opsCodes_1.OpCodes.SubtractWithCarry(cpu, cpu.addrPop());
                };
                SubtractWithCarryImmediate = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], SubtractWithCarryImmediate);
                return SubtractWithCarryImmediate;
            }(baseOpCode_1.BaseOpCode));
            exports_1("SubtractWithCarryImmediate", SubtractWithCarryImmediate);
            SubtractWithCarryZeroPage = (function (_super) {
                __extends(SubtractWithCarryZeroPage, _super);
                function SubtractWithCarryZeroPage() {
                    _super.call(this, "SBC", 0x02, opsCodes_1.OpCodes.ModeZeroPage, 0xE5);
                }
                SubtractWithCarryZeroPage.prototype.execute = function (cpu) {
                    var zeroPage = cpu.addrPop();
                    opsCodes_1.OpCodes.SubtractWithCarry(cpu, cpu.peek(zeroPage));
                };
                SubtractWithCarryZeroPage = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], SubtractWithCarryZeroPage);
                return SubtractWithCarryZeroPage;
            }(baseOpCode_1.BaseOpCode));
            exports_1("SubtractWithCarryZeroPage", SubtractWithCarryZeroPage);
            SubtractWithCarryZeroPageX = (function (_super) {
                __extends(SubtractWithCarryZeroPageX, _super);
                function SubtractWithCarryZeroPageX() {
                    _super.call(this, "SBC", 0x02, opsCodes_1.OpCodes.ModeZeroPageX, 0xF5);
                }
                SubtractWithCarryZeroPageX.prototype.execute = function (cpu) {
                    opsCodes_1.OpCodes.SubtractWithCarry(cpu, cpu.peek(cpu.addrZeroPageX()));
                };
                SubtractWithCarryZeroPageX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], SubtractWithCarryZeroPageX);
                return SubtractWithCarryZeroPageX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("SubtractWithCarryZeroPageX", SubtractWithCarryZeroPageX);
            SubtractWithCarryAbsolute = (function (_super) {
                __extends(SubtractWithCarryAbsolute, _super);
                function SubtractWithCarryAbsolute() {
                    _super.call(this, "SBC", 0x03, opsCodes_1.OpCodes.ModeAbsolute, 0xED);
                }
                SubtractWithCarryAbsolute.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrPopWord());
                    opsCodes_1.OpCodes.SubtractWithCarry(cpu, targetValue);
                };
                SubtractWithCarryAbsolute = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], SubtractWithCarryAbsolute);
                return SubtractWithCarryAbsolute;
            }(baseOpCode_1.BaseOpCode));
            exports_1("SubtractWithCarryAbsolute", SubtractWithCarryAbsolute);
            SubtractWithCarryAbsoluteX = (function (_super) {
                __extends(SubtractWithCarryAbsoluteX, _super);
                function SubtractWithCarryAbsoluteX() {
                    _super.call(this, "SBC", 0x03, opsCodes_1.OpCodes.ModeAbsoluteX, 0xFD);
                }
                SubtractWithCarryAbsoluteX.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrAbsoluteX());
                    opsCodes_1.OpCodes.SubtractWithCarry(cpu, targetValue);
                };
                SubtractWithCarryAbsoluteX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], SubtractWithCarryAbsoluteX);
                return SubtractWithCarryAbsoluteX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("SubtractWithCarryAbsoluteX", SubtractWithCarryAbsoluteX);
            SubtractWithCarryAbsoluteY = (function (_super) {
                __extends(SubtractWithCarryAbsoluteY, _super);
                function SubtractWithCarryAbsoluteY() {
                    _super.call(this, "SBC", 0x03, opsCodes_1.OpCodes.ModeAbsoluteY, 0xF9);
                }
                SubtractWithCarryAbsoluteY.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrAbsoluteY());
                    opsCodes_1.OpCodes.SubtractWithCarry(cpu, targetValue);
                };
                SubtractWithCarryAbsoluteY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], SubtractWithCarryAbsoluteY);
                return SubtractWithCarryAbsoluteY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("SubtractWithCarryAbsoluteY", SubtractWithCarryAbsoluteY);
            SubtractWithCarryIndexedIndirectX = (function (_super) {
                __extends(SubtractWithCarryIndexedIndirectX, _super);
                function SubtractWithCarryIndexedIndirectX() {
                    _super.call(this, "SBC", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectX, 0xE1);
                }
                SubtractWithCarryIndexedIndirectX.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrIndexedIndirectX());
                    opsCodes_1.OpCodes.SubtractWithCarry(cpu, targetValue);
                };
                SubtractWithCarryIndexedIndirectX = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], SubtractWithCarryIndexedIndirectX);
                return SubtractWithCarryIndexedIndirectX;
            }(baseOpCode_1.BaseOpCode));
            exports_1("SubtractWithCarryIndexedIndirectX", SubtractWithCarryIndexedIndirectX);
            SubtractWithCarryIndirectIndexedY = (function (_super) {
                __extends(SubtractWithCarryIndirectIndexedY, _super);
                function SubtractWithCarryIndirectIndexedY() {
                    _super.call(this, "SBC", 0x02, opsCodes_1.OpCodes.ModeIndexedIndirectY, 0xF1);
                }
                SubtractWithCarryIndirectIndexedY.prototype.execute = function (cpu) {
                    var targetValue = cpu.peek(cpu.addrIndirectIndexedY());
                    opsCodes_1.OpCodes.SubtractWithCarry(cpu, targetValue);
                };
                SubtractWithCarryIndirectIndexedY = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], SubtractWithCarryIndirectIndexedY);
                return SubtractWithCarryIndirectIndexedY;
            }(baseOpCode_1.BaseOpCode));
            exports_1("SubtractWithCarryIndirectIndexedY", SubtractWithCarryIndirectIndexedY);
            TransferAccumulatorToXSingle = (function (_super) {
                __extends(TransferAccumulatorToXSingle, _super);
                function TransferAccumulatorToXSingle() {
                    _super.call(this, "TAX", 0x01, opsCodes_1.OpCodes.ModeSingle, 0xAA);
                }
                TransferAccumulatorToXSingle.prototype.execute = function (cpu) {
                    cpu.rX = cpu.rA;
                    cpu.setFlags(cpu.rX);
                };
                TransferAccumulatorToXSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], TransferAccumulatorToXSingle);
                return TransferAccumulatorToXSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("TransferAccumulatorToXSingle", TransferAccumulatorToXSingle);
            TransferAccumulatorToYSingle = (function (_super) {
                __extends(TransferAccumulatorToYSingle, _super);
                function TransferAccumulatorToYSingle() {
                    _super.call(this, "TAY", 0x01, opsCodes_1.OpCodes.ModeSingle, 0xA8);
                }
                TransferAccumulatorToYSingle.prototype.execute = function (cpu) {
                    cpu.rY = cpu.rA;
                    cpu.setFlags(cpu.rY);
                };
                TransferAccumulatorToYSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], TransferAccumulatorToYSingle);
                return TransferAccumulatorToYSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("TransferAccumulatorToYSingle", TransferAccumulatorToYSingle);
            TransferXToAccumulatorSingle = (function (_super) {
                __extends(TransferXToAccumulatorSingle, _super);
                function TransferXToAccumulatorSingle() {
                    _super.call(this, "TXA", 0x01, opsCodes_1.OpCodes.ModeSingle, 0x8A);
                }
                TransferXToAccumulatorSingle.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rX;
                    cpu.setFlags(cpu.rA);
                };
                TransferXToAccumulatorSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], TransferXToAccumulatorSingle);
                return TransferXToAccumulatorSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("TransferXToAccumulatorSingle", TransferXToAccumulatorSingle);
            TransferYToAccumulatorSingle = (function (_super) {
                __extends(TransferYToAccumulatorSingle, _super);
                function TransferYToAccumulatorSingle() {
                    _super.call(this, "TYA", 0x01, opsCodes_1.OpCodes.ModeSingle, 0x98);
                }
                TransferYToAccumulatorSingle.prototype.execute = function (cpu) {
                    cpu.rA = cpu.rY;
                    cpu.setFlags(cpu.rA);
                };
                TransferYToAccumulatorSingle = __decorate([
                    IsOpCode, 
                    __metadata('design:paramtypes', [])
                ], TransferYToAccumulatorSingle);
                return TransferYToAccumulatorSingle;
            }(baseOpCode_1.BaseOpCode));
            exports_1("TransferYToAccumulatorSingle", TransferYToAccumulatorSingle);
        }
    }
});
//# sourceMappingURL=opCodes.js.map