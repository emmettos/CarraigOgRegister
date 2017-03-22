angular.module("loginService", []).factory("LoginService", ["$http", 
    function ($http) {
        return {
            login : function (userCredentials) {
                return $http.post("/api/authenticate", userCredentials);
            }
        };
    }
]);
