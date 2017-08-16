angular.module("app.service.loginService", []).factory("loginService", ["$http", 
    function ($http) {
        return {
            login : function (userCredentials) {
                return $http.post("/api/authenticate", userCredentials);
            },

            changePassword : function (userCredentials) {
                return $http.post("/api/changePassword", userCredentials);
            }
        };
    }
]);
