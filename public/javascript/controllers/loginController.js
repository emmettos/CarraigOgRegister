angular.module("loginController", []).controller("LoginController", ["$scope", "$rootScope", "$location", "LoginService", 
    function ($scope, $rootScope, $location, LoginService) {
        $scope.login = function () {
            LoginService.login($scope.userCredentials)
                .then(function (response) {
                    $rootScope.homeURL = "#/home";

                    $location.path("/home");
                })
                .catch(function (response) {
                    $rootScope.alerts.push({
                        type: "danger",
                        message: response 
                    });
                });
        };
    
        $scope.changePassword = function () {

        };
    }
]);
