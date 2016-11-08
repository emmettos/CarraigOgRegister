angular.module("homeService", []).factory("HomeService", ["$http", function ($http) {
  return {
  	readGroups : function () {
      return $http.get("/api/groups");
    }
  };
}]);
