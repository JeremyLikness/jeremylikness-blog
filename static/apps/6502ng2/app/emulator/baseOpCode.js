System.register(['./opsCodes'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var opsCodes_1;
    var BaseOpCode;
    return {
        setters:[
            function (opsCodes_1_1) {
                opsCodes_1 = opsCodes_1_1;
            }],
        execute: function() {
            BaseOpCode = (function () {
                function BaseOpCode(opName, sizeBytes, addressingMode, opCode) {
                    this.opName = opName;
                    this.sizeBytes = sizeBytes;
                    this.addressingMode = addressingMode;
                    this.opCode = opCode;
                }
                BaseOpCode.prototype.decompile = function (address, bytes) {
                    return opsCodes_1.OpCodes.ProcessLine(address, this, bytes);
                };
                BaseOpCode.prototype.execute = function (cpu) {
                    return;
                };
                return BaseOpCode;
            }());
            exports_1("BaseOpCode", BaseOpCode);
        }
    }
});
//# sourceMappingURL=baseOpCode.js.map