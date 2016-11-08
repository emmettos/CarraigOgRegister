"use strict";

var Group 	= require("./models/group");
var Manager = require("./models/manager");
var Player 	= require("./models/player");

exports = module.exports = function (app) {
  app.get('/api/groups', function (request, response, next) {
  	var readGroups = new Promise(function (resolve, reject) {
			var fieldFilter = "-_id -__v";

	  	Group.find({}, fieldFilter).exec(function (error, groups) {
	  		try {
	  			if (error) {
	  				reject(error);
	  			}

	  			request.logger.trace(groups);

	  			resolve(groups);
  			}
  			catch (error) {
  				reject(error);
  			}
  		});
  	});
  	var readManagers = new Promise(function (resolve, reject) {
	  	Manager.find({}).sort({ emailAddress: "ascending" }).lean().exec(function (error, managers) {
	  		try {
	  			if (error) {
	  				reject(error);
	  			}

	  			resolve(managers);
	  		}
	  		catch (error) {
	  			reject(error);
	  		}
  		});
  	});
  	var readPlayerGroupCounts = new Promise(function (resolve, reject) {
			Player.aggregate([
				{
				 	$project: { year: { $year: "$dateOfBirth" }}	
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

  	Promise.all([readGroups, readManagers, readPlayerGroupCounts]).then(function (results) {
			var groups = results[0],
					managers = results[1],
					playerGroupCounts = results[2],
					groupIndex = 0,
  				currentGroup = null;

  		var readManagerFullName = function (managerEmailAddress) {
	  		var lowIndex = 0,
	  				highIndex = managers.length,
	  				middleIndex = 0;

	  		while (lowIndex <= highIndex) {
	  			middleIndex = Math.floor(lowIndex + (highIndex - lowIndex) / 2);

	  			if (managers[middleIndex].emailAddress === managerEmailAddress) {
	  				return managers[middleIndex].firstName + " " + managers[middleIndex].surname;
	  			}
	  			else if (managers[middleIndex].emailAddress < managerEmailAddress) {
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
		  	
	  	var returnMessage = {};

	  	returnMessage.error = null;
	  	returnMessage.body = {};

	  	returnMessage.body.groups = groups;  		

	    response.status(200).json(returnMessage);
  	}).catch(function (error) {
  		return next(error);
  	});
  });

  app.get('/api/playerSummaries/:yearOfBirth', function (request, response, next) {
  	var fieldFilter = "-_id firstName surname addressLine2 lastRegisteredDate lastRegisteredYear";

  	Player.find({ "yearOfBirth": request.params.yearOfBirth }, fieldFilter).exec(function (error, players) {
  		try {
  			if (error) {
  				return next(error);
  			}

		  	var returnMessage = {};

		  	returnMessage.error = null;
		  	returnMessage.body = {};

		  	returnMessage.body.players = players;

		    response.status(200).json(returnMessage);
  		}
  		catch (error) {
  			return next(error);
  		}
		});
  });

  // app.get("/", function (request, response) {
  //   response.sendfile("./public/index.html");
  // });
};
