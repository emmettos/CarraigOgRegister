angular.module("appRoutes", [])
    .config(["$routeProvider", "$locationProvider", 
        function ($routeProvider) {
            $routeProvider
                .when("/", {
                    templateUrl: "views/home.html",
                    controller: "HomeController"
                })
                .when("/login", {
                    templateUrl: "views/login.html",
                    controller: "LoginController"
                })
                .when("/playersSummary/:groupName/:yearOfBirth", {
                    templateUrl: "views/players-summary.html",
                    controller: "PlayersController"
                })
                .when("/playersDetail/:groupName/:yearOfBirth", {
                    templateUrl: "views/players-detail.html",
                    controller: "PlayersController",
                    readPlayersDetail: true
                })
                .when("/managePlayers", {
                    templateUrl: "views/manage-players.html",
                    controller: "ManagePlayersController"
                })
                .otherwise({ redirectTo: "/" });
        }
    ])
    .controller("NavbarController", ["$scope", "$rootScope", "$location", "$window", "AuthenticationService", 
        function ($scope, $rootScope, $location, $window, AuthenticationService) {
            $scope.isCollapsed = true;

            $scope.logout = function () {
                AuthenticationService.deleteToken();

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
