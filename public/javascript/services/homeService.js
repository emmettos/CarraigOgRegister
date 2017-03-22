angular.module("homeService", []).factory("HomeService", ["$http", 
    function ($http) {
        return {
            readCurrentSettings : function () {
                return $http.get("/api/currentSettings");
            },

            readGroups : function () {
                return $http.get("/api/groups");
            }
        };
    }
]);
