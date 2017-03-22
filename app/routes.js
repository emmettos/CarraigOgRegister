"use strict";

var mongoose = require("mongoose");

var config          = require("../config/config");
var authenticator   = require("./authenticator");
var authorizer      = require("./authorizer");

var group 	= require("./models/group");
var player 	= require("./models/player");
var user 	= require("./models/user");

exports = module.exports = function (app, router) {
    var currentSettings = app.currentSettings;

    router.get("/currentSettings", function (request, response, next) {
        try {
            var returnMessage = {};

            returnMessage.error = null;
            returnMessage.body = {};

            returnMessage.body.currentSettings = currentSettings;

            response.status(200).json(returnMessage);
        }
        catch (error) {
            next (error);
        }
    });

    router.get("/groups", function (request, response, next) {
        var readGroups = function () {
            var promise = new Promise(function (resolve, reject) {
                var fieldFilter = "-_id -__v";

                group.find({ "year": currentSettings.year }, fieldFilter).lean().exec(function (error, groups) {
                    try {
                        if (error) {
		  				    reject(error);
		  			    }

		  			    resolve(groups);
	  			    }
	  			    catch (error) {
	  				    reject(error);
	  			    }
	  		    });
	  	    });

	  	    return promise;
  	    };
  	    var readUsers = function () {
	  	    var promise = new Promise(function (resolve, reject) {
		  	    user.find({}).sort({ emailAddress: "ascending" }).lean().exec(function (error, users) {
		  		    try {
		  			    if (error) {
		  				    reject(error);
		  			    }

		  			    resolve(users);
		  		    }
		  		    catch (error) {
		  			    reject(error);
		  		    }
	  		    });
	  	    });

	  	    return promise;
  	    };
        var readPlayerGroupCounts = function () {
            var promise = new Promise(function (resolve, reject) {
			    player.aggregate([
				    {
					    $match: { 
                            $and: [ 
                                { yearOfBirth: { $gte: currentSettings.year - 10 } }, 
                                { lastRegisteredYear: currentSettings.year } 
                            ] 
                        }
				    },
				    {
					    $project: { year: { $year: "$dateOfBirth" } }	
				    },
				    { 
					    $group: 
					    {
						    _id: "$year",
						    total: { $sum: 1 }
					    }
				    }
			    ]).sort({ _id: "ascending"}).exec(function (error, playerGroupCounts) {
				    try {
					    if (error) {
						    reject(error);
					    }

					    resolve(playerGroupCounts);
				    }
				    catch (error) {
					    reject(error);
				    }
			    });
	  	    });

	  	    return promise;
		};

        Promise.all([readGroups(), readUsers(), readPlayerGroupCounts()])
  		    .then(function (results) {
			    var groups = results[0],
				    users = results[1],
				    playerGroupCounts = results[2],
				    groupIndex = 0,
	  			    currentGroup = null,
				    returnMessage = {};

	  		    var readManagerFullName = function (managerEmailAddress) {
		  		    var lowIndex = 0,
		  			    highIndex = users.length,
		  			    middleIndex = 0;

		  		    while (lowIndex <= highIndex) {
		  			    middleIndex = Math.floor(lowIndex + (highIndex - lowIndex) / 2);

		  			    if (users[middleIndex].emailAddress === managerEmailAddress) {
		  				    return users[middleIndex].firstName + " " + users[middleIndex].surname;
		  			    }
		  			    else if (users[middleIndex].emailAddress < managerEmailAddress) {
		  				    lowIndex = middleIndex + 1;
		  			    }
		  			    else {
		  				    highIndex = middleIndex - 1;
		  			    }
		  		    }

		  		    return managerEmailAddress;
	  		    };
	  		    var readPlayerGroupCount = function (yearOfBirth) {
		  		    var lowIndex = 0,
		  			    highIndex = playerGroupCounts.length,
		  			    middleIndex = 0;

		  		    while (lowIndex <= highIndex) {
		  			    middleIndex = Math.floor(lowIndex + (highIndex - lowIndex) / 2);

		  			    if (playerGroupCounts[middleIndex]._id === yearOfBirth) {
		  				    return playerGroupCounts[middleIndex].total;
		  			    }
		  			    else if (playerGroupCounts[middleIndex]._id < yearOfBirth) {
		  				    lowIndex = middleIndex + 1;
		  			    }
		  			    else {
		  				    highIndex = middleIndex - 1;
		  			    }
		  		    }

		  		    return 0;
	  		    };

		  	    for (groupIndex = 0; groupIndex < groups.length; groupIndex++) {
		  		    currentGroup = groups[groupIndex];

				    currentGroup.footballManager = readManagerFullName(currentGroup.footballManager);
				    currentGroup.hurlingManager = readManagerFullName(currentGroup.hurlingManager);

				    currentGroup.numberOfPlayers = readPlayerGroupCount(currentGroup.yearOfBirth);
			    }
			  	
		  	    returnMessage.error = null;
		  	    returnMessage.body = {};

		  	    returnMessage.body.groups = groups;  		

                response.status(200).json(returnMessage);
            })
            .catch(function (error) {
	  		    next(error);
	  	    });
    });

    router.get("/playersSummary/:yearOfBirth", function (request, response, next) {
        try {
            var fieldFilter = "-_id firstName surname addressLine2 lastRegisteredDate lastRegisteredYear registeredYears";

            player.find({ 
                    "yearOfBirth": request.params.yearOfBirth,
                    "lastRegisteredYear": { $gte: currentSettings.year - 1 } }, fieldFilter).lean().exec(function (error, players) {
                try {
                    var returnMessage = {};

                    if (error) {
                        throw error;
                    }

                    returnMessage.error = null;
                    returnMessage.body = {};

                    returnMessage.body.players = players;

                    response.status(200).json(returnMessage);
                }
                catch (error) {
                    next(error);
                }
            });
        }
        catch (error) {
            next (error);
        }        
    });

    router.get("/playersDetail/:yearOfBirth/:allPlayers?", authorizer.authorize({ isGroupManager: true }), function (request, response, next) {
        try {
            var filter = null;

            if (request.params.allPlayers) {
                filter = { "yearOfBirth": parseInt(request.params.yearOfBirth) }
            }
            else {
                filter = { "yearOfBirth": parseInt(request.params.yearOfBirth),
                           "lastRegisteredYear": { $gte: currentSettings.year - 1 } }
            }

            player.find(filter).lean().exec(function (error, players) {
                try {
                    var returnMessage = {};

                    if (error) {
                        next(error);
                    }

                    returnMessage.error = null;
                    returnMessage.body = {};

                    returnMessage.body.players = players;

                    response.status(200).json(returnMessage);
                }
                catch (error) {
                    next(error);
                }
            });
        }
        catch (error) {
            next(error);
        }
    });

    router.post("/register", function (request, response, next) {
        var newUser = null;

        if (!(request.body.emailAddress && request.body.password)) {
            throw new Error("Please provide name and password.");
        } 

        newUser = new user();
        
        newUser.emailAddress = request.body.emailAddress,
        newUser.firstName = request.body.firstName,
        newUser.surname = request.body.surname,
        newUser.isAdministrator = request.body.isAdministrator,
        newUser.password = request.body.password

        newUser.modifiedBy = request.body.emailAddress;

        newUser.save(function (error) {
		    var returnMessage = {};

		    try {
  			    if (error) {
  				    throw error;
  			    }

		  	    returnMessage.error = null;
		  	    returnMessage.body = {};

		        response.status(200).json(returnMessage);
	  	    }
  		    catch (error) {
  			    next(error);
		    }
        });
    });

    router.post("/resetPassword", authorizer.authorize({ isAdministrator: true }), function (request, response, next) {
  	    var readUser = function () {
	  	    var promise = new Promise(function (resolve, reject) {
		  	    user.findOne({ emailAddress: request.body.emailAddress }, function (error, currentUser) {
		  		    try {
		  			    if (error) {
		  				    reject(error);
		  			    }

		  			    resolve(currentUser);
	  			    }
	  			    catch (error) {
	  				    reject(error);
	  			    }
	  		    });
	  	    });

	  	    return promise;
        };
        var updatePassword = function (currentUser) {
	  	    var promise = new Promise(function (resolve, reject) {
  			    currentUser.password = request.body.password;

				currentUser.save(function (error) {
		  		    try {
		  			    if (error) {
		  				    reject(error);
		  			    }

		  			    resolve();
		  		    }
		  		    catch (error) {
		  			    reject(error);
		  		    }
	  		    });
	  	    });

	  	    return promise;
        };

        if (!(request.body.emailAddress && request.body.password)) {
            throw new Error("Please provide name and password.");
        } 

        readUser()
            .then(updatePassword)
            .then(function () {
                var returnMessage = {};

                returnMessage.error = null;
                returnMessage.body = {};

                response.status(200).json(returnMessage);
            })
		    .catch(function (error) {
			    next(error);
            });
    });

    router.post("/authenticate", function (request, response, next) {
        var readUser = function () {
		    var promise = new Promise(function (resolve, reject) {
			    var customError = null;

		  	    user.findOne({ emailAddress: request.body.emailAddress }, function (error, currentUser) {
				    try {
					    if (error) {
						    reject(error);
					    }

					    if (!currentUser) {
						    customError = new Error("User not found");

						    customError.code = 401;
						
						    throw customError;
					    }

					    resolve(currentUser);
				    }
				    catch (error) {
					    reject(error);
				    }
			    });
		    });

            return promise;
	    };
        var comparePassword = function (currentUser) {
		    var promise = new Promise(function (resolve, reject) {
		  	    currentUser.comparePassword(request.body.password, function (error, isMatch) {
				    try {
                        var customError = null;

					    if (error) {
						    reject(error);
					    }

                        if (!isMatch) {
                            customError = new Error("Incorrect username and password");

                            customError.code = 401;
                        
                            throw customError;
                        }

					    resolve(currentUser);
				    }
				    catch (error) {
					    reject(error);
				    }
			    });
		    });

		    return promise;
        };

        readUser()
            .then(comparePassword)
            .then(function (currentUser) {
                return authenticator.createToken(request, currentUser)
            })
            .then(function (token) {
                var returnMessage = {};

                returnMessage.error = null;
                returnMessage.body = {};

                request.logger.trace(token);

                response.set("Authorization", "Bearer " + token);

                response.status(200).json(returnMessage);
		    })
		    .catch(function (error) {
			    next(error);
		    });
    });

    router.post("/createPlayer", authorizer.authorize({ isAdministrator: true }), function (request, response, next) {
        var newPlayer = new player(),
            lastRegisteredDate = null;

        newPlayer.dateOfBirth = new Date(request.body.dateOfBirth);
        newPlayer.yearOfBirth = newPlayer.dateOfBirth.getFullYear();

        newPlayer.firstName = request.body.firstName;
        newPlayer.surname = request.body.surname;
        newPlayer.addressLine1 = request.body.addressLine1;
        newPlayer.addressLine2 = request.body.addressLine2;
        newPlayer.addressLine3 = request.body.addressLine3;
        newPlayer.addressLine4 = request.body.addressLine4;
        newPlayer.medicalConditions = request.body.medicalConditions;
        newPlayer.contactName = request.body.contactName;
        newPlayer.contactHomeNumber = request.body.contactHomeNumber;
        newPlayer.contactMobileNumber = request.body.contactMobileNumber;
        newPlayer.contactEmailAddress = request.body.contactEmailAddress;
        newPlayer.school = request.body.school;

        lastRegisteredDate = new Date(request.body.lastRegisteredDate)
        newPlayer.lastRegisteredDate = lastRegisteredDate;
        newPlayer.lastRegisteredYear = lastRegisteredDate.getFullYear();
        newPlayer.registeredYears.push(newPlayer.lastRegisteredYear);
    
        newPlayer.modifiedBy = request.payload.ID;

        newPlayer.save()
            .then(function (savedPlayer) {
                var returnMessage = {};

                returnMessage.error = null;
                returnMessage.body = {};

                returnMessage.body.player = savedPlayer.toObject();

                response.status(200).json(returnMessage);
            })
		    .catch(function (error) {
			    next(error);
		    });            
    });

    router.post("/updatePlayer", authorizer.authorize({ isAdministrator: true }), function (request, response, next) {
        player.findOne({ _id: mongoose.Types.ObjectId(request.body._id), __v: request.body.__v })
            .then(function (foundPlayer) {
                var lastRegisteredDate = null,
                    lastRegisteredYear = null,
                    customError = null;

                if (!foundPlayer) {
                    customError = new Error("Player not found");

                    customError.code = 409;
                
                    throw customError;
                }

                foundPlayer.addressLine1 = request.body.addressLine1;
                foundPlayer.addressLine2 = request.body.addressLine2;
                foundPlayer.addressLine3 = request.body.addressLine3;
                foundPlayer.addressLine4 = request.body.addressLine4;
                foundPlayer.medicalConditions = request.body.medicalConditions;
                foundPlayer.contactName = request.body.contactName;
                foundPlayer.contactHomeNumber = request.body.contactHomeNumber;
                foundPlayer.contactMobileNumber = request.body.contactMobileNumber;
                foundPlayer.contactEmailAddress = request.body.contactEmailAddress;
                foundPlayer.school = request.body.school;

                lastRegisteredDate = new Date(request.body.lastRegisteredDate)
                foundPlayer.lastRegisteredDate = lastRegisteredDate;
                foundPlayer.lastRegisteredYear = lastRegisteredDate.getFullYear();
                
                lastRegisteredYear = foundPlayer.registeredYears.find(function (item) {
                    return item === foundPlayer.lastRegisteredYear;
                });
                if (!lastRegisteredYear) {
                    foundPlayer.registeredYears.push(foundPlayer.lastRegisteredYear);
                }
            
                foundPlayer.modifiedBy = request.payload.ID;
                foundPlayer.increment();

                return foundPlayer.save();
            })
            .then(function (savedPlayer) {
                var returnMessage = {};

                returnMessage.error = null;
                returnMessage.body = {};

                returnMessage.body.player = savedPlayer.toObject();

                response.status(200).json(returnMessage);
            })
		    .catch(function (error) {
			    next(error);
		    });            
    });

    app.use("/api", router);
};
