///<reference path="../app.ts"/>
///<reference path="../emulator/cpu.ts"/>
///<reference path="../services/consoleService.ts"/>
///<reference path="../services/cpuService.ts"/>
var Main;
(function (Main) {
    var MainController = (function () {
        function MainController($scope, consoleService, cpuService, $timeout, $http) {
            var _this = this;
            this.$scope = $scope;
            this.cpuService = cpuService;
            $scope.title = "TypeScript 6502 Emulator.";
            $scope.cpu = cpuService.getCpu();
            $scope.pc = Constants.Memory.DefaultStart.toString(16).toUpperCase();
            $scope.compilerInfo = "";

            $scope.source = ["palette scroll", "sierpinski", "testcomparisons", "testdecimal", "testoverflow"];
            $scope.selectedSource = $scope.source[0];

            $scope.loadSource = function () {
                var url = "Source/" + $scope.selectedSource.replace(" ", "_") + ".txt";
                $http.get(url).then(function (result) {
                    _this.$scope.compilerInfo = result.data;
                });
            };

            $scope.setPc = function () {
                _this.$scope.cpu.rPC = parseInt(_this.$scope.pc, 16);
            };

            $scope.decompile = function () {
                try  {
                    _this.$scope.compilerInfo = _this.cpuService.getCompiler().decompile(parseInt(_this.$scope.pc, 16));
                } catch (e) {
                    _this.$scope.compilerInfo = e;
                }
            };

            $scope.dump = function () {
                try  {
                    _this.$scope.compilerInfo = _this.cpuService.getCompiler().dump(parseInt(_this.$scope.pc, 16));
                } catch (e) {
                    _this.$scope.compilerInfo = e;
                }
            };

            $scope.compile = function () {
                var source = _this.$scope.compilerInfo;
                _this.cpuService.getCompiler().compile(source);
            };
        }
        MainController.$inject = ["$scope", "consoleService", "cpuService", "$timeout", "$http"];
        return MainController;
    })();
    Main.MainController = MainController;

    Main.App.Controllers.controller("MainCtrl", MainController);
})(Main || (Main = {}));
