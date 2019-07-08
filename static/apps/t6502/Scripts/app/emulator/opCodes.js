///<reference path="cpu.ts"/>
///<reference path="compiler.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Emulator;
(function (Emulator) {
    var registeredOperations = [];

    var OpCodes = (function () {
        function OpCodes() {
        }
        OpCodes.computeBranch = function (address, offset) {
            var result = 0;
            if (offset > Constants.Memory.BranchBack) {
                result = (address - (Constants.Memory.BranchOffset - offset));
            } else {
                result = address + offset;
            }
            return result;
        };

        OpCodes.LoadOpCodesByName = function (opCode) {
            var result = [];
            var idx;
            for (var idx = 0; idx < registeredOperations.length; idx++) {
                var operation = new registeredOperations[idx]();
                if (operation.opName === opCode) {
                    result.push(operation);
                }
            }
            return result;
        };

        OpCodes.ToByte = function (value) {
            var valueStr = value.toString(16).toUpperCase();
            return valueStr.length == 1 ? "0" + valueStr : valueStr;
        };

        OpCodes.ToWord = function (value) {
            var padding = ["000", "00", "0"];
            var valueStr = value.toString(16).toUpperCase();
            if (valueStr.length === 4) {
                return valueStr;
            } else {
                return padding[valueStr.length - 1] + valueStr;
            }
        };

        OpCodes.ToDecompiledLine = function (address, opCode, parm) {
            return "$" + address + ": " + opCode + " " + parm;
        };

        OpCodes.ProcessLine = function (address, op, bytes) {
            if (op.addressingMode === OpCodes.ModeImmediate) {
                return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "#$" + OpCodes.ToByte(bytes[1]));
            }

            if (op.addressingMode === OpCodes.ModeZeroPage) {
                return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "$" + OpCodes.ToByte(bytes[1]));
            }

            if (op.addressingMode === OpCodes.ModeZeroPageX) {
                return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "$" + OpCodes.ToByte(bytes[1]) + ",X");
            }

            if (op.addressingMode === OpCodes.ModeAbsolute) {
                return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "$" + OpCodes.ToWord(bytes[1] + (bytes[2] << Constants.Memory.BitsInByte)));
            }

            if (op.addressingMode === OpCodes.ModeAbsoluteX) {
                return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "$" + OpCodes.ToWord(bytes[1] + (bytes[2] << Constants.Memory.BitsInByte)) + ", X");
            }

            if (op.addressingMode === OpCodes.ModeAbsoluteY) {
                return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "$" + OpCodes.ToWord(bytes[1] + (bytes[2] << Constants.Memory.BitsInByte)) + ", Y");
            }

            if (op.addressingMode === OpCodes.ModeRelative) {
                return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "$" + OpCodes.ToWord(OpCodes.computeBranch(address + 2, bytes[1])));
            }

            if (op.addressingMode === OpCodes.ModeSingle) {
                return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "");
            }

            if (op.addressingMode === OpCodes.ModeIndexedIndirectX) {
                return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "($" + OpCodes.ToByte(bytes[1]) + ", X)");
            }

            if (op.addressingMode === OpCodes.ModeIndexedIndirectY) {
                return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "($" + OpCodes.ToByte(bytes[1]) + "), Y");
            }

            if (op.addressingMode === OpCodes.ModeIndirect) {
                return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "($" + OpCodes.ToWord(bytes[1] + (bytes[2] << Constants.Memory.BitsInByte)) + ")");
            }

            throw "Unknown addressing mode.";
        };

        OpCodes.FillOps = function (operationMap) {
            var idx;
            var size = Constants.Memory.ByteMask + 1;
            while (size -= 1) {
                var invalid = new InvalidOp(size);
                operationMap.push(invalid);
            }

            for (idx = 0; idx < registeredOperations.length; idx++) {
                var operation = new registeredOperations[idx]();
                operationMap[operation.opCode] = operation;
            }
        };

        OpCodes.AddWithCarry = function (cpu, src) {
            var temp;
            var carryFactor = cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet) ? 1 : 0;
            var overflowFlag;

            function offsetAdjustAdd(offs, cutOff) {
                if (offs >= cutOff) {
                    cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
                    if (cpu.checkFlag(Constants.ProcessorStatus.OverflowFlagSet) && offs >= 0x180) {
                        cpu.setFlag(Constants.ProcessorStatus.OverflowFlagSet, false);
                    }
                    return true;
                } else {
                    cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, false);
                    if (cpu.checkFlag(Constants.ProcessorStatus.OverflowFlagSet) && offs < Constants.ProcessorStatus.NegativeFlagSet) {
                        cpu.setFlag(Constants.ProcessorStatus.OverflowFlagSet, false);
                    }
                    return false;
                }
            }

            overflowFlag = !((cpu.rA ^ src) & Constants.ProcessorStatus.NegativeFlagSet);
            cpu.setFlag(Constants.ProcessorStatus.OverflowFlagSet, overflowFlag);
            if (cpu.checkFlag(Constants.ProcessorStatus.DecimalFlagSet)) {
                temp = (cpu.rA & Constants.Memory.NibbleMask) + (src & Constants.Memory.NibbleMask) + carryFactor;
                if (temp >= 0x0A) {
                    temp = 0x10 | ((temp + 0x06) & Constants.Memory.NibbleMask);
                }
                temp += (cpu.rA & Constants.Memory.HighNibbleMask) + (src & Constants.Memory.HighNibbleMask);
                if (offsetAdjustAdd(temp, 0xA0)) {
                    temp += 0x60;
                }
            } else {
                temp = cpu.rA + src + carryFactor;
                offsetAdjustAdd(temp, 0x100);
            }
            cpu.rA = temp & Constants.Memory.ByteMask;
            cpu.setFlags(cpu.rA);
        };

        OpCodes.SubtractWithCarry = function (cpu, src) {
            var temp, offset, carryFactor;
            var overflowFlag;

            function offsetAdjustSub(offs) {
                if (offs < 0x100) {
                    cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, false);
                    if (cpu.checkFlag(Constants.ProcessorStatus.OverflowFlagSet) && offs < Constants.ProcessorStatus.NegativeFlagSet) {
                        cpu.setFlag(Constants.ProcessorStatus.OverflowFlagSet, false);
                    }
                    return true;
                } else {
                    cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
                    if (cpu.checkFlag(Constants.ProcessorStatus.OverflowFlagSet) && offset >= 0x180) {
                        cpu.setFlag(Constants.ProcessorStatus.OverflowFlagSet, false);
                    }
                    return false;
                }
            }
            ;

            carryFactor = cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet) ? 1 : 0;

            cpu.setFlag(Constants.ProcessorStatus.OverflowFlagSet, !!((cpu.rA ^ src) & Constants.ProcessorStatus.NegativeFlagSet));
            if (cpu.checkFlag(Constants.ProcessorStatus.DecimalFlagSet)) {
                temp = Constants.Memory.NibbleMask + (cpu.rA & Constants.Memory.NibbleMask) - (src & Constants.Memory.NibbleMask) + carryFactor;
                if (temp < 0x10) {
                    offset = 0;
                    temp -= 0x06;
                } else {
                    offset = 0x10;
                    temp -= 0x10;
                }
                offset += Constants.Memory.HighNibbleMask + (cpu.rA & Constants.Memory.HighNibbleMask) - (src & Constants.Memory.HighNibbleMask);
                if (offsetAdjustSub(offset)) {
                    offset -= 0x60;
                }
                offset += temp;
            } else {
                offset = Constants.Memory.ByteMask + cpu.rA - src + carryFactor;
                offsetAdjustSub(offset);
            }
            cpu.rA = offset & Constants.Memory.ByteMask;
            cpu.setFlags(cpu.rA);
        };
        OpCodes.ModeImmediate = 1;
        OpCodes.ModeZeroPage = 2;
        OpCodes.ModeZeroPageX = 3;
        OpCodes.ModeZeroPageY = 4;
        OpCodes.ModeAbsolute = 5;
        OpCodes.ModeAbsoluteX = 6;
        OpCodes.ModeAbsoluteY = 7;
        OpCodes.ModeIndirect = 8;
        OpCodes.ModeIndexedIndirectX = 9;
        OpCodes.ModeIndexedIndirectY = 10;
        OpCodes.ModeSingle = 11;
        OpCodes.ModeRelative = 12;
        return OpCodes;
    })();
    Emulator.OpCodes = OpCodes;

    var BaseOpCode = (function () {
        function BaseOpCode(opName, sizeBytes, addressingMode, opCode) {
            this.opName = opName;
            this.sizeBytes = sizeBytes;
            this.addressingMode = addressingMode;
            this.opCode = opCode;
        }
        BaseOpCode.prototype.decompile = function (address, bytes) {
            return OpCodes.ProcessLine(address, this, bytes);
        };

        BaseOpCode.prototype.execute = function (cpu) {
            return;
        };
        return BaseOpCode;
    })();
    Emulator.BaseOpCode = BaseOpCode;

    /* =====================
    === Compiler Only ===
    ===================== */
    var Dcb = (function (_super) {
        __extends(Dcb, _super);
        function Dcb() {
            _super.call(this, "DCB", 0x00, OpCodes.ModeSingle, 0xFFFF);
        }
        Dcb.prototype.execute = function (cpu) {
            throw "DCB is a compiler directive only.";
        };
        return Dcb;
    })(BaseOpCode);
    Emulator.Dcb = Dcb;
    registeredOperations.push(Dcb);

    /* ===========
    === ADC ===
    =========== */
    var AddWithCarryImmediate = (function (_super) {
        __extends(AddWithCarryImmediate, _super);
        function AddWithCarryImmediate() {
            _super.call(this, "ADC", 0x02, OpCodes.ModeImmediate, 0x69);
        }
        AddWithCarryImmediate.prototype.execute = function (cpu) {
            OpCodes.AddWithCarry(cpu, cpu.addrPop());
        };
        return AddWithCarryImmediate;
    })(BaseOpCode);
    Emulator.AddWithCarryImmediate = AddWithCarryImmediate;
    registeredOperations.push(AddWithCarryImmediate);

    var AddWithCarryZeroPage = (function (_super) {
        __extends(AddWithCarryZeroPage, _super);
        function AddWithCarryZeroPage() {
            _super.call(this, "ADC", 0x02, OpCodes.ModeZeroPage, 0x65);
        }
        AddWithCarryZeroPage.prototype.execute = function (cpu) {
            var zeroPage = cpu.addrPop();
            OpCodes.AddWithCarry(cpu, cpu.peek(zeroPage));
        };
        return AddWithCarryZeroPage;
    })(BaseOpCode);
    Emulator.AddWithCarryZeroPage = AddWithCarryZeroPage;
    registeredOperations.push(AddWithCarryZeroPage);

    var AddWithCarryZeroPageX = (function (_super) {
        __extends(AddWithCarryZeroPageX, _super);
        function AddWithCarryZeroPageX() {
            _super.call(this, "ADC", 0x02, OpCodes.ModeZeroPageX, 0x75);
        }
        AddWithCarryZeroPageX.prototype.execute = function (cpu) {
            OpCodes.AddWithCarry(cpu, cpu.peek(cpu.addrZeroPageX()));
        };
        return AddWithCarryZeroPageX;
    })(BaseOpCode);
    Emulator.AddWithCarryZeroPageX = AddWithCarryZeroPageX;
    registeredOperations.push(AddWithCarryZeroPageX);

    var AddWithCarryAbsolute = (function (_super) {
        __extends(AddWithCarryAbsolute, _super);
        function AddWithCarryAbsolute() {
            _super.call(this, "ADC", 0x03, OpCodes.ModeAbsolute, 0x6D);
        }
        AddWithCarryAbsolute.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrPopWord());
            OpCodes.AddWithCarry(cpu, targetValue);
        };
        return AddWithCarryAbsolute;
    })(BaseOpCode);
    Emulator.AddWithCarryAbsolute = AddWithCarryAbsolute;
    registeredOperations.push(AddWithCarryAbsolute);

    var AddWithCarryAbsoluteX = (function (_super) {
        __extends(AddWithCarryAbsoluteX, _super);
        function AddWithCarryAbsoluteX() {
            _super.call(this, "ADC", 0x03, OpCodes.ModeAbsoluteX, 0x7D);
        }
        AddWithCarryAbsoluteX.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrAbsoluteX());
            OpCodes.AddWithCarry(cpu, targetValue);
        };
        return AddWithCarryAbsoluteX;
    })(BaseOpCode);
    Emulator.AddWithCarryAbsoluteX = AddWithCarryAbsoluteX;
    registeredOperations.push(AddWithCarryAbsoluteX);

    var AddWithCarryAbsoluteY = (function (_super) {
        __extends(AddWithCarryAbsoluteY, _super);
        function AddWithCarryAbsoluteY() {
            _super.call(this, "ADC", 0x03, OpCodes.ModeAbsoluteY, 0x79);
        }
        AddWithCarryAbsoluteY.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrAbsoluteY());
            OpCodes.AddWithCarry(cpu, targetValue);
        };
        return AddWithCarryAbsoluteY;
    })(BaseOpCode);
    Emulator.AddWithCarryAbsoluteY = AddWithCarryAbsoluteY;
    registeredOperations.push(AddWithCarryAbsoluteY);

    var AddWithCarryIndexedIndirectX = (function (_super) {
        __extends(AddWithCarryIndexedIndirectX, _super);
        function AddWithCarryIndexedIndirectX() {
            _super.call(this, "ADC", 0x02, OpCodes.ModeIndexedIndirectX, 0x61);
        }
        AddWithCarryIndexedIndirectX.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrIndexedIndirectX());
            OpCodes.AddWithCarry(cpu, targetValue);
        };
        return AddWithCarryIndexedIndirectX;
    })(BaseOpCode);
    Emulator.AddWithCarryIndexedIndirectX = AddWithCarryIndexedIndirectX;
    registeredOperations.push(AddWithCarryIndexedIndirectX);

    var AddWithCarryIndirectIndexedY = (function (_super) {
        __extends(AddWithCarryIndirectIndexedY, _super);
        function AddWithCarryIndirectIndexedY() {
            _super.call(this, "ADC", 0x02, OpCodes.ModeIndexedIndirectY, 0x71);
        }
        AddWithCarryIndirectIndexedY.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrIndirectIndexedY());
            OpCodes.AddWithCarry(cpu, targetValue);
        };
        return AddWithCarryIndirectIndexedY;
    })(BaseOpCode);
    Emulator.AddWithCarryIndirectIndexedY = AddWithCarryIndirectIndexedY;
    registeredOperations.push(AddWithCarryIndirectIndexedY);

    /* ===========
    === AND ===
    =========== */
    var AndImmediate = (function (_super) {
        __extends(AndImmediate, _super);
        function AndImmediate() {
            _super.call(this, "AND", 0x02, OpCodes.ModeImmediate, 0x29);
        }
        AndImmediate.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA & cpu.addrPop();
            cpu.setFlags(cpu.rA);
        };
        return AndImmediate;
    })(BaseOpCode);
    Emulator.AndImmediate = AndImmediate;
    registeredOperations.push(AndImmediate);

    var AndZeroPage = (function (_super) {
        __extends(AndZeroPage, _super);
        function AndZeroPage() {
            _super.call(this, "AND", 0x02, OpCodes.ModeZeroPage, 0x25);
        }
        AndZeroPage.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA & cpu.peek(cpu.addrPop());
            cpu.setFlags(cpu.rA);
        };
        return AndZeroPage;
    })(BaseOpCode);
    Emulator.AndZeroPage = AndZeroPage;
    registeredOperations.push(AndZeroPage);

    var AndZeroPageX = (function (_super) {
        __extends(AndZeroPageX, _super);
        function AndZeroPageX() {
            _super.call(this, "AND", 0x02, OpCodes.ModeZeroPageX, 0x35);
        }
        AndZeroPageX.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA & cpu.peek(cpu.addrZeroPageX());
            cpu.setFlags(cpu.rA);
        };
        return AndZeroPageX;
    })(BaseOpCode);
    Emulator.AndZeroPageX = AndZeroPageX;
    registeredOperations.push(AndZeroPageX);

    var AndAbsolute = (function (_super) {
        __extends(AndAbsolute, _super);
        function AndAbsolute() {
            _super.call(this, "AND", 0x03, OpCodes.ModeAbsolute, 0x2D);
        }
        AndAbsolute.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA & cpu.peek(cpu.addrPopWord());
            cpu.setFlags(cpu.rA);
        };
        return AndAbsolute;
    })(BaseOpCode);
    Emulator.AndAbsolute = AndAbsolute;
    registeredOperations.push(AndAbsolute);

    var AndAbsoluteX = (function (_super) {
        __extends(AndAbsoluteX, _super);
        function AndAbsoluteX() {
            _super.call(this, "AND", 0x03, OpCodes.ModeAbsoluteX, 0x3D);
        }
        AndAbsoluteX.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA & cpu.peek(cpu.addrAbsoluteX());
            cpu.setFlags(cpu.rA);
        };
        return AndAbsoluteX;
    })(BaseOpCode);
    Emulator.AndAbsoluteX = AndAbsoluteX;
    registeredOperations.push(AndAbsoluteX);

    var AndAbsoluteY = (function (_super) {
        __extends(AndAbsoluteY, _super);
        function AndAbsoluteY() {
            _super.call(this, "AND", 0x03, OpCodes.ModeAbsoluteY, 0x39);
        }
        AndAbsoluteY.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA & cpu.peek(cpu.addrAbsoluteY());
            cpu.setFlags(cpu.rA);
        };
        return AndAbsoluteY;
    })(BaseOpCode);
    Emulator.AndAbsoluteY = AndAbsoluteY;
    registeredOperations.push(AndAbsoluteY);

    var AndIndirectX = (function (_super) {
        __extends(AndIndirectX, _super);
        function AndIndirectX() {
            _super.call(this, "AND", 0x02, OpCodes.ModeIndexedIndirectX, 0x21);
        }
        AndIndirectX.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA & cpu.peek(cpu.addrIndexedIndirectX());
            cpu.setFlags(cpu.rA);
        };
        return AndIndirectX;
    })(BaseOpCode);
    Emulator.AndIndirectX = AndIndirectX;
    registeredOperations.push(AndIndirectX);

    var AndIndirectY = (function (_super) {
        __extends(AndIndirectY, _super);
        function AndIndirectY() {
            _super.call(this, "AND", 0x02, OpCodes.ModeIndexedIndirectY, 0x31);
        }
        AndIndirectY.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA & cpu.peek(cpu.addrIndirectIndexedY());
            cpu.setFlags(cpu.rA);
        };
        return AndIndirectY;
    })(BaseOpCode);
    Emulator.AndIndirectY = AndIndirectY;
    registeredOperations.push(AndIndirectY);

    /* ===========
    === BIT ===
    =========== */
    var BitAbsolute = (function (_super) {
        __extends(BitAbsolute, _super);
        function BitAbsolute() {
            _super.call(this, "BIT", 0x03, OpCodes.ModeAbsolute, 0x2C);
        }
        BitAbsolute.prototype.execute = function (cpu) {
            var address = cpu.addrPopWord();
            var value = cpu.peek(address);
            cpu.setFlag(Constants.ProcessorStatus.ZeroFlagSet, (cpu.rA & value) === 0);
            cpu.setFlag(Constants.ProcessorStatus.NegativeFlagSet, !!(value & Constants.ProcessorStatus.NegativeFlagSet));
            cpu.setFlag(Constants.ProcessorStatus.OverflowFlagSet, !!(value & Constants.ProcessorStatus.OverflowFlagSet));
        };
        return BitAbsolute;
    })(BaseOpCode);
    Emulator.BitAbsolute = BitAbsolute;
    registeredOperations.push(BitAbsolute);

    var BitZeroPage = (function (_super) {
        __extends(BitZeroPage, _super);
        function BitZeroPage() {
            _super.call(this, "BIT", 0x02, OpCodes.ModeAbsolute, 0x24);
        }
        BitZeroPage.prototype.execute = function (cpu) {
            var zeroPage = cpu.addrPop();
            var value = cpu.peek(zeroPage);
            cpu.setFlag(Constants.ProcessorStatus.ZeroFlagSet, (cpu.rA & value) === 0);
            cpu.setFlag(Constants.ProcessorStatus.NegativeFlagSet, (value & Constants.ProcessorStatus.NegativeFlagSet) > 0);
            cpu.setFlag(Constants.ProcessorStatus.OverflowFlagSet, (value & Constants.ProcessorStatus.OverflowFlagSet) > 0);
        };
        return BitZeroPage;
    })(BaseOpCode);
    Emulator.BitZeroPage = BitZeroPage;
    registeredOperations.push(BitZeroPage);

    /* ================
    === BRANCHES ===
    ================ */
    var BranchNotEqualRelative = (function (_super) {
        __extends(BranchNotEqualRelative, _super);
        function BranchNotEqualRelative() {
            _super.call(this, "BNE", 0x02, OpCodes.ModeRelative, 0xD0);
        }
        BranchNotEqualRelative.prototype.execute = function (cpu) {
            var branch = cpu.addrPop();
            if (!cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)) {
                cpu.rPC = OpCodes.computeBranch(cpu.rPC, branch);
            }
        };
        return BranchNotEqualRelative;
    })(BaseOpCode);
    Emulator.BranchNotEqualRelative = BranchNotEqualRelative;
    registeredOperations.push(BranchNotEqualRelative);

    var BranchEqualRelative = (function (_super) {
        __extends(BranchEqualRelative, _super);
        function BranchEqualRelative() {
            _super.call(this, "BEQ", 0x02, OpCodes.ModeRelative, 0xF0);
        }
        BranchEqualRelative.prototype.execute = function (cpu) {
            var branch = cpu.addrPop();
            if (cpu.checkFlag(Constants.ProcessorStatus.ZeroFlagSet)) {
                cpu.rPC = OpCodes.computeBranch(cpu.rPC, branch);
            }
        };
        return BranchEqualRelative;
    })(BaseOpCode);
    Emulator.BranchEqualRelative = BranchEqualRelative;
    registeredOperations.push(BranchEqualRelative);

    var BranchMinusRelative = (function (_super) {
        __extends(BranchMinusRelative, _super);
        function BranchMinusRelative() {
            _super.call(this, "BMI", 0x02, OpCodes.ModeRelative, 0x30);
        }
        BranchMinusRelative.prototype.execute = function (cpu) {
            var branch = cpu.addrPop();
            if (cpu.checkFlag(Constants.ProcessorStatus.NegativeFlagSet)) {
                cpu.rPC = OpCodes.computeBranch(cpu.rPC, branch);
            }
        };
        return BranchMinusRelative;
    })(BaseOpCode);
    Emulator.BranchMinusRelative = BranchMinusRelative;
    registeredOperations.push(BranchMinusRelative);

    var BranchPlusRelative = (function (_super) {
        __extends(BranchPlusRelative, _super);
        function BranchPlusRelative() {
            _super.call(this, "BPL", 0x02, OpCodes.ModeRelative, 0x10);
        }
        BranchPlusRelative.prototype.execute = function (cpu) {
            var branch = cpu.addrPop();
            if (!cpu.checkFlag(Constants.ProcessorStatus.NegativeFlagSet)) {
                cpu.rPC = OpCodes.computeBranch(cpu.rPC, branch);
            }
        };
        return BranchPlusRelative;
    })(BaseOpCode);
    Emulator.BranchPlusRelative = BranchPlusRelative;
    registeredOperations.push(BranchPlusRelative);

    var BranchOverflowClearRelative = (function (_super) {
        __extends(BranchOverflowClearRelative, _super);
        function BranchOverflowClearRelative() {
            _super.call(this, "BVC", 0x02, OpCodes.ModeRelative, 0x50);
        }
        BranchOverflowClearRelative.prototype.execute = function (cpu) {
            var branch = cpu.addrPop();
            if (!cpu.checkFlag(Constants.ProcessorStatus.OverflowFlagSet)) {
                cpu.rPC = OpCodes.computeBranch(cpu.rPC, branch);
            }
        };
        return BranchOverflowClearRelative;
    })(BaseOpCode);
    Emulator.BranchOverflowClearRelative = BranchOverflowClearRelative;
    registeredOperations.push(BranchOverflowClearRelative);

    var BranchOverflowSetRelative = (function (_super) {
        __extends(BranchOverflowSetRelative, _super);
        function BranchOverflowSetRelative() {
            _super.call(this, "BVS", 0x02, OpCodes.ModeRelative, 0x70);
        }
        BranchOverflowSetRelative.prototype.execute = function (cpu) {
            var branch = cpu.addrPop();
            if (cpu.checkFlag(Constants.ProcessorStatus.OverflowFlagSet)) {
                cpu.rPC = OpCodes.computeBranch(cpu.rPC, branch);
            }
        };
        return BranchOverflowSetRelative;
    })(BaseOpCode);
    Emulator.BranchOverflowSetRelative = BranchOverflowSetRelative;
    registeredOperations.push(BranchOverflowSetRelative);

    var BranchCarryClearRelative = (function (_super) {
        __extends(BranchCarryClearRelative, _super);
        function BranchCarryClearRelative() {
            _super.call(this, "BCC", 0x02, OpCodes.ModeRelative, 0x90);
        }
        BranchCarryClearRelative.prototype.execute = function (cpu) {
            var branch = cpu.addrPop();
            if (!cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)) {
                cpu.rPC = OpCodes.computeBranch(cpu.rPC, branch);
            }
        };
        return BranchCarryClearRelative;
    })(BaseOpCode);
    Emulator.BranchCarryClearRelative = BranchCarryClearRelative;
    registeredOperations.push(BranchCarryClearRelative);

    var BranchCarrySetRelative = (function (_super) {
        __extends(BranchCarrySetRelative, _super);
        function BranchCarrySetRelative() {
            _super.call(this, "BCS", 0x02, OpCodes.ModeRelative, 0xB0);
        }
        BranchCarrySetRelative.prototype.execute = function (cpu) {
            var branch = cpu.addrPop();
            if (cpu.checkFlag(Constants.ProcessorStatus.CarryFlagSet)) {
                cpu.rPC = OpCodes.computeBranch(cpu.rPC, branch);
            }
        };
        return BranchCarrySetRelative;
    })(BaseOpCode);
    Emulator.BranchCarrySetRelative = BranchCarrySetRelative;
    registeredOperations.push(BranchCarrySetRelative);

    /* ===========
    === CMP ===
    =========== */
    var CompareAccumulatorImmediate = (function (_super) {
        __extends(CompareAccumulatorImmediate, _super);
        function CompareAccumulatorImmediate() {
            _super.call(this, "CMP", 0x02, OpCodes.ModeImmediate, 0xC9);
        }
        CompareAccumulatorImmediate.prototype.execute = function (cpu) {
            cpu.compareWithFlags(cpu.rA, cpu.addrPop());
        };
        return CompareAccumulatorImmediate;
    })(BaseOpCode);
    Emulator.CompareAccumulatorImmediate = CompareAccumulatorImmediate;
    registeredOperations.push(CompareAccumulatorImmediate);

    var CompareAccumulatorZeroPage = (function (_super) {
        __extends(CompareAccumulatorZeroPage, _super);
        function CompareAccumulatorZeroPage() {
            _super.call(this, "CMP", 0x02, OpCodes.ModeZeroPage, 0xC5);
        }
        CompareAccumulatorZeroPage.prototype.execute = function (cpu) {
            var zeroPage = cpu.addrPop();
            cpu.compareWithFlags(cpu.rA, cpu.peek(zeroPage));
        };
        return CompareAccumulatorZeroPage;
    })(BaseOpCode);
    Emulator.CompareAccumulatorZeroPage = CompareAccumulatorZeroPage;
    registeredOperations.push(CompareAccumulatorZeroPage);

    var CompareAccumulatorZeroPageX = (function (_super) {
        __extends(CompareAccumulatorZeroPageX, _super);
        function CompareAccumulatorZeroPageX() {
            _super.call(this, "CMP", 0x02, OpCodes.ModeZeroPageX, 0xD5);
        }
        CompareAccumulatorZeroPageX.prototype.execute = function (cpu) {
            cpu.compareWithFlags(cpu.rA, cpu.peek(cpu.addrZeroPageX()));
        };
        return CompareAccumulatorZeroPageX;
    })(BaseOpCode);
    Emulator.CompareAccumulatorZeroPageX = CompareAccumulatorZeroPageX;
    registeredOperations.push(CompareAccumulatorZeroPageX);

    var CompareAccumulatorAbsolute = (function (_super) {
        __extends(CompareAccumulatorAbsolute, _super);
        function CompareAccumulatorAbsolute() {
            _super.call(this, "CMP", 0x03, OpCodes.ModeAbsolute, 0xCD);
        }
        CompareAccumulatorAbsolute.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrPopWord());
            cpu.compareWithFlags(cpu.rA, targetValue);
        };
        return CompareAccumulatorAbsolute;
    })(BaseOpCode);
    Emulator.CompareAccumulatorAbsolute = CompareAccumulatorAbsolute;
    registeredOperations.push(CompareAccumulatorAbsolute);

    var CompareAccumulatorAbsoluteX = (function (_super) {
        __extends(CompareAccumulatorAbsoluteX, _super);
        function CompareAccumulatorAbsoluteX() {
            _super.call(this, "CMP", 0x03, OpCodes.ModeAbsoluteX, 0xDD);
        }
        CompareAccumulatorAbsoluteX.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrAbsoluteX());
            cpu.compareWithFlags(cpu.rA, targetValue);
        };
        return CompareAccumulatorAbsoluteX;
    })(BaseOpCode);
    Emulator.CompareAccumulatorAbsoluteX = CompareAccumulatorAbsoluteX;
    registeredOperations.push(CompareAccumulatorAbsoluteX);

    var CompareAccumulatorAbsoluteY = (function (_super) {
        __extends(CompareAccumulatorAbsoluteY, _super);
        function CompareAccumulatorAbsoluteY() {
            _super.call(this, "CMP", 0x03, OpCodes.ModeAbsoluteY, 0xD9);
        }
        CompareAccumulatorAbsoluteY.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrAbsoluteY());
            cpu.compareWithFlags(cpu.rA, targetValue);
        };
        return CompareAccumulatorAbsoluteY;
    })(BaseOpCode);
    Emulator.CompareAccumulatorAbsoluteY = CompareAccumulatorAbsoluteY;
    registeredOperations.push(CompareAccumulatorAbsoluteY);

    var CompareAccumulatorIndexedIndirectX = (function (_super) {
        __extends(CompareAccumulatorIndexedIndirectX, _super);
        function CompareAccumulatorIndexedIndirectX() {
            _super.call(this, "CMP", 0x02, OpCodes.ModeIndexedIndirectX, 0xC1);
        }
        CompareAccumulatorIndexedIndirectX.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrIndexedIndirectX());
            cpu.compareWithFlags(cpu.rA, targetValue);
        };
        return CompareAccumulatorIndexedIndirectX;
    })(BaseOpCode);
    Emulator.CompareAccumulatorIndexedIndirectX = CompareAccumulatorIndexedIndirectX;
    registeredOperations.push(CompareAccumulatorIndexedIndirectX);

    var CompareAccumulatorIndirectIndexedY = (function (_super) {
        __extends(CompareAccumulatorIndirectIndexedY, _super);
        function CompareAccumulatorIndirectIndexedY() {
            _super.call(this, "CMP", 0x02, OpCodes.ModeIndexedIndirectY, 0xD1);
        }
        CompareAccumulatorIndirectIndexedY.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrIndirectIndexedY());
            cpu.compareWithFlags(cpu.rA, targetValue);
        };
        return CompareAccumulatorIndirectIndexedY;
    })(BaseOpCode);
    Emulator.CompareAccumulatorIndirectIndexedY = CompareAccumulatorIndirectIndexedY;
    registeredOperations.push(CompareAccumulatorIndirectIndexedY);

    /* ===========
    === CPX ===
    =========== */
    var CompareXImmediate = (function (_super) {
        __extends(CompareXImmediate, _super);
        function CompareXImmediate() {
            _super.call(this, "CPX", 0x02, OpCodes.ModeImmediate, 0xE0);
        }
        CompareXImmediate.prototype.execute = function (cpu) {
            cpu.compareWithFlags(cpu.rX, cpu.addrPop());
        };
        return CompareXImmediate;
    })(BaseOpCode);
    Emulator.CompareXImmediate = CompareXImmediate;
    registeredOperations.push(CompareXImmediate);

    var CompareXZeroPage = (function (_super) {
        __extends(CompareXZeroPage, _super);
        function CompareXZeroPage() {
            _super.call(this, "CPX", 0x02, OpCodes.ModeZeroPage, 0xE4);
        }
        CompareXZeroPage.prototype.execute = function (cpu) {
            var zeroPage = cpu.addrPop();
            cpu.compareWithFlags(cpu.rX, cpu.peek(zeroPage));
        };
        return CompareXZeroPage;
    })(BaseOpCode);
    Emulator.CompareXZeroPage = CompareXZeroPage;
    registeredOperations.push(CompareXZeroPage);

    var CompareXAbsolute = (function (_super) {
        __extends(CompareXAbsolute, _super);
        function CompareXAbsolute() {
            _super.call(this, "CPX", 0x03, OpCodes.ModeAbsolute, 0xEC);
        }
        CompareXAbsolute.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrPopWord());
            cpu.compareWithFlags(cpu.rX, targetValue);
        };
        return CompareXAbsolute;
    })(BaseOpCode);
    Emulator.CompareXAbsolute = CompareXAbsolute;
    registeredOperations.push(CompareXAbsolute);

    /* ===========
    === CPY ===
    =========== */
    var CompareYImmediate = (function (_super) {
        __extends(CompareYImmediate, _super);
        function CompareYImmediate() {
            _super.call(this, "CPY", 0x02, OpCodes.ModeImmediate, 0xC0);
        }
        CompareYImmediate.prototype.execute = function (cpu) {
            cpu.compareWithFlags(cpu.rY, cpu.addrPop());
        };
        return CompareYImmediate;
    })(BaseOpCode);
    Emulator.CompareYImmediate = CompareYImmediate;
    registeredOperations.push(CompareYImmediate);

    var CompareYZeroPage = (function (_super) {
        __extends(CompareYZeroPage, _super);
        function CompareYZeroPage() {
            _super.call(this, "CPY", 0x02, OpCodes.ModeZeroPage, 0xC4);
        }
        CompareYZeroPage.prototype.execute = function (cpu) {
            var zeroPage = cpu.addrPop();
            cpu.compareWithFlags(cpu.rY, cpu.peek(zeroPage));
        };
        return CompareYZeroPage;
    })(BaseOpCode);
    Emulator.CompareYZeroPage = CompareYZeroPage;
    registeredOperations.push(CompareYZeroPage);

    var CompareYAbsolute = (function (_super) {
        __extends(CompareYAbsolute, _super);
        function CompareYAbsolute() {
            _super.call(this, "CPY", 0x03, OpCodes.ModeAbsolute, 0xCC);
        }
        CompareYAbsolute.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrPopWord());
            cpu.compareWithFlags(cpu.rY, targetValue);
        };
        return CompareYAbsolute;
    })(BaseOpCode);
    Emulator.CompareYAbsolute = CompareYAbsolute;
    registeredOperations.push(CompareYAbsolute);

    var DecXSingle = (function (_super) {
        __extends(DecXSingle, _super);
        function DecXSingle() {
            _super.call(this, "DEX", 0x01, OpCodes.ModeSingle, 0xCA);
        }
        DecXSingle.prototype.execute = function (cpu) {
            cpu.rX -= 1;
            if (cpu.rX < 0) {
                cpu.rX = Constants.Memory.ByteMask;
            }
            cpu.setFlags(cpu.rX);
        };
        return DecXSingle;
    })(BaseOpCode);
    Emulator.DecXSingle = DecXSingle;
    registeredOperations.push(DecXSingle);

    var DecYSingle = (function (_super) {
        __extends(DecYSingle, _super);
        function DecYSingle() {
            _super.call(this, "DEY", 0x01, OpCodes.ModeSingle, 0x88);
        }
        DecYSingle.prototype.execute = function (cpu) {
            cpu.rY -= 1;
            if (cpu.rY < 0) {
                cpu.rY = Constants.Memory.ByteMask;
            }
            cpu.setFlags(cpu.rY);
        };
        return DecYSingle;
    })(BaseOpCode);
    Emulator.DecYSingle = DecYSingle;
    registeredOperations.push(DecYSingle);

    /* ===========
    === EOR ===
    =========== */
    var ExclusiveOrImmediate = (function (_super) {
        __extends(ExclusiveOrImmediate, _super);
        function ExclusiveOrImmediate() {
            _super.call(this, "EOR", 0x02, OpCodes.ModeImmediate, 0x49);
        }
        ExclusiveOrImmediate.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA ^ cpu.addrPop();
            cpu.setFlags(cpu.rA);
        };
        return ExclusiveOrImmediate;
    })(BaseOpCode);
    Emulator.ExclusiveOrImmediate = ExclusiveOrImmediate;
    registeredOperations.push(ExclusiveOrImmediate);

    var ExclusiveOrZeroPage = (function (_super) {
        __extends(ExclusiveOrZeroPage, _super);
        function ExclusiveOrZeroPage() {
            _super.call(this, "EOR", 0x02, OpCodes.ModeZeroPage, 0x45);
        }
        ExclusiveOrZeroPage.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA ^ cpu.peek(cpu.addrPop());
            cpu.setFlags(cpu.rA);
        };
        return ExclusiveOrZeroPage;
    })(BaseOpCode);
    Emulator.ExclusiveOrZeroPage = ExclusiveOrZeroPage;
    registeredOperations.push(ExclusiveOrZeroPage);

    var ExclusiveOrZeroPageX = (function (_super) {
        __extends(ExclusiveOrZeroPageX, _super);
        function ExclusiveOrZeroPageX() {
            _super.call(this, "EOR", 0x02, OpCodes.ModeZeroPageX, 0x55);
        }
        ExclusiveOrZeroPageX.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA ^ cpu.peek(cpu.addrZeroPageX());
            cpu.setFlags(cpu.rA);
        };
        return ExclusiveOrZeroPageX;
    })(BaseOpCode);
    Emulator.ExclusiveOrZeroPageX = ExclusiveOrZeroPageX;
    registeredOperations.push(ExclusiveOrZeroPageX);

    var ExclusiveOrAbsolute = (function (_super) {
        __extends(ExclusiveOrAbsolute, _super);
        function ExclusiveOrAbsolute() {
            _super.call(this, "EOR", 0x03, OpCodes.ModeAbsolute, 0x4D);
        }
        ExclusiveOrAbsolute.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA ^ cpu.peek(cpu.addrPopWord());
            cpu.setFlags(cpu.rA);
        };
        return ExclusiveOrAbsolute;
    })(BaseOpCode);
    Emulator.ExclusiveOrAbsolute = ExclusiveOrAbsolute;
    registeredOperations.push(ExclusiveOrAbsolute);

    var ExclusiveOrAbsoluteX = (function (_super) {
        __extends(ExclusiveOrAbsoluteX, _super);
        function ExclusiveOrAbsoluteX() {
            _super.call(this, "EOR", 0x03, OpCodes.ModeAbsoluteX, 0x5D);
        }
        ExclusiveOrAbsoluteX.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA ^ cpu.peek(cpu.addrAbsoluteX());
            cpu.setFlags(cpu.rA);
        };
        return ExclusiveOrAbsoluteX;
    })(BaseOpCode);
    Emulator.ExclusiveOrAbsoluteX = ExclusiveOrAbsoluteX;
    registeredOperations.push(ExclusiveOrAbsoluteX);

    var ExclusiveOrAbsoluteY = (function (_super) {
        __extends(ExclusiveOrAbsoluteY, _super);
        function ExclusiveOrAbsoluteY() {
            _super.call(this, "EOR", 0x03, OpCodes.ModeAbsoluteY, 0x59);
        }
        ExclusiveOrAbsoluteY.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA ^ cpu.peek(cpu.addrAbsoluteY());
            cpu.setFlags(cpu.rA);
        };
        return ExclusiveOrAbsoluteY;
    })(BaseOpCode);
    Emulator.ExclusiveOrAbsoluteY = ExclusiveOrAbsoluteY;
    registeredOperations.push(ExclusiveOrAbsoluteY);

    var ExclusiveOrIndirectX = (function (_super) {
        __extends(ExclusiveOrIndirectX, _super);
        function ExclusiveOrIndirectX() {
            _super.call(this, "EOR", 0x02, OpCodes.ModeIndexedIndirectX, 0x41);
        }
        ExclusiveOrIndirectX.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA ^ cpu.peek(cpu.addrIndexedIndirectX());
            cpu.setFlags(cpu.rA);
        };
        return ExclusiveOrIndirectX;
    })(BaseOpCode);
    Emulator.ExclusiveOrIndirectX = ExclusiveOrIndirectX;
    registeredOperations.push(ExclusiveOrIndirectX);

    var ExclusiveOrIndirectY = (function (_super) {
        __extends(ExclusiveOrIndirectY, _super);
        function ExclusiveOrIndirectY() {
            _super.call(this, "EOR", 0x02, OpCodes.ModeIndexedIndirectY, 0x51);
        }
        ExclusiveOrIndirectY.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA ^ cpu.peek(cpu.addrIndirectIndexedY());
            cpu.setFlags(cpu.rA);
        };
        return ExclusiveOrIndirectY;
    })(BaseOpCode);
    Emulator.ExclusiveOrIndirectY = ExclusiveOrIndirectY;
    registeredOperations.push(ExclusiveOrIndirectY);

    /* =======================
    === Flag Operations ===
    ======================= */
    var ClearCarrySingle = (function (_super) {
        __extends(ClearCarrySingle, _super);
        function ClearCarrySingle() {
            _super.call(this, "CLC", 0x01, OpCodes.ModeSingle, 0x18);
        }
        ClearCarrySingle.prototype.execute = function (cpu) {
            cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, false);
        };
        return ClearCarrySingle;
    })(BaseOpCode);
    Emulator.ClearCarrySingle = ClearCarrySingle;
    registeredOperations.push(ClearCarrySingle);

    var SetCarrySingle = (function (_super) {
        __extends(SetCarrySingle, _super);
        function SetCarrySingle() {
            _super.call(this, "SEC", 0x01, OpCodes.ModeSingle, 0x38);
        }
        SetCarrySingle.prototype.execute = function (cpu) {
            cpu.setFlag(Constants.ProcessorStatus.CarryFlagSet, true);
        };
        return SetCarrySingle;
    })(BaseOpCode);
    Emulator.SetCarrySingle = SetCarrySingle;
    registeredOperations.push(SetCarrySingle);

    var ClearOverflowSingle = (function (_super) {
        __extends(ClearOverflowSingle, _super);
        function ClearOverflowSingle() {
            _super.call(this, "CLV", 0x01, OpCodes.ModeSingle, 0xB8);
        }
        ClearOverflowSingle.prototype.execute = function (cpu) {
            cpu.setFlag(Constants.ProcessorStatus.OverflowFlagSet, false);
        };
        return ClearOverflowSingle;
    })(BaseOpCode);
    Emulator.ClearOverflowSingle = ClearOverflowSingle;
    registeredOperations.push(ClearOverflowSingle);

    var ClearDecimalSingle = (function (_super) {
        __extends(ClearDecimalSingle, _super);
        function ClearDecimalSingle() {
            _super.call(this, "CLD", 0x01, OpCodes.ModeSingle, 0xD8);
        }
        ClearDecimalSingle.prototype.execute = function (cpu) {
            cpu.setFlag(Constants.ProcessorStatus.DecimalFlagSet, false);
        };
        return ClearDecimalSingle;
    })(BaseOpCode);
    Emulator.ClearDecimalSingle = ClearDecimalSingle;
    registeredOperations.push(ClearDecimalSingle);

    var SetDecimalSingle = (function (_super) {
        __extends(SetDecimalSingle, _super);
        function SetDecimalSingle() {
            _super.call(this, "SED", 0x01, OpCodes.ModeSingle, 0xF8);
        }
        SetDecimalSingle.prototype.execute = function (cpu) {
            cpu.setFlag(Constants.ProcessorStatus.DecimalFlagSet, true);
        };
        return SetDecimalSingle;
    })(BaseOpCode);
    Emulator.SetDecimalSingle = SetDecimalSingle;
    registeredOperations.push(SetDecimalSingle);

    /* ==================
    === Invalid OP ===
    ================== */
    var InvalidOp = (function (_super) {
        __extends(InvalidOp, _super);
        function InvalidOp(value) {
            _super.call(this, "???", 0x01, OpCodes.ModeSingle, value & Constants.Memory.ByteMask);
        }
        InvalidOp.prototype.execute = function (cpu) {
            var prev = cpu.rPC - 1;
            var opCode = cpu.peek(prev);
            throw "Invalid op code 0x" + opCode.toString(16).toUpperCase() + " encountered at $" + prev.toString(16).toUpperCase();
        };
        return InvalidOp;
    })(BaseOpCode);
    Emulator.InvalidOp = InvalidOp;

    /* =================
    === INC (X,Y) ===
    ================= */
    var IncAbsolute = (function (_super) {
        __extends(IncAbsolute, _super);
        function IncAbsolute() {
            _super.call(this, "INC", 0x03, OpCodes.ModeAbsolute, 0xEE);
        }
        IncAbsolute.prototype.execute = function (cpu) {
            var target = cpu.addrPopWord();
            var value = cpu.peek(target);
            value = (value + 1) & Constants.Memory.ByteMask;
            cpu.poke(target, value);
            cpu.setFlags(value);
        };
        return IncAbsolute;
    })(BaseOpCode);
    Emulator.IncAbsolute = IncAbsolute;
    registeredOperations.push(IncAbsolute);

    var IncAbsoluteX = (function (_super) {
        __extends(IncAbsoluteX, _super);
        function IncAbsoluteX() {
            _super.call(this, "INC", 0x03, OpCodes.ModeAbsoluteX, 0xFE);
        }
        IncAbsoluteX.prototype.execute = function (cpu) {
            var target = cpu.addrAbsoluteX();
            var value = cpu.peek(target);
            value = (value + 1) & Constants.Memory.ByteMask;
            cpu.poke(target, value);
            cpu.setFlags(value);
        };
        return IncAbsoluteX;
    })(BaseOpCode);
    Emulator.IncAbsoluteX = IncAbsoluteX;
    registeredOperations.push(IncAbsoluteX);

    var IncZeroPage = (function (_super) {
        __extends(IncZeroPage, _super);
        function IncZeroPage() {
            _super.call(this, "INC", 0x02, OpCodes.ModeZeroPage, 0xE6);
        }
        IncZeroPage.prototype.execute = function (cpu) {
            var target = cpu.addrPop();
            var value = cpu.peek(target);
            value = (value + 1) & Constants.Memory.ByteMask;
            cpu.poke(target, value);
            cpu.setFlags(value);
        };
        return IncZeroPage;
    })(BaseOpCode);
    Emulator.IncZeroPage = IncZeroPage;
    registeredOperations.push(IncZeroPage);

    var IncZeroPageX = (function (_super) {
        __extends(IncZeroPageX, _super);
        function IncZeroPageX() {
            _super.call(this, "INC", 0x02, OpCodes.ModeZeroPageX, 0xF6);
        }
        IncZeroPageX.prototype.execute = function (cpu) {
            var target = cpu.addrZeroPageX();
            var value = cpu.peek(target);
            value = (value + 1) & Constants.Memory.ByteMask;
            cpu.poke(target, value);
            cpu.setFlags(value);
        };
        return IncZeroPageX;
    })(BaseOpCode);
    Emulator.IncZeroPageX = IncZeroPageX;
    registeredOperations.push(IncZeroPage);

    var IncYSingle = (function (_super) {
        __extends(IncYSingle, _super);
        function IncYSingle() {
            _super.call(this, "INY", 0x01, OpCodes.ModeSingle, 0xC8);
        }
        IncYSingle.prototype.execute = function (cpu) {
            cpu.rY = ((cpu.rY) + 1) & Constants.Memory.ByteMask;
            cpu.setFlags(cpu.rY);
        };
        return IncYSingle;
    })(BaseOpCode);
    Emulator.IncYSingle = IncYSingle;
    registeredOperations.push(IncYSingle);

    var IncrementXSingle = (function (_super) {
        __extends(IncrementXSingle, _super);
        function IncrementXSingle() {
            _super.call(this, "INX", 0x01, OpCodes.ModeSingle, 0xE8);
        }
        IncrementXSingle.prototype.execute = function (cpu) {
            cpu.rX = (cpu.rX + 1) & Constants.Memory.ByteMask;
            cpu.setFlags(cpu.rX);
        };
        return IncrementXSingle;
    })(BaseOpCode);
    Emulator.IncrementXSingle = IncrementXSingle;
    registeredOperations.push(IncrementXSingle);

    /* ===========
    === JMP ===
    =========== */
    var JmpIndirect = (function (_super) {
        __extends(JmpIndirect, _super);
        function JmpIndirect() {
            _super.call(this, "JMP", 0x03, OpCodes.ModeIndirect, 0x6C);
        }
        JmpIndirect.prototype.execute = function (cpu) {
            cpu.rPC = cpu.addrIndirect();
        };
        return JmpIndirect;
    })(BaseOpCode);
    Emulator.JmpIndirect = JmpIndirect;
    registeredOperations.push(JmpIndirect);

    var JmpAbsolute = (function (_super) {
        __extends(JmpAbsolute, _super);
        function JmpAbsolute() {
            _super.call(this, "JMP", 0x03, OpCodes.ModeAbsolute, 0x4C);
        }
        JmpAbsolute.prototype.execute = function (cpu) {
            var newAddress = cpu.addrPopWord();
            cpu.rPC = newAddress;
        };
        return JmpAbsolute;
    })(BaseOpCode);
    Emulator.JmpAbsolute = JmpAbsolute;
    registeredOperations.push(JmpAbsolute);

    var JmpSubroutineAbsolute = (function (_super) {
        __extends(JmpSubroutineAbsolute, _super);
        function JmpSubroutineAbsolute() {
            _super.call(this, "JSR", 0x03, OpCodes.ModeAbsolute, 0x20);
        }
        JmpSubroutineAbsolute.prototype.execute = function (cpu) {
            var newAddress = cpu.addrPopWord();
            cpu.stackPush(((cpu.rPC - 1) >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
            cpu.stackPush((cpu.rPC - 1) & (Constants.Memory.ByteMask));
            cpu.rPC = newAddress;
        };
        return JmpSubroutineAbsolute;
    })(BaseOpCode);
    Emulator.JmpSubroutineAbsolute = JmpSubroutineAbsolute;
    registeredOperations.push(JmpSubroutineAbsolute);

    var LoadAccumulatorImmediate = (function (_super) {
        __extends(LoadAccumulatorImmediate, _super);
        function LoadAccumulatorImmediate() {
            _super.call(this, "LDA", 0x02, OpCodes.ModeImmediate, 0xA9);
        }
        LoadAccumulatorImmediate.prototype.execute = function (cpu) {
            cpu.rA = cpu.addrPop();
            cpu.setFlags(cpu.rA);
        };
        return LoadAccumulatorImmediate;
    })(BaseOpCode);
    Emulator.LoadAccumulatorImmediate = LoadAccumulatorImmediate;
    registeredOperations.push(LoadAccumulatorImmediate);

    var LoadAccumulatorAbsolute = (function (_super) {
        __extends(LoadAccumulatorAbsolute, _super);
        function LoadAccumulatorAbsolute() {
            _super.call(this, "LDA", 0x03, OpCodes.ModeAbsolute, 0xAD);
        }
        LoadAccumulatorAbsolute.prototype.execute = function (cpu) {
            var memory = cpu.addrPopWord();
            cpu.rA = cpu.peek(memory);
            cpu.setFlags(cpu.rA);
        };
        return LoadAccumulatorAbsolute;
    })(BaseOpCode);
    Emulator.LoadAccumulatorAbsolute = LoadAccumulatorAbsolute;
    registeredOperations.push(LoadAccumulatorAbsolute);

    var LoadAccumulatorAbsoluteX = (function (_super) {
        __extends(LoadAccumulatorAbsoluteX, _super);
        function LoadAccumulatorAbsoluteX() {
            _super.call(this, "LDA", 0x03, OpCodes.ModeAbsoluteX, 0xBD);
        }
        LoadAccumulatorAbsoluteX.prototype.execute = function (cpu) {
            cpu.rA = cpu.peek(cpu.addrAbsoluteX());
            cpu.setFlags(cpu.rA);
        };
        return LoadAccumulatorAbsoluteX;
    })(BaseOpCode);
    Emulator.LoadAccumulatorAbsoluteX = LoadAccumulatorAbsoluteX;
    registeredOperations.push(LoadAccumulatorAbsoluteX);

    var LoadAccumulatorZeroPage = (function (_super) {
        __extends(LoadAccumulatorZeroPage, _super);
        function LoadAccumulatorZeroPage() {
            _super.call(this, "LDA", 0x02, OpCodes.ModeZeroPage, 0xA5);
        }
        LoadAccumulatorZeroPage.prototype.execute = function (cpu) {
            cpu.rA = cpu.peek(cpu.addrPop());
            cpu.setFlags(cpu.rA);
        };
        return LoadAccumulatorZeroPage;
    })(BaseOpCode);
    Emulator.LoadAccumulatorZeroPage = LoadAccumulatorZeroPage;
    registeredOperations.push(LoadAccumulatorZeroPage);

    var LoadAccumulatorIndexedIndirectY = (function (_super) {
        __extends(LoadAccumulatorIndexedIndirectY, _super);
        function LoadAccumulatorIndexedIndirectY() {
            _super.call(this, "LDA", 0x02, OpCodes.ModeIndexedIndirectY, 0xB1);
        }
        LoadAccumulatorIndexedIndirectY.prototype.execute = function (cpu) {
            cpu.rA = cpu.peek(cpu.addrIndirectIndexedY());
            cpu.setFlags(cpu.rA);
        };
        return LoadAccumulatorIndexedIndirectY;
    })(BaseOpCode);
    Emulator.LoadAccumulatorIndexedIndirectY = LoadAccumulatorIndexedIndirectY;
    registeredOperations.push(LoadAccumulatorIndexedIndirectY);

    var LoadYRegisterAbsolute = (function (_super) {
        __extends(LoadYRegisterAbsolute, _super);
        function LoadYRegisterAbsolute() {
            _super.call(this, "LDY", 0x03, OpCodes.ModeAbsolute, 0xAC);
        }
        LoadYRegisterAbsolute.prototype.execute = function (cpu) {
            var target = cpu.addrPopWord();
            cpu.rY = cpu.peek(target);
            cpu.setFlags(cpu.rY);
        };
        return LoadYRegisterAbsolute;
    })(BaseOpCode);
    Emulator.LoadYRegisterAbsolute = LoadYRegisterAbsolute;
    registeredOperations.push(LoadYRegisterAbsolute);

    var LoadYRegisterImmediate = (function (_super) {
        __extends(LoadYRegisterImmediate, _super);
        function LoadYRegisterImmediate() {
            _super.call(this, "LDY", 0x02, OpCodes.ModeImmediate, 0xA0);
        }
        LoadYRegisterImmediate.prototype.execute = function (cpu) {
            cpu.rY = cpu.addrPop();
            cpu.setFlags(cpu.rY);
        };
        return LoadYRegisterImmediate;
    })(BaseOpCode);
    Emulator.LoadYRegisterImmediate = LoadYRegisterImmediate;
    registeredOperations.push(LoadYRegisterImmediate);

    var LoadYRegisterZeroPage = (function (_super) {
        __extends(LoadYRegisterZeroPage, _super);
        function LoadYRegisterZeroPage() {
            _super.call(this, "LDY", 0x02, OpCodes.ModeZeroPage, 0xA4);
        }
        LoadYRegisterZeroPage.prototype.execute = function (cpu) {
            var zeroPage = cpu.addrPop();
            cpu.rY = cpu.peek(zeroPage);
            cpu.setFlags(cpu.rY);
        };
        return LoadYRegisterZeroPage;
    })(BaseOpCode);
    Emulator.LoadYRegisterZeroPage = LoadYRegisterZeroPage;
    registeredOperations.push(LoadYRegisterZeroPage);

    var LoadXRegisterImmediate = (function () {
        function LoadXRegisterImmediate() {
            this.opName = "LDX";
            this.sizeBytes = 0x02;
            this.addressingMode = OpCodes.ModeImmediate;
            this.opCode = 0xa2;
        }
        LoadXRegisterImmediate.prototype.decompile = function (address, bytes) {
            return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), this.opName, "#$" + OpCodes.ToByte(bytes[1]));
        };

        LoadXRegisterImmediate.prototype.execute = function (cpu) {
            cpu.rX = cpu.addrPop();
            cpu.setFlags(cpu.rX);
        };
        return LoadXRegisterImmediate;
    })();
    Emulator.LoadXRegisterImmediate = LoadXRegisterImmediate;

    registeredOperations.push(LoadXRegisterImmediate);

    var LoadXRegisterZeroPage = (function () {
        function LoadXRegisterZeroPage() {
            this.opName = "LDX";
            this.sizeBytes = 0x02;
            this.addressingMode = OpCodes.ModeZeroPage;
            this.opCode = 0xa6;
        }
        LoadXRegisterZeroPage.prototype.decompile = function (address, bytes) {
            return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), this.opName, "$" + OpCodes.ToByte(bytes[1]));
        };

        LoadXRegisterZeroPage.prototype.execute = function (cpu) {
            var zeroPage = cpu.addrPop();
            cpu.rX = cpu.peek(zeroPage);
            cpu.setFlags(cpu.rX);
        };
        return LoadXRegisterZeroPage;
    })();
    Emulator.LoadXRegisterZeroPage = LoadXRegisterZeroPage;

    registeredOperations.push(LoadXRegisterZeroPage);

    /* ===========
    === NOP ===
    =========== */
    var NoOperationSingle = (function (_super) {
        __extends(NoOperationSingle, _super);
        function NoOperationSingle() {
            _super.call(this, "NOP", 0x01, OpCodes.ModeSingle, 0xEA);
        }
        NoOperationSingle.prototype.execute = function (cpu) {
            return;
        };
        return NoOperationSingle;
    })(BaseOpCode);
    Emulator.NoOperationSingle = NoOperationSingle;
    registeredOperations.push(NoOperationSingle);

    /* ===========
    === ORA ===
    =========== */
    var OrImmediate = (function (_super) {
        __extends(OrImmediate, _super);
        function OrImmediate() {
            _super.call(this, "ORA", 0x02, OpCodes.ModeImmediate, 0x09);
        }
        OrImmediate.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA | cpu.addrPop();
            cpu.setFlags(cpu.rA);
        };
        return OrImmediate;
    })(BaseOpCode);
    Emulator.OrImmediate = OrImmediate;
    registeredOperations.push(OrImmediate);

    var OrZeroPage = (function (_super) {
        __extends(OrZeroPage, _super);
        function OrZeroPage() {
            _super.call(this, "ORA", 0x02, OpCodes.ModeZeroPage, 0x05);
        }
        OrZeroPage.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA | cpu.peek(cpu.addrPop());
            cpu.setFlags(cpu.rA);
        };
        return OrZeroPage;
    })(BaseOpCode);
    Emulator.OrZeroPage = OrZeroPage;
    registeredOperations.push(OrZeroPage);

    var OrZeroPageX = (function (_super) {
        __extends(OrZeroPageX, _super);
        function OrZeroPageX() {
            _super.call(this, "ORA", 0x02, OpCodes.ModeZeroPageX, 0x15);
        }
        OrZeroPageX.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA | cpu.peek(cpu.addrZeroPageX());
            cpu.setFlags(cpu.rA);
        };
        return OrZeroPageX;
    })(BaseOpCode);
    Emulator.OrZeroPageX = OrZeroPageX;
    registeredOperations.push(OrZeroPageX);

    var OrAbsolute = (function (_super) {
        __extends(OrAbsolute, _super);
        function OrAbsolute() {
            _super.call(this, "ORA", 0x03, OpCodes.ModeAbsolute, 0x0D);
        }
        OrAbsolute.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA | cpu.peek(cpu.addrPopWord());
            cpu.setFlags(cpu.rA);
        };
        return OrAbsolute;
    })(BaseOpCode);
    Emulator.OrAbsolute = OrAbsolute;
    registeredOperations.push(OrAbsolute);

    var OrAbsoluteX = (function (_super) {
        __extends(OrAbsoluteX, _super);
        function OrAbsoluteX() {
            _super.call(this, "ORA", 0x03, OpCodes.ModeAbsoluteX, 0x1D);
        }
        OrAbsoluteX.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA | cpu.peek(cpu.addrAbsoluteX());
            cpu.setFlags(cpu.rA);
        };
        return OrAbsoluteX;
    })(BaseOpCode);
    Emulator.OrAbsoluteX = OrAbsoluteX;
    registeredOperations.push(OrAbsoluteX);

    var OrAbsoluteY = (function (_super) {
        __extends(OrAbsoluteY, _super);
        function OrAbsoluteY() {
            _super.call(this, "ORA", 0x03, OpCodes.ModeAbsoluteY, 0x19);
        }
        OrAbsoluteY.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA | cpu.peek(cpu.addrAbsoluteY());
            cpu.setFlags(cpu.rA);
        };
        return OrAbsoluteY;
    })(BaseOpCode);
    Emulator.OrAbsoluteY = OrAbsoluteY;
    registeredOperations.push(OrAbsoluteY);

    var OrIndirectX = (function (_super) {
        __extends(OrIndirectX, _super);
        function OrIndirectX() {
            _super.call(this, "ORA", 0x02, OpCodes.ModeIndexedIndirectX, 0x01);
        }
        OrIndirectX.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA | cpu.peek(cpu.addrIndexedIndirectX());
            cpu.setFlags(cpu.rA);
        };
        return OrIndirectX;
    })(BaseOpCode);
    Emulator.OrIndirectX = OrIndirectX;
    registeredOperations.push(OrIndirectX);

    var OrIndirectY = (function (_super) {
        __extends(OrIndirectY, _super);
        function OrIndirectY() {
            _super.call(this, "ORA", 0x02, OpCodes.ModeIndexedIndirectY, 0x11);
        }
        OrIndirectY.prototype.execute = function (cpu) {
            cpu.rA = cpu.rA | cpu.peek(cpu.addrIndirectIndexedY());
            cpu.setFlags(cpu.rA);
        };
        return OrIndirectY;
    })(BaseOpCode);
    Emulator.OrIndirectY = OrIndirectY;
    registeredOperations.push(OrIndirectY);

    /* ===========
    === RTS ===
    =========== */
    var RtsSingle = (function (_super) {
        __extends(RtsSingle, _super);
        function RtsSingle() {
            _super.call(this, "RTS", 0x01, OpCodes.ModeSingle, 0x60);
        }
        RtsSingle.prototype.execute = function (cpu) {
            cpu.stackRts();
        };
        return RtsSingle;
    })(BaseOpCode);
    Emulator.RtsSingle = RtsSingle;
    registeredOperations.push(RtsSingle);

    /* ==========================
    === Stack Instructions ===
    ========================== */
    var PullProcessorStatusSingle = (function (_super) {
        __extends(PullProcessorStatusSingle, _super);
        function PullProcessorStatusSingle() {
            _super.call(this, "PLP", 0x01, OpCodes.ModeSingle, 0x28);
        }
        PullProcessorStatusSingle.prototype.execute = function (cpu) {
            cpu.rP = cpu.stackPop();
        };
        return PullProcessorStatusSingle;
    })(BaseOpCode);
    Emulator.PullProcessorStatusSingle = PullProcessorStatusSingle;
    registeredOperations.push(PullProcessorStatusSingle);

    var PushProcessorStatusSingle = (function (_super) {
        __extends(PushProcessorStatusSingle, _super);
        function PushProcessorStatusSingle() {
            _super.call(this, "PHP", 0x01, OpCodes.ModeSingle, 0x08);
        }
        PushProcessorStatusSingle.prototype.execute = function (cpu) {
            cpu.stackPush(cpu.rP);
        };
        return PushProcessorStatusSingle;
    })(BaseOpCode);
    Emulator.PushProcessorStatusSingle = PushProcessorStatusSingle;
    registeredOperations.push(PushProcessorStatusSingle);

    var PullAccumulatorSingle = (function (_super) {
        __extends(PullAccumulatorSingle, _super);
        function PullAccumulatorSingle() {
            _super.call(this, "PLA", 0x01, OpCodes.ModeSingle, 0x68);
        }
        PullAccumulatorSingle.prototype.execute = function (cpu) {
            cpu.rA = cpu.stackPop();
            cpu.setFlags(cpu.rA);
        };
        return PullAccumulatorSingle;
    })(BaseOpCode);
    Emulator.PullAccumulatorSingle = PullAccumulatorSingle;
    registeredOperations.push(PullAccumulatorSingle);

    var PushAccumulatorSingle = (function (_super) {
        __extends(PushAccumulatorSingle, _super);
        function PushAccumulatorSingle() {
            _super.call(this, "PHA", 0x01, OpCodes.ModeSingle, 0x48);
        }
        PushAccumulatorSingle.prototype.execute = function (cpu) {
            cpu.stackPush(cpu.rA);
        };
        return PushAccumulatorSingle;
    })(BaseOpCode);
    Emulator.PushAccumulatorSingle = PushAccumulatorSingle;
    registeredOperations.push(PushAccumulatorSingle);

    var TransferXRegisterToStackPointerSingle = (function (_super) {
        __extends(TransferXRegisterToStackPointerSingle, _super);
        function TransferXRegisterToStackPointerSingle() {
            _super.call(this, "TXS", 0x01, OpCodes.ModeSingle, 0x9A);
        }
        TransferXRegisterToStackPointerSingle.prototype.execute = function (cpu) {
            cpu.rSP = cpu.rX;
        };
        return TransferXRegisterToStackPointerSingle;
    })(BaseOpCode);
    Emulator.TransferXRegisterToStackPointerSingle = TransferXRegisterToStackPointerSingle;
    registeredOperations.push(TransferXRegisterToStackPointerSingle);

    var TransferStackPointerToXRegisterSingle = (function (_super) {
        __extends(TransferStackPointerToXRegisterSingle, _super);
        function TransferStackPointerToXRegisterSingle() {
            _super.call(this, "TSX", 0x01, OpCodes.ModeSingle, 0xBA);
        }
        TransferStackPointerToXRegisterSingle.prototype.execute = function (cpu) {
            cpu.rX = cpu.rSP;
        };
        return TransferStackPointerToXRegisterSingle;
    })(BaseOpCode);
    Emulator.TransferStackPointerToXRegisterSingle = TransferStackPointerToXRegisterSingle;
    registeredOperations.push(TransferStackPointerToXRegisterSingle);

    /* ===========
    === STA ===
    =========== */
    var StoreAccumulatorAbsolute = (function (_super) {
        __extends(StoreAccumulatorAbsolute, _super);
        function StoreAccumulatorAbsolute() {
            _super.call(this, "STA", 0x03, OpCodes.ModeAbsolute, 0x8D);
        }
        StoreAccumulatorAbsolute.prototype.execute = function (cpu) {
            var targetAddress = cpu.addrPopWord();
            cpu.poke(targetAddress, cpu.rA);
        };
        return StoreAccumulatorAbsolute;
    })(BaseOpCode);
    Emulator.StoreAccumulatorAbsolute = StoreAccumulatorAbsolute;
    registeredOperations.push(StoreAccumulatorAbsolute);

    var StoreAccumulatorAbsoluteX = (function (_super) {
        __extends(StoreAccumulatorAbsoluteX, _super);
        function StoreAccumulatorAbsoluteX() {
            _super.call(this, "STA", 0x03, OpCodes.ModeAbsoluteX, 0x9D);
        }
        StoreAccumulatorAbsoluteX.prototype.execute = function (cpu) {
            cpu.poke(cpu.addrAbsoluteX(), cpu.rA);
        };
        return StoreAccumulatorAbsoluteX;
    })(BaseOpCode);
    Emulator.StoreAccumulatorAbsoluteX = StoreAccumulatorAbsoluteX;
    registeredOperations.push(StoreAccumulatorAbsoluteX);

    var StoreAccumulatorAbsoluteY = (function (_super) {
        __extends(StoreAccumulatorAbsoluteY, _super);
        function StoreAccumulatorAbsoluteY() {
            _super.call(this, "STA", 0x03, OpCodes.ModeAbsoluteY, 0x99);
        }
        StoreAccumulatorAbsoluteY.prototype.execute = function (cpu) {
            cpu.poke(cpu.addrAbsoluteY(), cpu.rA);
        };
        return StoreAccumulatorAbsoluteY;
    })(BaseOpCode);
    Emulator.StoreAccumulatorAbsoluteY = StoreAccumulatorAbsoluteY;
    registeredOperations.push(StoreAccumulatorAbsoluteY);

    var StoreAccumulatorIndirectY = (function (_super) {
        __extends(StoreAccumulatorIndirectY, _super);
        function StoreAccumulatorIndirectY() {
            _super.call(this, "STA", 0x02, OpCodes.ModeIndexedIndirectY, 0x91);
        }
        StoreAccumulatorIndirectY.prototype.execute = function (cpu) {
            cpu.poke(cpu.addrIndirectIndexedY(), cpu.rA);
        };
        return StoreAccumulatorIndirectY;
    })(BaseOpCode);
    Emulator.StoreAccumulatorIndirectY = StoreAccumulatorIndirectY;
    registeredOperations.push(StoreAccumulatorIndirectY);

    var StoreAccumulatorIndirectX = (function (_super) {
        __extends(StoreAccumulatorIndirectX, _super);
        function StoreAccumulatorIndirectX() {
            _super.call(this, "STA", 0x02, OpCodes.ModeIndexedIndirectX, 0xA1);
        }
        StoreAccumulatorIndirectX.prototype.execute = function (cpu) {
            cpu.poke(cpu.addrIndexedIndirectX(), cpu.rA);
        };
        return StoreAccumulatorIndirectX;
    })(BaseOpCode);
    Emulator.StoreAccumulatorIndirectX = StoreAccumulatorIndirectX;
    registeredOperations.push(StoreAccumulatorIndirectX);

    var StoreAccumulatorZeroPage = (function (_super) {
        __extends(StoreAccumulatorZeroPage, _super);
        function StoreAccumulatorZeroPage() {
            _super.call(this, "STA", 0x02, OpCodes.ModeZeroPage, 0x85);
        }
        StoreAccumulatorZeroPage.prototype.execute = function (cpu) {
            var zeroPage = cpu.addrPop();
            cpu.poke(zeroPage, cpu.rA);
        };
        return StoreAccumulatorZeroPage;
    })(BaseOpCode);
    Emulator.StoreAccumulatorZeroPage = StoreAccumulatorZeroPage;
    registeredOperations.push(StoreAccumulatorZeroPage);

    var StoreYRegisterAbsolute = (function (_super) {
        __extends(StoreYRegisterAbsolute, _super);
        function StoreYRegisterAbsolute() {
            _super.call(this, "STY", 0x03, OpCodes.ModeAbsolute, 0x8C);
        }
        StoreYRegisterAbsolute.prototype.execute = function (cpu) {
            var targetAddress = cpu.addrPopWord();
            cpu.poke(targetAddress, cpu.rY);
        };
        return StoreYRegisterAbsolute;
    })(BaseOpCode);
    Emulator.StoreYRegisterAbsolute = StoreYRegisterAbsolute;
    registeredOperations.push(StoreYRegisterAbsolute);

    /* ===========
    === SBC ===
    =========== */
    var SubtractWithCarryImmediate = (function (_super) {
        __extends(SubtractWithCarryImmediate, _super);
        function SubtractWithCarryImmediate() {
            _super.call(this, "SBC", 0x02, OpCodes.ModeImmediate, 0xE9);
        }
        SubtractWithCarryImmediate.prototype.execute = function (cpu) {
            OpCodes.SubtractWithCarry(cpu, cpu.addrPop());
        };
        return SubtractWithCarryImmediate;
    })(BaseOpCode);
    Emulator.SubtractWithCarryImmediate = SubtractWithCarryImmediate;
    registeredOperations.push(SubtractWithCarryImmediate);

    var SubtractWithCarryZeroPage = (function (_super) {
        __extends(SubtractWithCarryZeroPage, _super);
        function SubtractWithCarryZeroPage() {
            _super.call(this, "SBC", 0x02, OpCodes.ModeZeroPage, 0xE5);
        }
        SubtractWithCarryZeroPage.prototype.execute = function (cpu) {
            var zeroPage = cpu.addrPop();
            OpCodes.SubtractWithCarry(cpu, cpu.peek(zeroPage));
        };
        return SubtractWithCarryZeroPage;
    })(BaseOpCode);
    Emulator.SubtractWithCarryZeroPage = SubtractWithCarryZeroPage;
    registeredOperations.push(SubtractWithCarryZeroPage);

    var SubtractWithCarryZeroPageX = (function (_super) {
        __extends(SubtractWithCarryZeroPageX, _super);
        function SubtractWithCarryZeroPageX() {
            _super.call(this, "SBC", 0x02, OpCodes.ModeZeroPageX, 0xF5);
        }
        SubtractWithCarryZeroPageX.prototype.execute = function (cpu) {
            OpCodes.SubtractWithCarry(cpu, cpu.peek(cpu.addrZeroPageX()));
        };
        return SubtractWithCarryZeroPageX;
    })(BaseOpCode);
    Emulator.SubtractWithCarryZeroPageX = SubtractWithCarryZeroPageX;
    registeredOperations.push(SubtractWithCarryZeroPageX);

    var SubtractWithCarryAbsolute = (function (_super) {
        __extends(SubtractWithCarryAbsolute, _super);
        function SubtractWithCarryAbsolute() {
            _super.call(this, "SBC", 0x03, OpCodes.ModeAbsolute, 0xED);
        }
        SubtractWithCarryAbsolute.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrPopWord());
            OpCodes.SubtractWithCarry(cpu, targetValue);
        };
        return SubtractWithCarryAbsolute;
    })(BaseOpCode);
    Emulator.SubtractWithCarryAbsolute = SubtractWithCarryAbsolute;
    registeredOperations.push(SubtractWithCarryAbsolute);

    var SubtractWithCarryAbsoluteX = (function (_super) {
        __extends(SubtractWithCarryAbsoluteX, _super);
        function SubtractWithCarryAbsoluteX() {
            _super.call(this, "SBC", 0x03, OpCodes.ModeAbsoluteX, 0xFD);
        }
        SubtractWithCarryAbsoluteX.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrAbsoluteX());
            OpCodes.SubtractWithCarry(cpu, targetValue);
        };
        return SubtractWithCarryAbsoluteX;
    })(BaseOpCode);
    Emulator.SubtractWithCarryAbsoluteX = SubtractWithCarryAbsoluteX;
    registeredOperations.push(SubtractWithCarryAbsoluteX);

    var SubtractWithCarryAbsoluteY = (function (_super) {
        __extends(SubtractWithCarryAbsoluteY, _super);
        function SubtractWithCarryAbsoluteY() {
            _super.call(this, "SBC", 0x03, OpCodes.ModeAbsoluteY, 0xF9);
        }
        SubtractWithCarryAbsoluteY.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrAbsoluteY());
            OpCodes.SubtractWithCarry(cpu, targetValue);
        };
        return SubtractWithCarryAbsoluteY;
    })(BaseOpCode);
    Emulator.SubtractWithCarryAbsoluteY = SubtractWithCarryAbsoluteY;
    registeredOperations.push(SubtractWithCarryAbsoluteY);

    var SubtractWithCarryIndexedIndirectX = (function (_super) {
        __extends(SubtractWithCarryIndexedIndirectX, _super);
        function SubtractWithCarryIndexedIndirectX() {
            _super.call(this, "SBC", 0x02, OpCodes.ModeIndexedIndirectX, 0xE1);
        }
        SubtractWithCarryIndexedIndirectX.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrIndexedIndirectX());
            OpCodes.SubtractWithCarry(cpu, targetValue);
        };
        return SubtractWithCarryIndexedIndirectX;
    })(BaseOpCode);
    Emulator.SubtractWithCarryIndexedIndirectX = SubtractWithCarryIndexedIndirectX;
    registeredOperations.push(SubtractWithCarryIndexedIndirectX);

    var SubtractWithCarryIndirectIndexedY = (function (_super) {
        __extends(SubtractWithCarryIndirectIndexedY, _super);
        function SubtractWithCarryIndirectIndexedY() {
            _super.call(this, "SBC", 0x02, OpCodes.ModeIndexedIndirectY, 0xF1);
        }
        SubtractWithCarryIndirectIndexedY.prototype.execute = function (cpu) {
            var targetValue = cpu.peek(cpu.addrIndirectIndexedY());
            OpCodes.SubtractWithCarry(cpu, targetValue);
        };
        return SubtractWithCarryIndirectIndexedY;
    })(BaseOpCode);
    Emulator.SubtractWithCarryIndirectIndexedY = SubtractWithCarryIndirectIndexedY;
    registeredOperations.push(SubtractWithCarryIndirectIndexedY);

    var TransferAccumulatorToXSingle = (function (_super) {
        __extends(TransferAccumulatorToXSingle, _super);
        function TransferAccumulatorToXSingle() {
            _super.call(this, "TAX", 0x01, OpCodes.ModeSingle, 0xAA);
        }
        TransferAccumulatorToXSingle.prototype.execute = function (cpu) {
            cpu.rX = cpu.rA;
            cpu.setFlags(cpu.rX);
        };
        return TransferAccumulatorToXSingle;
    })(BaseOpCode);
    Emulator.TransferAccumulatorToXSingle = TransferAccumulatorToXSingle;
    registeredOperations.push(TransferAccumulatorToXSingle);

    var TransferAccumulatorToYSingle = (function (_super) {
        __extends(TransferAccumulatorToYSingle, _super);
        function TransferAccumulatorToYSingle() {
            _super.call(this, "TAY", 0x01, OpCodes.ModeSingle, 0xA8);
        }
        TransferAccumulatorToYSingle.prototype.execute = function (cpu) {
            cpu.rY = cpu.rA;
            cpu.setFlags(cpu.rY);
        };
        return TransferAccumulatorToYSingle;
    })(BaseOpCode);
    Emulator.TransferAccumulatorToYSingle = TransferAccumulatorToYSingle;
    registeredOperations.push(TransferAccumulatorToYSingle);

    var TransferXToAccumulatorSingle = (function (_super) {
        __extends(TransferXToAccumulatorSingle, _super);
        function TransferXToAccumulatorSingle() {
            _super.call(this, "TXA", 0x01, OpCodes.ModeSingle, 0x8A);
        }
        TransferXToAccumulatorSingle.prototype.execute = function (cpu) {
            cpu.rA = cpu.rX;
            cpu.setFlags(cpu.rA);
        };
        return TransferXToAccumulatorSingle;
    })(BaseOpCode);
    Emulator.TransferXToAccumulatorSingle = TransferXToAccumulatorSingle;
    registeredOperations.push(TransferXToAccumulatorSingle);

    var TransferYToAccumulatorSingle = (function (_super) {
        __extends(TransferYToAccumulatorSingle, _super);
        function TransferYToAccumulatorSingle() {
            _super.call(this, "TYA", 0x01, OpCodes.ModeSingle, 0x98);
        }
        TransferYToAccumulatorSingle.prototype.execute = function (cpu) {
            cpu.rA = cpu.rY;
            cpu.setFlags(cpu.rA);
        };
        return TransferYToAccumulatorSingle;
    })(BaseOpCode);
    Emulator.TransferYToAccumulatorSingle = TransferYToAccumulatorSingle;
    registeredOperations.push(TransferYToAccumulatorSingle);
})(Emulator || (Emulator = {}));
