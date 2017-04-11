angular.module("loginController", []).controller("LoginController", ["$scope", "$rootScope", "$location", "LoginService", 
    function ($scope, $rootScope, $location, LoginService) {
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

            LoginService.login($scope.userCredentials)
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
                            message: response 
                        });
                    }
                });
        };
    
        me.changePassword = function () {
            LoginService.changePassword($scope.userCredentials)
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
                            message: response 
                        });
                    }
                });
        };
    }
]);
