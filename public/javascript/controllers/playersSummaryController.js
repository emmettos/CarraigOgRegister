angular.module("playersSummaryController", []).controller("PlayersSummaryController", ["$scope", "$routeParams", "$rootScope", "PlayersService", 
  function ($scope, $routeParams, $rootScope, PlayersService) {
    PlayersService.readPlayerSummaries($routeParams.yearOfBirth)
      .then(function (response) {
        $scope.players = response.data.body.players;  
      })
      .catch(function (response) {
        $rootScope.alerts.push({
          type: "danger",
          message: response 
        });
      });
}]);
