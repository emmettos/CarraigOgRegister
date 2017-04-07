angular.module("loginController", []).controller("LoginController", ["$scope", "$rootScope", "$location", "LoginService", 
    function ($scope, $rootScope, $location, LoginService) {
        $scope.login = function () {
            $scope.loginFailed = false;

            LoginService.login($scope.userCredentials)
                .then(function (response) {
                    $rootScope.homeURL = "#/home";

                    $location.path("/home");
                })
                .catch(function (response) {
                    if (response.status === 401) {
                        $scope.loginFailed = true;
                    }
                    else {
                        $rootScope.alerts.push({
                            type: "danger",
                            message: response 
                        });
                    }
                });
        };
    
        $scope.changePassword = function () {

        };
    }
]);
