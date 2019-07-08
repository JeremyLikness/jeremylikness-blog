/// <reference path='jasmine.d.ts'/>
/// <reference path='../app/defs/angular.d.ts'/>
/// <reference path='angular-mocks.d.ts'/>
/// <reference path='../app/defs/jquery.d.ts'/>
/// <reference path='../app/app.ts'/>
/// <reference path='../app/filters/hexadecimal.ts'/>
var Tests;
(function (Tests) {
    describe("hexadecimal filter", function () {
        var filter;

        beforeEach(function () {
            module('app');
        });

        beforeEach(function () {
            inject(function ($filter) {
                filter = $filter('hexadecimal');
            });
        });

        describe("given invalid input when called", function () {
            it("then should return the value back", function () {
                expect(filter('zoo')).toEqual('zoo');
            });
        });

        describe("given valid input when called", function () {
            it("then should return the hexadecimal for the number", function () {
                expect(filter(127)).toEqual('0x7F');
            });
        });
    });
})(Tests || (Tests = {}));
