"use strict";

var mongoose = require("mongoose");

var authenticator = require("./authenticator");
var authorizer = require("./authorizer");

var group = require("./models/group");
var player = require("./models/player");
var user = require("./models/user");

exports = module.exports = function (app, router) {
  var currentSettings = app.currentSettings,
      currentSavedPlayer = null;

  router.get("/currentSettings", function (request, response, next) {
    try {
      var returnMessage = {};

      returnMessage.error = null;
      returnMessage.body = {};

      returnMessage.body.currentSettings = currentSettings;

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.get("/groups", authorizer.authorize(), function (request, response, next) {
    var readGroups = function () {
      return group.find({ "year": currentSettings.year }, "-_id -__v").lean().exec();
    };
    var readUsers = function () {
      return user.find({}).sort({ emailAddress: "ascending" }).lean().exec();
    };
    var readPlayerGroupCounts = function () {
      return player.aggregate([
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
        },
        { $sort: { "_id": 1 } }
      ]);
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
            highIndex = users.length - 1,
            middleIndex = 0,
            managerFullName = managerEmailAddress;

          while (lowIndex <= highIndex) {
            middleIndex = (lowIndex + highIndex) / 2 | 0;

            if (users[middleIndex].emailAddress === managerEmailAddress) {
              managerFullName = users[middleIndex].firstName + " " + users[middleIndex].surname;
              lowIndex = highIndex + 1;
            }
            else if (users[middleIndex].emailAddress < managerEmailAddress) {
              lowIndex = middleIndex + 1;
            }
            else {
              highIndex = middleIndex - 1;
            }
          }

          return managerFullName;
        };
        var readPlayerGroupCount = function (yearOfBirth) {
          var lowIndex = 0,
            highIndex = playerGroupCounts.length - 1,
            middleIndex = 0,
            playerGroupCount = 0;

          while (lowIndex <= highIndex) {
            middleIndex = (lowIndex + highIndex) / 2 | 0;

            if (playerGroupCounts[middleIndex]._id === yearOfBirth) {
              playerGroupCount = playerGroupCounts[middleIndex].total;
              lowIndex = highIndex + 1;
            }
            else if (playerGroupCounts[middleIndex]._id < yearOfBirth) {
              lowIndex = middleIndex + 1;
            }
            else {
              highIndex = middleIndex - 1;
            }
          }

          return playerGroupCount;
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

  router.get("/playersDetail/:yearOfBirth/:allPlayers?", authorizer.authorize({ isGroupManager: true }), function (request, response, next) {
    try {
      var filter = null;
      
      if (request.params.allPlayers) {
        filter = { "yearOfBirth": parseInt(request.params.yearOfBirth) }
      }
      else {
        filter = {
          "yearOfBirth": parseInt(request.params.yearOfBirth),
          "lastRegisteredYear": { $gte: currentSettings.year - 1 }
        }
      }

      player.find(filter).lean().exec()
        .then(function (players) {
          var returnMessage = {};

          returnMessage.error = null;
          returnMessage.body = {};

          returnMessage.body.players = players;

          response.status(200).json(returnMessage);
        })
        .catch(function (error) {
          next(error);
        });
    }
    catch (error) {
      next(error);
    }
  });

  router.post("/register", authorizer.authorize({ isAdministrator: true }), function (request, response, next) {
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
    var customError = null;

    if (!(request.body.emailAddress && request.body.password)) {
      customError = new Error("Username and password are required");

      customError.code = 400;

      throw customError;
    }

    user.findOne({ emailAddress: request.body.emailAddress })
      .then(function (foundUser) {
        var customError = null;

        if (!foundUser) {
          customError = new Error("User not found");

          customError.code = 401;

          throw customError;
        }

        foundUser.password = request.body.password;

        return foundUser.save();
      })
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
    user.findOne({ emailAddress: request.body.emailAddress })
      .then(function (foundUser) {
        var customError = null;

        if (!foundUser) {
          customError = new Error("User not found");

          customError.code = 401;

          throw customError;
        }

        return foundUser.comparePassword(request.body.password);
      })
      .then(function (foundUser) {
        var customError = null;

        if (!foundUser) {
          customError = new Error("Invalid password");

          customError.code = 401;

          throw customError;
        }

        return authenticator.createToken(request, foundUser)
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

  router.post("/changePassword", function (request, response, next) {
    user.findOne({ emailAddress: request.body.emailAddress })
      .then(function (foundUser) {
        var customError = null;

        if (!foundUser) {
          customError = new Error("User not found");

          customError.code = 401;

          throw customError;
        }

        return foundUser.comparePassword(request.body.password);
      })
      .then(function (foundUser) {
        var customError = null;

        if (!foundUser) {
          customError = new Error("Invalid password");

          customError.code = 401;

          throw customError;
        }

        foundUser.password = request.body.newPassword;

        return foundUser.save();
      })
      .then(function (token) {
        var returnMessage = {};

        returnMessage.error = null;
        returnMessage.body = {};

        response.status(200).json(returnMessage);
      })
      .catch(function (error) {
        next(error);
      });
  });

  router.post("/createPlayer", authorizer.authorize({ isAdministrator: true }), function (request, response, next) {
    var groupDetails = request.body.groupDetails,
        playerDetails = request.body.playerDetails,
        newPlayer = new player(),
        lastRegisteredDate = null;

    newPlayer.dateOfBirth = new Date(playerDetails.dateOfBirth);
    newPlayer.yearOfBirth = newPlayer.dateOfBirth.getFullYear();

    newPlayer.firstName = playerDetails.firstName;
    newPlayer.surname = playerDetails.surname;
    newPlayer.addressLine1 = playerDetails.addressLine1;
    newPlayer.addressLine2 = playerDetails.addressLine2;
    newPlayer.addressLine3 = playerDetails.addressLine3;
    newPlayer.addressLine4 = playerDetails.addressLine4;
    newPlayer.medicalConditions = playerDetails.medicalConditions;
    newPlayer.contactName = playerDetails.contactName;
    newPlayer.contactHomeNumber = playerDetails.contactHomeNumber;
    newPlayer.contactMobileNumber = playerDetails.contactMobileNumber;
    newPlayer.contactEmailAddress = playerDetails.contactEmailAddress;
    newPlayer.school = playerDetails.school;

    lastRegisteredDate = new Date(playerDetails.lastRegisteredDate)
    newPlayer.lastRegisteredDate = lastRegisteredDate;
    newPlayer.lastRegisteredYear = lastRegisteredDate.getFullYear();
    newPlayer.registeredYears.push(newPlayer.lastRegisteredYear);

    newPlayer.modifiedBy = request.payload.userProfile.ID;

    newPlayer.save()
      .then(function (savedPlayer) {
        var query = { "year": groupDetails.year, "yearOfBirth": groupDetails.yearOfBirth },
            update = { "lastUpdatedDate": new Date() };

        currentSavedPlayer = savedPlayer;

        return group.findOneAndUpdate(query, update);
      })
      .then(function () {
        var returnMessage = {};

        returnMessage.error = null;
        returnMessage.body = {};

        returnMessage.body.player = currentSavedPlayer.toObject();

        response.status(200).json(returnMessage);
      })
      .catch(function (error) {
        next(error);
      });
  });

  router.post("/updatePlayer", authorizer.authorize({ isAdministrator: true }), function (request, response, next) {
    var groupDetails = request.body.groupDetails,
        playerDetails = request.body.playerDetails;

    player.findOne({ "_id": mongoose.Types.ObjectId(playerDetails._id), "__v": playerDetails.__v })
      .then(function (foundPlayer) {
        var lastRegisteredDate = null,
          lastRegisteredYear = null,
          customError = null;

        if (!foundPlayer) {
          customError = new Error("Player not found");

          customError.code = 409;

          throw customError;
        }

        foundPlayer.addressLine1 = playerDetails.addressLine1;
        foundPlayer.addressLine2 = playerDetails.addressLine2;
        foundPlayer.addressLine3 = playerDetails.addressLine3;
        foundPlayer.addressLine4 = playerDetails.addressLine4;
        foundPlayer.medicalConditions = playerDetails.medicalConditions;
        foundPlayer.contactName = playerDetails.contactName;
        foundPlayer.contactHomeNumber = playerDetails.contactHomeNumber;
        foundPlayer.contactMobileNumber = playerDetails.contactMobileNumber;
        foundPlayer.contactEmailAddress = playerDetails.contactEmailAddress;
        foundPlayer.school = playerDetails.school;

        lastRegisteredDate = new Date(playerDetails.lastRegisteredDate)
        foundPlayer.lastRegisteredDate = lastRegisteredDate;
        foundPlayer.lastRegisteredYear = lastRegisteredDate.getFullYear();

        lastRegisteredYear = foundPlayer.registeredYears.find(function (item) {
          return item === foundPlayer.lastRegisteredYear;
        });
        if (!lastRegisteredYear) {
          foundPlayer.registeredYears.push(foundPlayer.lastRegisteredYear);
        }

        foundPlayer.modifiedBy = request.payload.userProfile.ID;
        foundPlayer.increment();

        return foundPlayer.save();
      })
      .then(function (savedPlayer) {
        var query = { "year": groupDetails.year, "yearOfBirth": groupDetails.yearOfBirth },
            update = { "lastUpdatedDate": new Date() };

        currentSavedPlayer = savedPlayer;

        return group.findOneAndUpdate(query, update);
      })
      .then(function () {
        var returnMessage = {};

        returnMessage.error = null;
        returnMessage.body = {};

        returnMessage.body.player = currentSavedPlayer.toObject();

        response.status(200).json(returnMessage);
      })
      .catch(function (error) {
        next(error);
      });
  });

  router.post("/writeLog", authorizer.authorize(), function (request, response, next) {
    request.logger.error({ clientError: request.body });
    
    var returnMessage = {};

    returnMessage.error = null;
    returnMessage.body = {};

    response.status(200).json(returnMessage);
  });

  app.use("/api", router);

  app.use(function (request, response) {
    response.sendfile("./dist/index.html");
  });
};
