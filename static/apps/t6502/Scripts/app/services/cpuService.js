///<reference path="../app.ts"/>
///<reference path="../emulator/cpu.ts"/>
///<reference path="../emulator/compiler.ts"/>
var Services;
(function (Services) {
    var CpuService = (function () {
        function CpuService($timeout, consoleService, displayService) {
            this.$injector = ['$timeout', 'consoleService', 'displayService'];
            this.cpu = new Emulator.Cpu(consoleService, displayService, $timeout);
            this.compiler = new Emulator.Compiler(this.cpu, consoleService);
        }
        CpuService.prototype.getCpu = function () {
            return this.cpu;
        };

        CpuService.prototype.getCompiler = function () {
            return this.compiler;
        };
        return CpuService;
    })();
    Services.CpuService = CpuService;

    Main.App.Services.service("cpuService", ['$timeout', 'consoleService', 'displayService', CpuService]);
})(Services || (Services = {}));
