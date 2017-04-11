angular.module("managePlayersController", []).controller("ManagePlayersController", ["$scope", "$rootScope","$location", "$anchorScroll", "$window", "PlayersService", 
    function ($scope, $rootScope, $location, $anchorScroll, $window, PlayersService) {
        var me = this;

        if (!$rootScope.payload) {
            $location.path("/");

            return;
        }

        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(),
            minDate: new Date(2005, 0, 1),
            startingDay: 1
        };

        $scope.altInputFormats = ['d!/M!/yyyy'];

        $scope.searchedForPlayers = false;
        $scope.playerSelected = false;
        $scope.playerSaved = false;

        $scope.dateOfBirth = null;
        $scope.matchedPlayersDetails = [];
        $scope.playerDetails = {};

        $scope.dateOfBirthDatePickerStatus = {
            opened: false
        };

        $scope.openDateOfBirthDatePicker = function () {
            $scope.dateOfBirthDatePickerStatus.opened = true;
        };

        $scope.lastRegisteredDatePickerStatus = {
            opened: false
        };

        $scope.openlastRegisteredDatePicker = function () {
            $scope.lastRegisteredDatePickerStatus.opened = true;
        };

        $scope.$watch("dateOfBirth", function () {
            me.resetPage(false);
            me.resetPlayerDetails();
        });

        $scope.readPlayersForYear = function () {
            PlayersService.readAllPlayersDetail($scope.selectedYear)
                .then(function (response) {
                    $scope.playersForYear = response.data.body.players;

                    $scope.dateOfBirth = null;

                    me.resetPage(false);
                    me.resetPlayerDetails();
                });
        };

        $scope.searchPlayers = function () {
            var dateOfBirthISOString = $scope.dateOfBirth.toISOString();

            if (!$scope.dateOfBirth) {
                return;
            }
            
            $scope.matchedPlayersDetails = $scope.playersForYear.filter(function (item) {
                return item.dateOfBirth === dateOfBirthISOString;
            });

            $scope.searchedForPlayers = true;
        };

        $scope.readPlayerDetails = function (matchedPlayerDetails) {
            $scope.playerSelected = true;

            $scope.playerDetails._id = matchedPlayerDetails._id;
            $scope.playerDetails.__v = matchedPlayerDetails.__v;

            $scope.playerDetails.lastRegisteredDate = moment(matchedPlayerDetails.lastRegisteredDate, moment.ISO_8601, true).toDate();
            
            $scope.playerDetails.firstName = matchedPlayerDetails.firstName;
            $scope.playerDetails.surname = matchedPlayerDetails.surname;
            $scope.playerDetails.dateOfBirth = matchedPlayerDetails.dateOfBirth;
            $scope.playerDetails.addressLine1 = matchedPlayerDetails.addressLine1;
            $scope.playerDetails.addressLine2 = matchedPlayerDetails.addressLine2;
            $scope.playerDetails.addressLine3 = matchedPlayerDetails.addressLine3;
            $scope.playerDetails.medicalConditions = matchedPlayerDetails.medicalConditions;
            $scope.playerDetails.school = matchedPlayerDetails.school;
            $scope.playerDetails.contactName = matchedPlayerDetails.contactName;
            $scope.playerDetails.contactEmailAddress = matchedPlayerDetails.contactEmailAddress;
            $scope.playerDetails.contactMobileNumber = matchedPlayerDetails.contactMobileNumber;
            $scope.playerDetails.contactHomeNumber = matchedPlayerDetails.contactHomeNumber;
        };

        $scope.savePlayer = function () {
            if ($scope.playerDetails._id) {
                PlayersService.updatePlayer($scope.playerDetails, $rootScope.currentSettings.year, $scope.selectedYear)
                    .then(function (response) {
                        var savedPlayer = null,
                            returnedPlayer = response.data.body.player;

                        savedPlayer = $scope.playersForYear.find(function (item) {
                            return item._id === returnedPlayer._id;
                        });
                        
                        savedPlayer.__v = returnedPlayer.__v;

                        savedPlayer.lastRegisteredDate = moment(returnedPlayer.lastRegisteredDate, moment.ISO_8601, true).toDate();
                        
                        savedPlayer.addressLine1 = returnedPlayer.addressLine1;
                        savedPlayer.addressLine2 = returnedPlayer.addressLine2;
                        savedPlayer.addressLine3 = returnedPlayer.addressLine3;
                        savedPlayer.medicalConditions = returnedPlayer.medicalConditions;
                        savedPlayer.school = returnedPlayer.school;
                        savedPlayer.contactName = returnedPlayer.contactName;
                        savedPlayer.contactEmailAddress = returnedPlayer.contactEmailAddress;
                        savedPlayer.contactMobileNumber = returnedPlayer.contactMobileNumber;
                        savedPlayer.contactHomeNumber = returnedPlayer.contactHomeNumber;
                        
                        me.resetPage(true);

                        $window.scrollTo(0, 0);
                    })
                    .catch(function (response) {
                        $rootScope.alerts.push({
                            type: "danger",
                            message: response 
                        });

                        $window.scrollTo(0, 0);
                    });
            }
            else {
                $scope.playerDetails.dateOfBirth = $scope.dateOfBirth.toISOString();

                PlayersService.createPlayer($scope.playerDetails)
                    .then(function (response) {
                        var returnedPlayer = response.data.body.player;

                        returnedPlayer.lastRegisteredDate = moment(returnedPlayer.lastRegisteredDate, moment.ISO_8601, true).toDate();

                        $scope.playersForYear.push(returnedPlayer)

                        me.resetPage(true);

                        $window.scrollTo(0, 0);
                    })
                    .catch(function (response) {
                        $rootScope.alerts.push({
                            type: "danger",
                            message: response 
                        });

                        $window.scrollTo(0, 0);
                    });                
            }
        };
        
        $scope.reset = function () {
            $scope.dateOfBirth = null;

            me.resetPage(false);
            me.resetPlayerDetails();

            $window.scrollTo(0, 0);
        };

        me.resetPage = function (playerSaved) {
            $scope.matchedPlayersDetails.splice(0, $scope.matchedPlayersDetails.length)

            $scope.searchedForPlayers = false;
            $scope.playerSelected = false;
            $scope.playerSaved = playerSaved;
        };

        me.resetPlayerDetails = function () {
            $scope.playerDetails._id = null;
            $scope.playerDetails.__v = null;

            $scope.playerDetails.lastRegisteredDate = null;
            
            $scope.playerDetails.firstName = "";
            $scope.playerDetails.surname = "";
            $scope.playerDetails.dateOfBirth = "";
            $scope.playerDetails.addressLine1 = "";
            $scope.playerDetails.addressLine2 = "";
            $scope.playerDetails.addressLine3 = "";
            $scope.playerDetails.medicalConditions = "";
            $scope.playerDetails.school = "";
            $scope.playerDetails.contactName = "";
            $scope.playerDetails.contactEmailAddress = "";
            $scope.playerDetails.contactMobileNumber = "";
            $scope.playerDetails.contactHomeNumber = "";
        };
    }
]);
