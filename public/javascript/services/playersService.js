angular.module("playersService", []).factory("PlayersService", ["$http", 
    function ($http) {
        return {
            readPlayersSummary : function (yearOfBirth) {
                return $http.get("/api/playersSummary/" + yearOfBirth);
	        },

            readPlayersDetail : function (yearOfBirth) {
                return $http.get("/api/playersDetail/" + yearOfBirth);                    
	        },

            readAllPlayersDetail : function (yearOfBirth) {
                return $http.get("/api/playersDetail/" + yearOfBirth + "/true");
	        },

            createPlayer : function (playerDetails) {
                return $http.post("/api/createPlayer", playerDetails);
            },

            updatePlayer : function (playerDetails) {
                return $http.post("/api/updatePlayer", playerDetails);
            }
        };
    }
]);
