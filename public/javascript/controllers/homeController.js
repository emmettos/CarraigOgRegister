angular.module("homeController", []).controller("HomeController", ["$scope", "$rootScope", "HomeService", 
  function ($scope, $rootScope, HomeService) {
    HomeService.readGroups()
      .then(function (response) {
        $scope.groups = response.data.body.groups;	
      })
      .catch(function (response) {
        $rootScope.alerts.push({
    	    type: "danger",
    	    message: response 
        });
      });
}]);
