angular.module("playersService", []).factory("PlayersService", ["$http", 
	function ($http) {
	  return {
	  	readPlayerSummaries : function (yearOfBirth) {
	      return $http.get("/api/playerSummaries/" + yearOfBirth);
	    }
	  };
}]);
