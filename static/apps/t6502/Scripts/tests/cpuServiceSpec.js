/// <reference path='jasmine.d.ts'/>
/// <reference path='../app/defs/angular.d.ts'/>
/// <reference path='angular-mocks.d.ts'/>
/// <reference path='../app/defs/jquery.d.ts'/>
/// <reference path='../app/app.ts'/>
/// <reference path='../app/services/cpuService.ts'/>
var Tests;
(function (Tests) {
    describe("cpu service", function () {
        var cpuSvc;

        beforeEach(function () {
            module('app');
        });

        beforeEach(function () {
            inject(function (cpuService) {
                cpuSvc = cpuService;
            });
        });

        describe("given cpu service when getCpu called", function () {
            it("then should return a cpu instance", function () {
                expect(cpuSvc.getCpu()).toBeDefined();
            });
        });

        describe("given cpu service when getCompiler called", function () {
            it("then should return a compiler instance", function () {
                expect(cpuSvc.getCompiler()).toBeDefined();
            });
        });
    });
})(Tests || (Tests = {}));
