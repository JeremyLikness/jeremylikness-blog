///<reference path='cpu.ts'/>
///<reference path='opCodes.ts'/>
var Emulator;
(function (Emulator) {
    var Compiler = (function () {
        function Compiler(cpu, consoleService) {
            this.opCode = /^\s*([A-Z]{3})\s*\S*/;
            this.notWhitespace = /\S/;
            this.whitespaceTrim = /^\s+/;
            this.whitespaceTrimEnd = /\s+$/;
            this.labelMath = /^\s*([A-Z][A-Z_0-9]+)\s*=\s*([A-Z][A-Z_0-9]+)\s*([\+\-])\s*([0-9]{1,3})\s*$/;
            this.memoryLabelHex = /^(\$[0-9A-F]+):.*/;
            this.memoryLabelDec = /^([0-9]+):.*/;
            this.regularLabel = /^([A-Z][A-Z_0-9]+):.*/;
            this.memorySet = /^\*\s*\=\s*[\$]?[0-9A-F]*$/;
            this.setAddress = /^[\s]*\*[\s]*=[\s]*/;
            this.immediate = /^\#([0-9]{1,3})\s*/;
            this.immediateHex = /^\#([0-9A-F]{1,2})\s*/;
            this.immediateLabel = /^\#([<>])([A-Z][A-Z_0-9]+)\s*/;
            this.indirectX = /^\(([0-9]{1,3})(\,\s*X)\)\s*/;
            this.indirectXHex = /^\(([0-9A-F]{1,2})(\,\s*X)\)\s*/;
            this.indirectY = /^\(([0-9]{1,3})\)(\,\s*Y)\s*/;
            this.indirectYHex = /^\(([0-9A-F]{1,2})\)(\,\s*Y)\s*/;
            this.absoluteX = /^([0-9]{1,5})(\,\s*X)\s*/;
            this.absoluteXHex = /^([0-9A-F]{1,4})(\,\s*X)\s*/;
            this.absoluteXLabel = /^([A-Z][A-Z_0-9]+)(\,\s*X)\s*/;
            this.absoluteY = /^([0-9]{1,5})(\,\s*Y)\s*/;
            this.absoluteYHex = /^([0-9A-F]{1,4})(\,\s*Y)\s*/;
            this.absoluteYLabel = /^([A-Z][A-Z_0-9]+)(\,\s*Y)\s*/;
            this.indirect = /^\(([0-9]{1,5})\)(^\S)*(\s*\;.*)?$/;
            this.indirectHex = /^\(([0-9A-F]{1,4})\)(^\S)*(\s*\;.*)?$/;
            this.indirectLabel = /^\(([A-Z][A-Z_0-9]+)\)\s*/;
            this.absolute = /^([0-9]{1,5})(^\S)*(\s*\;.*)?$/;
            this.absoluteHex = /^([0-9A-F]{1,4})(^\S)*(\s*\;.*)?$/;
            this.absoluteLabel = /^([A-Z][A-Z_0-9]+)\s*/;
            this.cpu = cpu;
            this.consoleService = consoleService;
            this.opCodeCache = {};
        }
        Compiler.prototype.decompile = function (startAddress) {
            var address = startAddress & Constants.Memory.Max;
            var instructions = 0;
            var lines = [];

            while (instructions < Constants.Memory.MaxInstructionsDecompile && address <= Constants.Memory.Max) {
                var opCode = this.cpu.peek(address);

                var parms = [
                    opCode,
                    this.cpu.peek(address + 1),
                    this.cpu.peek(address + 2)
                ];

                var operation = this.cpu.getOperation(opCode);

                if (!operation) {
                    operation = new Emulator.InvalidOp(opCode);
                }

                lines.push(operation.decompile(address, parms));

                instructions += 1;
                address += operation.sizeBytes;
            }

            return lines.join("\r\n");
        };

        Compiler.prototype.dump = function (startAddress) {
            var address = startAddress & Constants.Memory.Max;
            var instructions = 0;
            var lines = [];

            while (instructions < Constants.Memory.MaxInstructionsDecompile && address <= Constants.Memory.Max) {
                var line = "$" + Emulator.OpCodes.ToWord(address) + ": " + Emulator.OpCodes.ToByte(this.cpu.peek(address)) + " " + Emulator.OpCodes.ToByte(this.cpu.peek(address + 1)) + " " + Emulator.OpCodes.ToByte(this.cpu.peek(address + 2)) + " " + Emulator.OpCodes.ToByte(this.cpu.peek(address + 3)) + " " + Emulator.OpCodes.ToByte(this.cpu.peek(address + 4)) + " " + Emulator.OpCodes.ToByte(this.cpu.peek(address + 5)) + " " + Emulator.OpCodes.ToByte(this.cpu.peek(address + 6)) + " " + Emulator.OpCodes.ToByte(this.cpu.peek(address + 7));

                lines.push(line);
                instructions += 1;
                address += 8;
            }

            return lines.join("\r\n");
        };

        Compiler.prototype.compile = function (source) {
            var lines = source.split('\n');
            this.pcAddress = this.cpu.rPC;

            this.consoleService.log("Starting compilation.");

            try  {
                // first pass actually compiles and picks up labels, then flags
                // compiled lines that must be updated because they reference labels
                // that are defined later
                var compiled = this.parseLabels(lines);

                // this pass simply goes through and updates the labels or throws
                // an exception if a label is not found
                compiled = this.compileSource(compiled);

                this.consoleService.log("Compilation complete.");

                var totalBytes = 0;
                var idx;
                var offset;
                for (idx = 0; idx < compiled.compiledLines.length; idx++) {
                    var compiledLine = compiled.compiledLines[idx];
                    for (offset = 0; offset < compiledLine.code.length; offset++) {
                        this.cpu.poke(compiledLine.address + offset, compiledLine.code[offset]);
                        totalBytes += 1;
                    }
                }
                this.consoleService.log(totalBytes.toString(10) + " bytes of code loaded to memory.");
                this.cpu.rPC = this.pcAddress;
            } catch (e) {
                this.consoleService.log(e);
                return false;
            }

            return true;
        };

        // parses out labels but compiles as it goes because it needs to know the size
        // of the current line to keep track of labels
        Compiler.prototype.parseLabels = function (lines) {
            var address = Constants.Memory.DefaultStart;
            var label;
            var opCodeLabel;
            var buffer = [];
            var memoryLabels = 0;
            var actualLabels = 0;
            var idx;
            var parameter;
            var instance;
            var target;

            var result = {
                labels: [],
                compiledLines: []
            };

            this.consoleService.log("Starting compilation pass 1.");

            for (idx = 0; idx < lines.length; idx++) {
                var input = lines[idx].toUpperCase();

                if (input.indexOf(";") >= 0) {
                    input = input.split(";")[0];
                }

                input = this.trimLine(input);

                if (!input.match(this.notWhitespace)) {
                    continue;
                }

                // check if the user is setting the address
                var testAddress = this.moveAddress(input);

                if (!(isNaN(testAddress))) {
                    this.pcAddress = testAddress;
                    address = testAddress;
                    continue;
                }

                if (input.match(this.labelMath)) {
                    var matches = this.labelMath.exec(input);
                    if (matches.length !== 5) {
                        throw "Invalid label math at line " + (idx + 1) + ": " + input;
                    }
                    label = matches[1];
                    var otherLabel = matches[2];

                    if (this.labelExists(label, result.labels)) {
                        throw "Duplicate label " + label + " found at line " + (idx + 1);
                    }

                    if (label === otherLabel) {
                        throw "Cannot redefine label " + label + " at line " + (idx + 1);
                    }

                    var offset = parseInt(matches[4], 10);

                    if (matches[3] === "-") {
                        offset *= -1;
                    }

                    result.labels.push({
                        address: address,
                        labelName: label,
                        dependentLabelName: otherLabel,
                        offset: offset
                    });

                    actualLabels++;
                    continue;
                }

                if (input.match(this.memoryLabelHex) || input.match(this.memoryLabelDec)) {
                    memoryLabels++;
                    var hex = !!input.match(this.memoryLabelHex);
                    label = hex ? this.memoryLabelHex.exec(input)[1] : this.memoryLabelDec.exec(input)[1];

                    // strip the label out
                    input = input.replace(label + ":", "");

                    // strip hex out if applicable
                    label = label.replace("$", "");
                    address = parseInt(label, hex ? 16 : 10);

                    if (address < 0 || address > Constants.Memory.Max) {
                        throw "Address out of range: " + label;
                    }

                    this.pcAddress = address;
                } else {
                    if (input.match(this.regularLabel)) {
                        label = this.regularLabel.exec(input)[1];
                        if (this.labelExists(label, result.labels)) {
                            throw "Duplicate label " + label + " found at line " + (idx + 1);
                        }
                        result.labels.push({
                            address: address,
                            labelName: label,
                            dependentLabelName: undefined,
                            offset: 0
                        });
                        actualLabels++;
                        input = input.replace(label + ":", "");
                    }
                }

                if (!input.match(this.notWhitespace)) {
                    continue;
                }

                try  {
                    var compiledLine = this.compileLine(result.labels, address, input);
                    result.compiledLines.push(compiledLine);
                    address += compiledLine.code.length;
                } catch (e) {
                    throw e + " Line: " + (idx + 1);
                }
            }

            for (idx = 0; idx < result.labels.length; idx++) {
                instance = result.labels[idx];
                if (instance.dependentLabelName === undefined) {
                    continue;
                }
                target = this.findLabel(instance.dependentLabelName, result.labels);
                if (target === null) {
                    throw "Unable to process label " + instance.labelName + ": missing dependent label " + instance.dependentLabelName;
                }
                instance.address = (target.address + instance.offset) & Constants.Memory.Max;
                instance.dependentLabelName = undefined;
            }

            this.consoleService.log("Parsed " + memoryLabels + " memory tags and " + actualLabels + " labels.");

            return result;
        };

        Compiler.prototype.compileLine = function (labels, address, input) {
            var result = {
                address: address,
                code: [],
                operation: null,
                processed: false,
                label: "",
                high: false
            };

            if (input.match(this.opCode)) {
                result = this.parseOpCode(labels, input, result);
            } else {
                throw "Invalid assembly " + input;
            }

            return result;
        };

        Compiler.prototype.trimLine = function (input) {
            if (!this.notWhitespace.test(input)) {
                return "";
            }

            // trim the line
            input = input.replace(this.whitespaceTrim, "").replace(this.whitespaceTrimEnd, "");

            return input;
        };

        Compiler.prototype.moveAddress = function (input) {
            var parameter;
            var address = NaN;

            if (input.match(this.memorySet)) {
                parameter = input.replace(this.setAddress, "");
                if (parameter[0] === "$") {
                    parameter = parameter.replace("$", "");
                    address = parseInt(parameter, 16);
                } else {
                    address = parseInt(parameter, 10);
                }

                if ((address < 0) || (address > Constants.Memory.Max)) {
                    throw "Address out of range";
                }
            }

            return address;
        };

        Compiler.prototype.getOperationForMode = function (operations, addressMode) {
            var idx = 0;
            for (idx = 0; idx < operations.length; idx++) {
                if (operations[idx].addressingMode === addressMode) {
                    return operations[idx];
                }
            }

            return null;
        };

        Compiler.prototype.parseOpCode = function (labels, opCodeExpression, compiledLine) {
            var matches = this.opCode.exec(opCodeExpression);
            var matchArray;
            var idx;
            var hex;
            var rawValue;
            var values;
            var value;
            var entry;
            var xIndex;
            var yIndex;
            var opCodeName = matches[1];
            var operations = [];
            var parameter;
            var labelReady;
            var label;
            var labelInstance;
            var processed;
            var test;
            var radix = 10;

            if (opCodeName in this.opCodeCache) {
                operations = this.opCodeCache[opCodeName];
            } else {
                operations = Emulator.OpCodes.LoadOpCodesByName(opCodeName);
                if (operations.length > 0) {
                    this.opCodeCache[opCodeName] = operations;
                } else {
                    throw "Invalid op code: " + opCodeName;
                }
            }

            processed = true;

            parameter = this.trimLine(opCodeExpression.replace(opCodeName, ""));

            if (opCodeName === "DCB") {
                // dcb simply loads bytes
                compiledLine.processed = true;
                compiledLine.operation = operations[0];
                var values = parameter.split(",");
                if (values.length === 0) {
                    throw "DCB requires a list of bytes to be inserted into the compilation stream.";
                }
                for (idx = 0; idx < values.length; idx++) {
                    if (values[idx] === undefined || values[idx] === null || values[idx].length === 0) {
                        throw "DCB with invalid value list: " + parameter;
                    }
                    entry = values[idx];
                    hex = entry.indexOf("$") >= 0;
                    if (hex) {
                        entry = entry.replace("$", "");
                        value = parseInt(entry, 16);
                    } else {
                        value = parseInt(entry, 10);
                    }
                    if (value < 0 || value > Constants.Memory.ByteMask) {
                        throw "DCB with value out of range: " + parameter;
                    }
                    compiledLine.code.push(value);
                }
                compiledLine.operation.sizeBytes = compiledLine.code.length;
                return compiledLine;
            }

            hex = parameter.indexOf("$") >= 0;

            if (hex) {
                parameter = parameter.replace("$", "");
                radix = 16;
            }

            if (operations[0].addressingMode === Emulator.OpCodes.ModeRelative) {
                test = hex ? this.absoluteHex : this.absolute;

                // absolute with label
                compiledLine.processed = true;
                parameter = this.parseAbsoluteLabel(parameter, compiledLine, labels, test, this.absoluteLabel);
                processed = compiledLine.processed;

                if (matchArray = parameter.match(test)) {
                    rawValue = matchArray[1];
                    value = parseInt(rawValue, radix);
                    if (value < 0 || value > Constants.Memory.Size) {
                        throw "Absolute value of out range: " + value;
                    }

                    parameter = this.trimLine(parameter.replace(rawValue, ""));
                    if (parameter.match(this.notWhitespace)) {
                        throw "Invalid assembly: " + opCodeExpression;
                    }

                    compiledLine.operation = operations[0];

                    compiledLine.code.push(compiledLine.operation.opCode);

                    var offset;

                    if (value <= compiledLine.address) {
                        offset = Constants.Memory.ByteMask - ((compiledLine.address + 1) - value);
                    } else {
                        offset = (value - compiledLine.address) - 2;
                    }

                    compiledLine.code.push(offset & Constants.Memory.ByteMask);
                    compiledLine.processed = processed;
                    return compiledLine;
                } else {
                    throw "Invalid branch.";
                }
            }

            if (!parameter.match(this.notWhitespace)) {
                compiledLine.operation = this.getOperationForMode(operations, Emulator.OpCodes.ModeSingle);
                if (compiledLine.operation === null) {
                    throw "Opcode requires a parameter " + opCodeName;
                }
                compiledLine.code.push(compiledLine.operation.opCode);
                compiledLine.processed = processed;
                return compiledLine;
            }

            // indexed indirect X
            test = hex ? this.indirectXHex : this.indirectX;
            if (matchArray = parameter.match(test)) {
                rawValue = matchArray[1];
                xIndex = matchArray[2];
                value = parseInt(rawValue, radix);
                if (value < 0 || value > Constants.Memory.ByteMask) {
                    throw "Indirect X-Indexed value of out range: " + value;
                }

                // strip the index and parenthesis
                parameter = parameter.replace("(", "").replace(")", "");
                parameter = parameter.replace(xIndex, "");
                parameter = this.trimLine(parameter.replace(rawValue, ""));
                if (parameter.match(this.notWhitespace)) {
                    throw "Invalid assembly: " + opCodeExpression;
                }

                compiledLine.operation = this.getOperationForMode(operations, Emulator.OpCodes.ModeIndexedIndirectX);
                if (compiledLine.operation === null) {
                    throw "Opcode doesn't support indirect X-indexed mode " + opCodeName;
                }

                compiledLine.code.push(compiledLine.operation.opCode);
                compiledLine.code.push(value & Constants.Memory.ByteMask);
                compiledLine.processed = processed;
                return compiledLine;
            }

            // indirect indexed Y
            test = hex ? this.indirectYHex : this.indirectY;
            if (matchArray = parameter.match(test)) {
                rawValue = matchArray[1];
                yIndex = matchArray[2];
                value = parseInt(rawValue, radix);
                if (value < 0 || value > Constants.Memory.ByteMask) {
                    throw "Indexed Indirect-Y value of out range: " + value;
                }

                // strip the index and parenthesis
                parameter = parameter.replace("(", "").replace(")", "");
                parameter = parameter.replace(yIndex, "");
                parameter = this.trimLine(parameter.replace(rawValue, ""));
                if (parameter.match(this.notWhitespace)) {
                    throw "Invalid assembly: " + opCodeExpression;
                }

                compiledLine.operation = this.getOperationForMode(operations, Emulator.OpCodes.ModeIndexedIndirectY);
                if (compiledLine.operation === null) {
                    throw "Opcode doesn't support indirected indexed-Y mode " + opCodeName;
                }

                compiledLine.code.push(compiledLine.operation.opCode);
                compiledLine.code.push(value & Constants.Memory.ByteMask);
                compiledLine.processed = processed;
                return compiledLine;
            }

            // immediate with label
            test = hex ? this.immediateHex : this.immediate;
            if (!parameter.match(test)) {
                if (matchArray = parameter.match(this.immediateLabel)) {
                    compiledLine.high = matchArray[1] === ">";
                    label = matchArray[2];
                    labelInstance = this.findLabel(label, labels);
                    if (labelInstance !== null) {
                        value = compiledLine.high ? (labelInstance.address >> Constants.Memory.BitsInByte) : labelInstance.address;
                        parameter = parameter.replace(matchArray[0], "#" + (value & Constants.Memory.ByteMask).toString(10));
                    } else {
                        compiledLine.label = label;
                        processed = false;
                        parameter = parameter.replace(matchArray[0], "#0");
                    }
                }
            }

            if (matchArray = parameter.match(test)) {
                rawValue = matchArray[1];
                value = parseInt(rawValue, radix);
                if (value < 0 || value > Constants.Memory.ByteMask) {
                    throw "Immediate value of out range: " + value;
                }

                // strip the value to find what's remaining
                parameter = parameter.replace("#", "");
                parameter = this.trimLine(parameter.replace(rawValue, ""));
                if (parameter.match(this.notWhitespace)) {
                    throw "Invalid assembly: " + opCodeExpression;
                }

                compiledLine.operation = this.getOperationForMode(operations, Emulator.OpCodes.ModeImmediate);
                if (compiledLine.operation === null) {
                    throw "Opcode doesn't support immediate mode " + opCodeName;
                }

                compiledLine.code.push(compiledLine.operation.opCode);
                compiledLine.code.push(value);
                compiledLine.processed = processed;
                return compiledLine;
            }

            // absolute with X-index mode
            test = hex ? this.absoluteXHex : this.absoluteX;

            compiledLine.processed = true;
            parameter = this.parseAbsoluteLabel(parameter, compiledLine, labels, test, this.absoluteXLabel);
            processed = compiledLine.processed;

            if (matchArray = parameter.match(test)) {
                rawValue = matchArray[1];
                xIndex = matchArray[2];
                value = parseInt(rawValue, radix);
                if (value < 0 || value > Constants.Memory.Size) {
                    throw "Absolute X-Indexed value of out range: " + value;
                }

                // strip the index
                parameter = parameter.replace(xIndex, "");
                parameter = this.trimLine(parameter.replace(rawValue, ""));
                if (parameter.match(this.notWhitespace)) {
                    throw "Invalid assembly: " + opCodeExpression;
                }

                compiledLine.operation = this.getOperationForMode(operations, Emulator.OpCodes.ModeAbsoluteX);
                if (compiledLine.operation === null) {
                    throw "Opcode doesn't support absolute X-indexed mode " + opCodeName;
                }

                compiledLine.code.push(compiledLine.operation.opCode);
                compiledLine.code.push(value & Constants.Memory.ByteMask);
                compiledLine.code.push((value >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                compiledLine.processed = processed;
                return compiledLine;
            }

            // absolute with Y-index label
            test = hex ? this.absoluteYHex : this.absoluteY;

            compiledLine.processed = true;
            parameter = this.parseAbsoluteLabel(parameter, compiledLine, labels, test, this.absoluteYLabel);
            processed = compiledLine.processed;

            if (matchArray = parameter.match(test)) {
                rawValue = matchArray[1];
                yIndex = matchArray[2];
                value = parseInt(rawValue, radix);
                if (value < 0 || value > Constants.Memory.Size) {
                    throw "Absolute Y-Indexed value of out range: " + value;
                }

                // strip the index
                parameter = parameter.replace(yIndex, "");
                parameter = this.trimLine(parameter.replace(rawValue, ""));
                if (parameter.match(this.notWhitespace)) {
                    throw "Invalid assembly: " + opCodeExpression;
                }

                compiledLine.operation = this.getOperationForMode(operations, Emulator.OpCodes.ModeAbsoluteY);
                if (compiledLine.operation === null) {
                    throw "Opcode doesn't support absolute Y-indexed mode " + opCodeName;
                }

                compiledLine.code.push(compiledLine.operation.opCode);
                compiledLine.code.push(value & Constants.Memory.ByteMask);
                compiledLine.code.push((value >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                compiledLine.processed = true;
                return compiledLine;
            }

            // indirect with label
            test = hex ? this.indirectHex : this.indirect;

            compiledLine.processed = true;
            parameter = this.parseAbsoluteLabel(parameter, compiledLine, labels, test, this.indirectLabel);
            processed = compiledLine.processed;

            if (matchArray = parameter.match(test)) {
                rawValue = matchArray[1];
                value = parseInt(rawValue, radix);
                if (value < 0 || value > Constants.Memory.Size) {
                    throw "Absolute value of out range: " + value;
                }

                parameter = parameter.replace("(", "").replace(")", "");
                parameter = this.trimLine(parameter.replace(rawValue, ""));
                if (parameter.match(this.notWhitespace)) {
                    throw "Invalid assembly: " + opCodeExpression;
                }

                compiledLine.operation = this.getOperationForMode(operations, Emulator.OpCodes.ModeIndirect);
                if (compiledLine.operation === null) {
                    throw "Opcode doesn't support indirect mode " + opCodeName;
                }

                compiledLine.code.push(compiledLine.operation.opCode);
                compiledLine.code.push(value & Constants.Memory.ByteMask);
                compiledLine.code.push((value >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                compiledLine.processed = processed;
                return compiledLine;
            }

            // absolute with label
            test = hex ? this.absoluteHex : this.absolute;

            compiledLine.processed = true;
            parameter = this.parseAbsoluteLabel(parameter, compiledLine, labels, test, this.absoluteLabel);
            processed = compiledLine.processed;

            if (matchArray = parameter.match(test)) {
                rawValue = matchArray[1];
                value = parseInt(rawValue, radix);
                if (value < 0 || value > Constants.Memory.Size) {
                    throw "Absolute value of out range: " + value;
                }

                parameter = this.trimLine(parameter.replace(rawValue, ""));
                if (parameter.match(this.notWhitespace)) {
                    throw "Invalid assembly: " + opCodeExpression;
                }

                var mode = value <= Constants.Memory.ByteMask ? Emulator.OpCodes.ModeZeroPage : Emulator.OpCodes.ModeAbsolute;

                compiledLine.operation = this.getOperationForMode(operations, mode);
                if (compiledLine.operation === null) {
                    throw "Opcode doesn't support absolute mode " + opCodeName;
                }

                compiledLine.code.push(compiledLine.operation.opCode);
                compiledLine.code.push(value & Constants.Memory.ByteMask);

                if (mode === Emulator.OpCodes.ModeAbsolute) {
                    compiledLine.code.push((value >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask);
                }
                compiledLine.processed = processed;
                return compiledLine;
            }

            throw "Unable to parse " + opCodeExpression;
        };

        Compiler.prototype.compileSource = function (compilerResult) {
            this.consoleService.log("Starting compilation pass 2.");

            var idx;

            for (idx = 0; idx < compilerResult.compiledLines.length; idx++) {
                var compiledLine = compilerResult.compiledLines[idx];
                if (!compiledLine.processed) {
                    var labelInstance = this.findLabel(compiledLine.label, compilerResult.labels);
                    if (labelInstance === null) {
                        throw "Label not defined: " + compiledLine.label;
                    }
                    if (compiledLine.operation.sizeBytes === 2) {
                        if (compiledLine.operation.addressingMode === Emulator.OpCodes.ModeRelative) {
                            var offset;

                            if (labelInstance.address <= compiledLine.address) {
                                offset = Constants.Memory.ByteMask - ((compiledLine.address + 1) - labelInstance.address);
                            } else {
                                offset = (labelInstance.address - compiledLine.address) - 2;
                            }
                            compiledLine.code[1] = offset & Constants.Memory.ByteMask;
                        } else {
                            var value = compiledLine.high ? (labelInstance.address >> Constants.Memory.BitsInByte) : labelInstance.address;
                            compiledLine.code[1] = value & Constants.Memory.ByteMask;
                        }
                        compiledLine.processed = true;
                        continue;
                    } else if (compiledLine.operation.sizeBytes === 3) {
                        compiledLine.code[1] = labelInstance.address & Constants.Memory.ByteMask;
                        compiledLine.code[2] = (labelInstance.address >> Constants.Memory.BitsInByte) & Constants.Memory.ByteMask;
                        compiledLine.processed = true;
                        continue;
                    }
                    throw "Not implemented";
                }
            }

            return compilerResult;
        };

        Compiler.prototype.labelExists = function (label, labels) {
            return this.findLabel(label, labels) !== null;
        };

        Compiler.prototype.findLabel = function (label, labels) {
            var index;
            for (index = 0; index < labels.length; index++) {
                if (labels[index].labelName === label && labels[index].dependentLabelName === undefined) {
                    return labels[index];
                }
            }
            return null;
        };

        Compiler.prototype.parseAbsoluteLabel = function (parameter, compiledLine, labels, targetExpr, labelExpr) {
            var matchArray;

            if (!parameter.match(targetExpr)) {
                if (matchArray = parameter.match(labelExpr)) {
                    var label = matchArray[1];
                    var labelInstance = this.findLabel(label, labels);
                    if (labelInstance !== null) {
                        var value = labelInstance.address;
                        parameter = parameter.replace(matchArray[1], value.toString(10));
                    } else {
                        compiledLine.label = label;
                        compiledLine.processed = false;
                        parameter = parameter.replace(matchArray[1], "65535");
                    }
                }
            }
            return parameter;
        };
        return Compiler;
    })();
    Emulator.Compiler = Compiler;
})(Emulator || (Emulator = {}));
