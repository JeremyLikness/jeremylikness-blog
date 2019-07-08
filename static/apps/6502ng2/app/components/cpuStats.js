System.register(['angular2/core', '../pipes/hexadecimal', '../pipes/eightbits', '../emulator/cpu'], function(exports_1, context_1) {
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
    var core_1, hexadecimal_1, eightbits_1, cpu_1;
    var CpuStats;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (hexadecimal_1_1) {
                hexadecimal_1 = hexadecimal_1_1;
            },
            function (eightbits_1_1) {
                eightbits_1 = eightbits_1_1;
            },
            function (cpu_1_1) {
                cpu_1 = cpu_1_1;
            }],
        execute: function() {
            CpuStats = (function () {
                function CpuStats(cpu) {
                    this.cpu = cpu;
                }
                CpuStats = __decorate([
                    core_1.Component({
                        selector: 'cpuStats',
                        templateUrl: 'templates/cpuStats.html',
                        pipes: [hexadecimal_1.Hexadecimal, eightbits_1.EightBits]
                    }),
                    __param(0, core_1.Inject(cpu_1.Cpu)), 
                    __metadata('design:paramtypes', [Object])
                ], CpuStats);
                return CpuStats;
            }());
            exports_1("CpuStats", CpuStats);
        }
    }
});
//# sourceMappingURL=cpuStats.js.map