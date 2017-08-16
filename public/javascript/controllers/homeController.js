angular.module("app.controller.homeController", []).controller("homeController", ["$scope", "$rootScope", "homeService", 
    function ($scope, $rootScope, homeService) {
        if (!$rootScope.payload) {
            $location.path("/");

            return;
        }

        homeService.readCurrentSettings()
            .then(function (response) {
                $rootScope.currentSettings = response.data.body.currentSettings;

                return homeService.readGroups();
            })
            .then(function (response) {
                var groupIndex = 0,
                    payloadGroupIndex = 0,
                    payloadGroupFound = false;

                $scope.groups = response.data.body.groups;	

                for (groupIndex = 0; groupIndex < $scope.groups.length; groupIndex++) {
                    $scope.groups[groupIndex].API = "playersSummary";

                    if ($rootScope.payload) {
                        if ($rootScope.payload.isAdministrator) {
                            $scope.groups[groupIndex].API = "playersDetail";
                        }
                        else if ($rootScope.payload.isManager) {
                            payloadGroupIndex = 0;
                            payloadGroupFound = false;

                            while (payloadGroupIndex < $rootScope.payload.groups.length && !payloadGroupFound) {
                                if ($rootScope.payload.groups[payloadGroupIndex++] === $scope.groups[groupIndex].yearOfBirth) {
                                    $scope.groups[groupIndex].API = "playersDetail";

                                    payloadGroupFound = true;
                                }
                            }
                        }
                    }
                }
            })
            .catch(function (response) {
                $rootScope.alerts.push({
                    type: "danger",
                    response: response 
                });
            });
    }
]);
