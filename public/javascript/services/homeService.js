angular.module("homeService", []).factory("HomeService", ["$http", function ($http) {
  return {
  	getGroups : function () {
      return $http.get("/api/groups");
    }
  };
}]);
