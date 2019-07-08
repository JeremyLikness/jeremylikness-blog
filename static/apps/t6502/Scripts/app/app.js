///<reference path="defs/angular.d.ts"/>
///<reference path="defs/jquery.d.ts"/>
///<reference path="./globalConstants.ts"/>
///<reference path="emulator/cpu.ts"/>
/*

6502 emulator in TypeScript and AngularJS

(c) 2013 Jeremy Likness

http://csharperimage.jeremylikness.com/

Released under MIT license:

https://t6502.codeplex.com/license
*/
var Main;
(function (Main) {
    var App = (function () {
        function App() {
        }
        App.Filters = angular.module("app.filters", []);
        App.Directives = angular.module("app.directives", []);
        App.Services = angular.module("app.services", []);
        App.Controllers = angular.module("app.controllers", ["app.services"]);
        App.Module = angular.module("app", ["app.filters", "app.directives", "app.services", "app.controllers"]);
        return App;
    })();
    Main.App = App;
})(Main || (Main = {}));
