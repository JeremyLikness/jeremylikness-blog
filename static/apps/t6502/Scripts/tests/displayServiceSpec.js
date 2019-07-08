/// <reference path='jasmine.d.ts'/>
/// <reference path='../app/defs/angular.d.ts'/>
/// <reference path='angular-mocks.d.ts'/>
/// <reference path='../app/defs/jquery.d.ts'/>
/// <reference path='../app/app.ts'/>
/// <reference path='../app/globalConstants.ts'/>
/// <reference path='../app/services/displayService.ts'/>
var Tests;
(function (Tests) {
    describe("display service", function () {
        var validAddress = Constants.Display.Max;
        var invalidAddress = Constants.Display.Max + 1;
        var validValue = Constants.Memory.ByteMask;
        var invalidValue = Constants.Memory.ByteMask + 1;
        var displaySvc;

        beforeEach(function () {
            module('app');
        });

        beforeEach(function () {
            inject(function (displayService) {
                displaySvc = displayService;
            });
        });

        describe("given display service when called", function () {
            it("then should initialize the pixels array", function () {
                expect(displaySvc.pixels).toBeDefined();
                expect(displaySvc.pixels.length).toBe(Constants.Display.Size);
            });

            it("then should set the callback to null", function () {
                expect(displaySvc.callback).toBeNull();
            });
        });

        describe("given no callback when draw method is called", function () {
            beforeEach(function () {
                displaySvc.draw(validAddress, validValue);
            });

            it("then should not throw an exception", function () {
                expect(displaySvc.pixels[validAddress]).toBe(validValue);
            });
        });

        describe("given callback when draw method is called", function () {
            var addressCallback = -1;
            var valueCallback = -1;

            beforeEach(function () {
                displaySvc.callback = function (address, value) {
                    addressCallback = address;
                    valueCallback = value;
                };
                displaySvc.draw(validAddress, validValue);
            });

            it("then should call the callback with the address and value", function () {
                expect(addressCallback).toBe(validAddress);
                expect(valueCallback).toBe(validValue);
            });
        });

        describe("given invalid address when draw method is called", function () {
            beforeEach(function () {
                displaySvc.draw(invalidAddress, validValue);
            });

            it("then should mask the address to a valid value", function () {
                expect(displaySvc.pixels[invalidAddress & Constants.Display.Max]).toBe(validValue);
            });
        });

        describe("given invalid value when draw method is called", function () {
            beforeEach(function () {
                displaySvc.draw(validAddress, invalidValue);
            });

            it("then should mask the value to a valid value", function () {
                expect(displaySvc.pixels[validAddress]).toBe(invalidValue & Constants.Memory.ByteMask);
            });
        });

        describe("given valid address and value when draw method is called", function () {
            beforeEach(function () {
                displaySvc.draw(validAddress, validValue);
            });

            it("then should set the address to the value", function () {
                expect(displaySvc.pixels[validAddress]).toBe(validValue);
            });
        });
    });
})(Tests || (Tests = {}));
