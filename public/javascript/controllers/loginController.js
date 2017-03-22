angular.module("loginController", []).controller("LoginController", ["$scope", "$rootScope", "$location", "LoginService", "AuthenticationService",
    function ($scope, $rootScope, $location, LoginService, AuthenticationService) {
        if (!$rootScope.currentSettings) {
            $location.path("/");

            return;
        }

        $rootScope.isAuthenicated = false;

        $scope.login = function () {
            LoginService.login($scope.userCredentials)
                .then(function (response) {
                    $location.path("/");
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
