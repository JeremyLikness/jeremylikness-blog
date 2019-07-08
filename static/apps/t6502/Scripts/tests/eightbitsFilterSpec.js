/// <reference path='jasmine.d.ts'/>
/// <reference path='../app/defs/angular.d.ts'/>
/// <reference path='angular-mocks.d.ts'/>
/// <reference path='../app/defs/jquery.d.ts'/>
/// <reference path='../app/app.ts'/>
/// <reference path='../app/filters/eightbits.ts'/>
var Tests;
(function (Tests) {
    describe("eightbits filter", function () {
        var filter;

        beforeEach(function () {
            module('app');
        });

        beforeEach(function () {
            inject(function ($filter) {
                filter = $filter('eightbits');
            });
        });

        describe("given invalid input when called", function () {
            it("then should return the value back", function () {
                expect(filter('zoo')).toEqual('zoo');
            });
        });

        describe("given valid input when called", function () {
            it("then should return the bits for the number", function () {
                expect(filter(0xff)).toEqual('11111111');
            });

            it("with smaller number then should pad bits to 8 places", function () {
                expect(filter(0x01)).toEqual('00000001');
            });
        });
    });
})(Tests || (Tests = {}));
