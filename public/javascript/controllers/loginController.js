angular.module("app.controller.loginController", []).controller("loginController", ["$scope", "$rootScope", "$location", "loginService", 
    function ($scope, $rootScope, $location, loginService) {
        var me  = this;

        $scope.changePasswordMode = false;
        $scope.loginFailed = false;
        $scope.passwordChangeded = false;

        $scope.toggleChangePasswordMode = function (loginForm) {
            $scope.changePasswordMode = !$scope.changePasswordMode; 
            $scope.loginFailed = false;  
            $scope.passwordChanged = false; 

            $scope.userCredentials.password = "";
            $scope.userCredentials.newPassword = "";
            $scope.userCredentials.passwordConfirm = "";
        };
        
        $scope.submit = function () {
            if ($scope.changePasswordMode) {
                me.changePassword();
            }
            else {
                me.login();
            }
        };

        me.login = function () {
            $scope.loginFailed = false;

            loginService.login($scope.userCredentials)
                .then(function (response) {
                    $rootScope.homeURL = "#/home";

                    $location.path("/home");
                })
                .catch(function (response) {
                    if (response.status === 401) {
                        $scope.errorMessage = response.data.error.message;
                        $scope.loginFailed = true;
                    }
                    else {
                        $rootScope.alerts.push({
                            type: "danger",
                            response: response 
                        });
                    }
                });
        };
    
        me.changePassword = function () {
            loginService.changePassword($scope.userCredentials)
                .then(function (response) {
                    $scope.passwordChanged = true;
                    $scope.changePasswordMode = false;

                    $scope.userCredentials.password = "";
                    $scope.userCredentials.newPassword = "";
                    $scope.userCredentials.passwordConfirm = "";
                })
                .catch(function (response) {
                    if (response.status === 401) {
                        $scope.errorMessage = response.data.error.message;
                        $scope.loginFailed = true;
                    }
                    else {
                        $rootScope.alerts.push({
                            type: "danger",
                            response: response 
                        });
                    }
                });
        };
    }
]);
