angular.module("appRoutes", [])
  .config(["$routeProvider", "$locationProvider", function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/home.html",
        controller: "HomeController"
      })
      .when("/group/:yearOfBirth", {
        templateUrl: "views/group.html",
        controller: "GroupController"
      })
      .otherwise({ redirectTo: "/"});
  }])
  .controller("ErrorController", ["$scope", "$rootScope", function ($scope, $rootScope) {
    $rootScope.alerts = [];

    $scope.closeAlert = function (index) {
      $rootScope.alerts.splice(index, 1);
    };
  }]);
