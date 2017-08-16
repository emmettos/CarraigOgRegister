angular.module("app.service.authenticationService", []).factory("authenticationService", ["$window", 
    function ($window) {
        return {
            saveToken : function (token) {
                $window.localStorage["carraig_og_jwt_token"] = token;
            },

            readPayload : function () {
                var token = $window.localStorage["carraig_og_jwt_token"],
                    base64Payload,
                    payload;

                if (token) {
                    base64Payload = token.split(".")[1];
                    payload = JSON.parse(atob(base64Payload.replace("-", "+").replace("_", "/")));

                    if (Math.round(new Date().getTime()) <= payload.exp * 1000) {
                        return payload;
                    }

                    $window.localStorage.removeItem("carraig_og_jwt_token");
                }

                return null;
            },

            getToken : function () {
                return $window.localStorage["carraig_og_jwt_token"];
            },

            deleteToken : function () {
                $window.localStorage.removeItem("carraig_og_jwt_token");
            }
        };
    }
]);
