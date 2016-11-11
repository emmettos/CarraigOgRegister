angular.module("playersSummaryController", []).controller("PlayersSummaryController", ["$scope", "$routeParams", "$rootScope", "PlayersService", 
  function ($scope, $routeParams, $rootScope, PlayersService) {
    $scope.groupName = $routeParams.groupName;
        
    PlayersService.readPlayerSummaries($routeParams.yearOfBirth)
      .then(function (response) {
        var playerIndex = 0,
            registeredCount = 0,
            newCount = 0,
            missingCount = 0;

        $scope.players = response.data.body.players;

        $scope.playerStateEnum = {
          EXISTING: 0,
          NEW: 1,
          MISSING: 2
        };

        for (playerIndex = 0; playerIndex < $scope.players.length; playerIndex++) {
          if ($scope.players[playerIndex].lastRegisteredYear === $rootScope.currentYear) {
            registeredCount++;

            if ($scope.players[playerIndex].registeredYears.length === 1) {
              $scope.players[playerIndex].playerState = $scope.playerStateEnum.NEW;

              newCount++;
            }
            else {
              $scope.players[playerIndex].playerState = $scope.playerStateEnum.EXISTING;
            }
          }
          else {
            $scope.players[playerIndex].playerState = $scope.playerStateEnum.MISSING;

            missingCount++;
          }
        }

        $scope.registeredCount = registeredCount;
        $scope.newCount = newCount;
        $scope.missingCount = missingCount;
      })
      .catch(function (response) {
        $rootScope.alerts.push({
          type: "danger",
          message: response 
        });
      });

    $scope.searchPlayer = function (player) {
      var searchPlayerName = function () {
        if ($scope.nameFilter === undefined) {
          return true;
        }

        if (player.firstName.toLowerCase().indexOf($scope.nameFilter.toLowerCase()) != -1 ||
            player.surname.toLowerCase().indexOf($scope.nameFilter.toLowerCase()) != -1) {
          return true;
        }

        return false;
      };

      if ($scope.searchName === undefined && $scope.currentlyRegisteredOnly === undefined) {
        return true;
      }

      if ($scope.currentlyRegisteredOnly) {      
        if (player.lastRegisteredYear === $rootScope.currentYear) {
          return searchPlayerName();
        }

        return false;
      }

      return searchPlayerName();
    }
}]);
