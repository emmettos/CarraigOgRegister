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

            createPlayer : function (playerDetails, year, yearOfBirth) {
                var postData = {};

                postData.groupDetails = {};
                postData.groupDetails.year = year;
                postData.groupDetails.yearOfBirth = yearOfBirth;
                
                postData.playerDetails = playerDetails;

                return $http.post("/api/createPlayer", postData);
            },

            updatePlayer : function (playerDetails, year, yearOfBirth) {
                var postData = {};

                postData.groupDetails = {};
                postData.groupDetails.year = year;
                postData.groupDetails.yearOfBirth = yearOfBirth;
                
                postData.playerDetails = playerDetails;

                return $http.post("/api/updatePlayer", postData);
            }
        };
    }
]);
