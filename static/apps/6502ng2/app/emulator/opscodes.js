System.register(['./opCodes', '../globalConstants'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var opCodes_1, globalConstants_1;
    var OpCodes;
    return {
        setters:[
            function (opCodes_1_1) {
                opCodes_1 = opCodes_1_1;
            },
            function (globalConstants_1_1) {
                globalConstants_1 = globalConstants_1_1;
            }],
        execute: function() {
            OpCodes = (function () {
                function OpCodes() {
                }
                OpCodes.computeBranch = function (address, offset) {
                    var result = 0;
                    if (offset > globalConstants_1.Constants.Memory.BranchBack) {
                        result = (address - (globalConstants_1.Constants.Memory.BranchOffset - offset));
                    }
                    else {
                        result = address + offset;
                    }
                    return result;
                };
                OpCodes.LoadOpCodesByName = function (opCode) {
                    var result = [];
                    var idx;
                    for (var idx = 0; idx < opCodes_1.registeredOperations.length; idx++) {
                        var operation = opCodes_1.registeredOperations[idx];
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
                    }
                    else {
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
                        return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "$" + OpCodes.ToWord(bytes[1] + (bytes[2] << globalConstants_1.Constants.Memory.BitsInByte)));
                    }
                    if (op.addressingMode === OpCodes.ModeAbsoluteX) {
                        return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "$" + OpCodes.ToWord(bytes[1] + (bytes[2] << globalConstants_1.Constants.Memory.BitsInByte)) + ", X");
                    }
                    if (op.addressingMode === OpCodes.ModeAbsoluteY) {
                        return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "$" + OpCodes.ToWord(bytes[1] + (bytes[2] << globalConstants_1.Constants.Memory.BitsInByte)) + ", Y");
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
                        return OpCodes.ToDecompiledLine(OpCodes.ToWord(address), op.opName, "($" + OpCodes.ToWord(bytes[1] + (bytes[2] << globalConstants_1.Constants.Memory.BitsInByte)) + ")");
                    }
                    throw "Unknown addressing mode.";
                };
                OpCodes.FillOps = function (operationMap) {
                    var idx;
                    var size = globalConstants_1.Constants.Memory.ByteMask + 1;
                    while (size -= 1) {
                        var invalid = new opCodes_1.InvalidOp(size);
                        operationMap.push(invalid);
                    }
                    for (idx = 0; idx < opCodes_1.registeredOperations.length; idx++) {
                        var operation = opCodes_1.registeredOperations[idx];
                        operationMap[operation.opCode] = operation;
                    }
                };
                OpCodes.AddWithCarry = function (cpu, src) {
                    var temp;
                    var carryFactor = cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.CarryFlagSet) ? 1 : 0;
                    var overflowFlag;
                    function offsetAdjustAdd(offs, cutOff) {
                        if (offs >= cutOff) {
                            cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.CarryFlagSet, true);
                            if (cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet) && offs >= 0x180) {
                                cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet, false);
                            }
                            return true;
                        }
                        else {
                            cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.CarryFlagSet, false);
                            if (cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet) && offs < globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet) {
                                cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet, false);
                            }
                            return false;
                        }
                    }
                    overflowFlag = !((cpu.rA ^ src) & globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet);
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet, overflowFlag);
                    if (cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.DecimalFlagSet)) {
                        temp = (cpu.rA & globalConstants_1.Constants.Memory.NibbleMask) + (src & globalConstants_1.Constants.Memory.NibbleMask) + carryFactor;
                        if (temp >= 0x0A) {
                            temp = 0x10 | ((temp + 0x06) & globalConstants_1.Constants.Memory.NibbleMask);
                        }
                        temp += (cpu.rA & globalConstants_1.Constants.Memory.HighNibbleMask) + (src & globalConstants_1.Constants.Memory.HighNibbleMask);
                        if (offsetAdjustAdd(temp, 0xA0)) {
                            temp += 0x60;
                        }
                    }
                    else {
                        temp = cpu.rA + src + carryFactor;
                        offsetAdjustAdd(temp, 0x100);
                    }
                    cpu.rA = temp & globalConstants_1.Constants.Memory.ByteMask;
                    cpu.setFlags(cpu.rA);
                };
                OpCodes.SubtractWithCarry = function (cpu, src) {
                    var temp, offset, carryFactor;
                    var overflowFlag;
                    function offsetAdjustSub(offs) {
                        if (offs < 0x100) {
                            cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.CarryFlagSet, false);
                            if (cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet) && offs < globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet) {
                                cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet, false);
                            }
                            return true;
                        }
                        else {
                            cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.CarryFlagSet, true);
                            if (cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet) && offset >= 0x180) {
                                cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet, false);
                            }
                            return false;
                        }
                    }
                    ;
                    carryFactor = cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.CarryFlagSet) ? 1 : 0;
                    cpu.setFlag(globalConstants_1.Constants.ProcessorStatus.OverflowFlagSet, !!((cpu.rA ^ src) & globalConstants_1.Constants.ProcessorStatus.NegativeFlagSet));
                    if (cpu.checkFlag(globalConstants_1.Constants.ProcessorStatus.DecimalFlagSet)) {
                        temp = globalConstants_1.Constants.Memory.NibbleMask + (cpu.rA & globalConstants_1.Constants.Memory.NibbleMask) - (src & globalConstants_1.Constants.Memory.NibbleMask) + carryFactor;
                        if (temp < 0x10) {
                            offset = 0;
                            temp -= 0x06;
                        }
                        else {
                            offset = 0x10;
                            temp -= 0x10;
                        }
                        offset += globalConstants_1.Constants.Memory.HighNibbleMask + (cpu.rA & globalConstants_1.Constants.Memory.HighNibbleMask) - (src & globalConstants_1.Constants.Memory.HighNibbleMask);
                        if (offsetAdjustSub(offset)) {
                            offset -= 0x60;
                        }
                        offset += temp;
                    }
                    else {
                        offset = globalConstants_1.Constants.Memory.ByteMask + cpu.rA - src + carryFactor;
                        offsetAdjustSub(offset);
                    }
                    cpu.rA = offset & globalConstants_1.Constants.Memory.ByteMask;
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
            }());
            exports_1("OpCodes", OpCodes);
        }
    }
});
//# sourceMappingURL=opscodes.js.map