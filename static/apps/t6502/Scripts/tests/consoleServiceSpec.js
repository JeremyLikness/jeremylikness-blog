/// <reference path='jasmine.d.ts'/>
/// <reference path='../app/defs/angular.d.ts'/>
/// <reference path='angular-mocks.d.ts'/>
/// <reference path='../app/defs/jquery.d.ts'/>
/// <reference path='../app/app.ts'/>
/// <reference path='../app/services/consoleService.ts'/>
var Tests;
(function (Tests) {
    describe("console service", function () {
        var consoleSvc;

        beforeEach(function () {
            module('app');
        });

        beforeEach(function () {
            inject(function (consoleService) {
                consoleSvc = consoleService;
            });
        });

        describe("given console service when called", function () {
            it("then should initialize the lines array", function () {
                expect(consoleSvc.lines).toBeDefined();
                expect(consoleSvc.lines.length).toBe(0);
            });
        });

        describe("given console service when log method called", function () {
            var message = "This is a test message.";

            beforeEach(function () {
                consoleSvc.log(message);
            });

            it("then should add the message to the lines array", function () {
                expect(consoleSvc.lines).toBeDefined();
                expect(consoleSvc.lines.length).toBe(1);
                expect(consoleSvc.lines[0]).toBe(message);
            });
        });
    });
})(Tests || (Tests = {}));
