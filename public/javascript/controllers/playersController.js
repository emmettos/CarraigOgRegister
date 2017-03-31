angular.module("playersController", []).controller("PlayersController", ["$scope", "$route", "$routeParams", "$rootScope", "$location", "PlayersService", 
    function ($scope, $route, $routeParams, $rootScope, $location, PlayersService) {
        var readPlayers = PlayersService.readPlayersSummary,
            playerStateEnum = {
                EXISTING: 0,
                NEW: 1,
                MISSING: 2 
            };

        if (!$rootScope.payload) {
            $location.path("/");

            return;
        }

        $scope.groupName = $routeParams.groupName;
        
        $scope.sortKey = "surname";
        $scope.reverse = false;

        if ($route.current.readPlayersDetail) {
            readPlayers = PlayersService.readPlayersDetail;
        }

        readPlayers($routeParams.yearOfBirth)
            .then(function (response) {
                var playerIndex = 0,
                    registeredCount = 0,
                    newCount = 0,
                    missingCount = 0;

                $scope.players = response.data.body.players;

                for (playerIndex = 0; playerIndex < $scope.players.length; playerIndex++) {
                    if ($scope.players[playerIndex].lastRegisteredYear === $rootScope.currentSettings.year) {
                        registeredCount++;

                        if ($scope.players[playerIndex].registeredYears.length === 1) {
                            $scope.players[playerIndex].playerState = playerStateEnum.NEW;

                            newCount++;
                        }
                        else {
                            $scope.players[playerIndex].playerState = playerStateEnum.EXISTING;
                        }
                    }
                    else {
                        $scope.players[playerIndex].playerState = playerStateEnum.MISSING;

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

        $scope.headerSortCSSClass = function (keyName) {
            var CSSClass = "fa fa-sort";

            if ($scope.sortKey === keyName) {
                if ($scope.reverse) {
                    CSSClass = "fa fa-sort-desc";
                }
                else {
                    CSSClass = "fa fa-sort-asc";
                }
            }

            return CSSClass;
        };

        $scope.playerLabelCSSClass = function (playerState) {
            var CSSClass = "label-primary";

            if (playerState === playerStateEnum.NEW) {
                CSSClass = "label-success"
            }
            else if (playerState === playerStateEnum.MISSING) {
                CSSClass = "label-warning"                
            }

            return CSSClass;
        };

        $scope.playerPanelCSSClass = function (playerState) {
            var CSSClass = "panel-primary";

            if (playerState === playerStateEnum.NEW) {
                CSSClass = "panel-success"
            }
            else if (playerState === playerStateEnum.MISSING) {
                CSSClass = "panel-warning"                
            }

            return CSSClass;
        };

        $scope.playerRowCSSClass = function (playerState) {
            var CSSClass = "";

            if (playerState === playerStateEnum.MISSING) {
                CSSClass = "missing"
            }

            return CSSClass;
        };

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

            if ($scope.nameFilter === undefined && $scope.currentlyRegisteredOnly === undefined) {
                return true;
            }

            if ($scope.currentlyRegisteredOnly) {      
                if (player.lastRegisteredYear === $rootScope.currentSettings.year) {
                    return searchPlayerName();
                }

                return false;
            }

            return searchPlayerName();
        };

        $scope.sort = function (keyName) {
            $scope.sortKey = keyName;
            $scope.reverse = !$scope.reverse;
        }
    }
]);
