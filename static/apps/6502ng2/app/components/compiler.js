System.register(['angular2/core', 'angular2/common', 'angular2/http', 'rxjs/Rx', '../pipes/hexadecimal', '../emulator/cpu', '../emulator/compiler', '../services/consoleService', '../globalconstants'], function(exports_1, context_1) {
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
    var core_1, common_1, http_1, hexadecimal_1, cpu_1, compiler_1, consoleService_1, globalconstants_1;
    var Compiler;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (hexadecimal_1_1) {
                hexadecimal_1 = hexadecimal_1_1;
            },
            function (cpu_1_1) {
                cpu_1 = cpu_1_1;
            },
            function (compiler_1_1) {
                compiler_1 = compiler_1_1;
            },
            function (consoleService_1_1) {
                consoleService_1 = consoleService_1_1;
            },
            function (globalconstants_1_1) {
                globalconstants_1 = globalconstants_1_1;
            }],
        execute: function() {
            Compiler = (function () {
                function Compiler(http, fb, cpu, consoleService, compiler) {
                    this.http = http;
                    this.fb = fb;
                    this.cpu = cpu;
                    this.consoleService = consoleService;
                    this.compiler = compiler;
                    this.sources = ["palette scroll", "sierpinski triangle", "test comparisons", "test overflow", "test decimal"];
                    this.compilerForm = this.fb.group({
                        'pc': [globalconstants_1.Constants.Memory.DefaultStart.toString(16).toUpperCase(),
                            common_1.Validators.compose([common_1.Validators.required, this.pcValidator])],
                        'compilerInfo': ['', common_1.Validators.required],
                        'selectedSource': [this.sources[0]]
                    });
                    this.pc = this.compilerForm.controls["pc"];
                    this.compilerInfo = this.compilerForm.controls["compilerInfo"];
                    this.selectedSource = this.compilerForm.controls["selectedSource"];
                }
                Compiler.prototype.pcValidator = function (ctrl) {
                    var address = parseInt(ctrl.value, 16);
                    var isValid = !isNaN(address) && address >= 0 && address < globalconstants_1.Constants.Memory.Size;
                    return isValid ? null : {
                        invalidProgramCounter: true
                    };
                };
                Compiler.prototype.loadSource = function () {
                    var _this = this;
                    var url = "Source/" + this.selectedSource.value.replace(" ", "_") + ".txt";
                    this.consoleService.log("Loading " + url + "...");
                    this.http.get(url)
                        .map(function (res) { return res.text(); })
                        .subscribe(function (data) { return _this.compilerInfo.updateValue(data); }, function (err) { return _this.consoleService.log(err); }, function () { return _this.consoleService.log("Loaded " + url); });
                };
                Compiler.prototype.setPc = function () {
                    if (this.pc.valid) {
                        this.cpu.rPC = parseInt(this.pc.value, 16);
                    }
                };
                Compiler.prototype.decompile = function () {
                    try {
                        if (this.pc.valid) {
                            var str = this.compiler.decompile(parseInt(this.pc.value, 16));
                            this.compilerInfo.updateValue(str);
                        }
                    }
                    catch (e) {
                        this.compilerInfo = e;
                    }
                };
                Compiler.prototype.dump = function () {
                    try {
                        if (this.pc.valid) {
                            var str = this.compiler.dump(parseInt(this.pc.value, 16));
                            this.compilerInfo.updateValue(str);
                        }
                    }
                    catch (e) {
                        this.compilerInfo = e;
                    }
                };
                Compiler.prototype.compile = function () {
                    var source = this.compilerInfo.value;
                    this.compiler.compile(source);
                };
                Compiler = __decorate([
                    core_1.Component({
                        selector: 'compiler',
                        templateUrl: 'templates/compiler.html',
                        directives: [common_1.FORM_DIRECTIVES],
                        pipes: [hexadecimal_1.Hexadecimal]
                    }),
                    __param(2, core_1.Inject(cpu_1.Cpu)),
                    __param(3, core_1.Inject(consoleService_1.ConsoleService)),
                    __param(4, core_1.Inject(compiler_1.Compiler)), 
                    __metadata('design:paramtypes', [http_1.Http, common_1.FormBuilder, Object, Object, Object])
                ], Compiler);
                return Compiler;
            }());
            exports_1("Compiler", Compiler);
        }
    }
});
//# sourceMappingURL=compiler.js.map