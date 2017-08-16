angular.module("appRoutes", [])
    .config(["$routeProvider", "$locationProvider", 
        function ($routeProvider) {
            $routeProvider
                .when("/", {
                    templateUrl: "views/login.html",
                    controller: "loginController"
                })
                .when("/home", {
                    templateUrl: "views/home.html",
                    controller: "homeController"
                })
                .when("/playersSummary/:groupName/:yearOfBirth", {
                    templateUrl: "views/players-summary.html",
                    controller: "playersController"
                })
                .when("/playersDetail/:groupName/:yearOfBirth", {
                    templateUrl: "views/players-detail.html",
                    controller: "playersController",
                    readPlayersDetail: true
                })
                .when("/managePlayers", {
                    templateUrl: "views/manage-players.html",
                    controller: "managePlayersController"
                })
                .otherwise({ redirectTo: "/" });
        }
    ])
    .controller("NavbarController", ["$scope", "$rootScope", "$location", "$window", "authenticationService", 
        function ($scope, $rootScope, $location, $window, authenticationService) {
            $scope.isCollapsed = true;

            $scope.logout = function () {
                authenticationService.deleteToken();

                $rootScope.homeURL = "#/";
                $rootScope.payload = null;

                $window.location = "/";
            };
        }
    ])
    .controller("ErrorController", ["$scope", "$rootScope", 
        function ($scope, $rootScope) {
            $rootScope.alerts = [];

            $scope.closeAlert = function (index) {
                $rootScope.alerts.splice(index, 1);
            };
        }
    ]);
