/// <reference path='jasmine.d.ts'/>
/// <reference path='../app/defs/angular.d.ts'/>
/// <reference path='angular-mocks.d.ts'/>
/// <reference path='../app/defs/jquery.d.ts'/>
/// <reference path='../app/app.ts'/>
/// <reference path='../app/directives/hexadecimal.ts'/>
var Tests;
(function (Tests) {
    describe("hexadecimal directive", function () {
        var $scope;
        var form;

        beforeEach(function () {
            module('app');
        });

        beforeEach(function () {
            var html = '<form name="form">';
            html += '<input type="text" id="hexValue" name="hexValue" ng-model="hexModelValue" hexadecimal=""/>';
            html += '</form>';

            inject(function ($compile, $rootScope) {
                $scope = $rootScope.$new();

                var elem = angular.element(html);
                $compile(elem)($scope);
                form = $scope.form;
            });
        });

        describe("given invalid input when called", function () {
            it("then should reject the input by setting the hexadecimal validation to false and returning undefined", function () {
                form.hexValue.$setViewValue("zoo");
                expect($scope.hexModelValue).toBe(undefined);
                expect(form.hexValue.$valid).toBe(false);
            });
        });

        describe("given valid input when called", function () {
            it("then should accept the input by setting the hexadecimal validation to true", function () {
                form.hexValue.$setViewValue("fff");
                expect($scope.hexModelValue).toBe("fff");
                expect(form.hexValue.$valid).toBe(true);
            });
        });
    });
})(Tests || (Tests = {}));
