"use strict";

var mongoose = require("mongoose");

var authenticator = require("./authenticator");
var authorizer = require("./authorizer");

var group = require("./models/group");
var player = require("./models/player");
var user = require("./models/user");

var emailHelper = require('sendgrid').mail;
var sendGrid = require('sendgrid')('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');


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
      next(error);
    }
  });

  router.get("/groups", authorizer.authorize(), function (request, response, next) {
    var readGroups = group.find({ "year": currentSettings.year }, "-_id -__v").lean().exec(),
        readUsers = user.find({}).sort({ emailAddress: "ascending" }).lean().exec(),
        readPlayerGroupCounts = player.aggregate([
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

    Promise.all([readGroups, readUsers, readPlayerGroupCounts])
      .then(function ([groups, users, playerGroupCounts]) {
        var groupIndex = 0,
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

          currentGroup.footballManagerFullName = readManagerFullName(currentGroup.footballManager);
          currentGroup.hurlingManagerFullName = readManagerFullName(currentGroup.hurlingManager);

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

  router.get("/coaches", authorizer.authorize({ isAdministrator: true }), function (request, response, next) {
    readCoaches(currentSettings, response, next);
  });

  router.get("/playersDetail/:yearOfBirth/:allPlayers?", authorizer.authorize({ isAdministrator: true }), function (request, response, next) {
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

      customError.httpCode = 400;

      throw customError;
    }

    user.findOne({ emailAddress: request.body.emailAddress })
      .then(function (foundUser) {
        var customError = null;

        if (!foundUser) {
          customError = new Error("User not found");

          customError.httpCode = 401;

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

          customError.httpCode = 401;

          throw customError;
        }
        
        if (foundUser.password === "") {
          customError = new Error("User not validated");

          customError.httpCode = 401;

          throw customError;
        }

        return foundUser.comparePassword(request.body.password);
      })
      .then(function (foundUser) {
        var customError = null;

        if (!foundUser) {
          customError = new Error("Invalid password");

          customError.httpCode = 401;

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

          customError.httpCode = 401;

          throw customError;
        }

        foundUser.password = request.body.newPassword;

        return foundUser.save();
      })
      .then(function (updatedUser) {
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

    var savePlayer = newPlayer.save(),
        updateGroup = savePlayer.then(function (savedPlayer) {
          return group.findOneAndUpdate(
            { "year": groupDetails.year, "yearOfBirth": groupDetails.yearOfBirth }, 
            { "lastUpdatedDate": new Date() });
        });

    Promise.all([savePlayer, updateGroup])
      .then(function ([savedPlayer, updatedGroup]) {
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
    var groupDetails = request.body.groupDetails,
        playerDetails = request.body.playerDetails;

    var findPlayer = player.findOne({ "_id": mongoose.Types.ObjectId(playerDetails._id), "__v": playerDetails.__v }),
        updatePlayer = findPlayer.then(function (foundPlayer) {
          var lastRegisteredDate = null,
              lastRegisteredYear = null,
              customError = null;

          if (!foundPlayer) {
            customError = new Error("Player not found");

            customError.httpCode = 409;

            throw customError;
          }

          foundPlayer.addressLine1 = Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine1') ? playerDetails.addressLine1 : foundPlayer.addressLine1;
          foundPlayer.addressLine2 = Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine2') ? playerDetails.addressLine2 : foundPlayer.addressLine2;
          foundPlayer.addressLine3 = Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine3') ? playerDetails.addressLine3 : foundPlayer.addressLine3;
          foundPlayer.addressLine4 = Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine4') ? playerDetails.addressLine4 : foundPlayer.addressLine4;
          foundPlayer.medicalConditions = Object.prototype.hasOwnProperty.call(playerDetails, 'medicalConditions') ? playerDetails.medicalConditions : foundPlayer.medicalConditions;
          foundPlayer.contactName = Object.prototype.hasOwnProperty.call(playerDetails, 'contactName') ? playerDetails.contactName : foundPlayer.contactName;
          foundPlayer.contactHomeNumber = Object.prototype.hasOwnProperty.call(playerDetails, 'contactHomeNumber') ? playerDetails.contactHomeNumber : foundPlayer.contactHomeNumber;
          foundPlayer.contactMobileNumber = Object.prototype.hasOwnProperty.call(playerDetails, 'contactMobileNumber') ? playerDetails.contactMobileNumber : foundPlayer.contactMobileNumber;
          foundPlayer.contactEmailAddress = Object.prototype.hasOwnProperty.call(playerDetails, 'contactEmailAddress') ? playerDetails.contactEmailAddress : foundPlayer.contactEmailAddress;
          foundPlayer.school = Object.prototype.hasOwnProperty.call(playerDetails, 'school') ? playerDetails.school : foundPlayer.school;

          if (Object.prototype.hasOwnProperty.call(playerDetails, 'lastRegisteredDate')) {
            lastRegisteredDate = new Date(playerDetails.lastRegisteredDate)
            foundPlayer.lastRegisteredDate = lastRegisteredDate;
            foundPlayer.lastRegisteredYear = lastRegisteredDate.getFullYear();

            lastRegisteredYear = foundPlayer.registeredYears.find(function (item) {
              return item === foundPlayer.lastRegisteredYear;
            });
            if (!lastRegisteredYear) {
              foundPlayer.registeredYears.push(foundPlayer.lastRegisteredYear);
            }
          }

          foundPlayer.modifiedBy = request.payload.userProfile.ID;
          foundPlayer.increment();

          return foundPlayer.save();
        }),
        updateGroup = updatePlayer.then(function (updatedPlayer) {
          return group.findOneAndUpdate(
            { "year": groupDetails.year, "yearOfBirth": groupDetails.yearOfBirth }, 
            { "lastUpdatedDate": new Date() });
        });

    Promise.all([findPlayer, updatePlayer, updateGroup])
      .then(function ([foundPlayer, updatedPlayer, updatedGroup]) {
        var returnMessage = {};

        returnMessage.error = null;
        returnMessage.body = {};

        returnMessage.body.player = updatedPlayer.toObject();

        response.status(200).json(returnMessage);
      })
      .catch(function (error) {
        next(error);
      });
  });

  router.post("/createCoach", authorizer.authorize({ isAdministrator: true }), function (request, response, next) {
    var userDetails = request.body.coachDetails,
        newUser = new user();

    newUser.firstName = userDetails.firstName;
    newUser.surname = userDetails.surname;
    newUser.emailAddress = userDetails.emailAddress;
    newUser.phoneNumber = userDetails.phoneNumber;
    newUser.isAdministrator = userDetails.isAdministrator;
    newUser.password = "";

    newUser.modifiedBy = request.payload.userProfile.ID;

    newUser.save()
      .then(function (savedUser) {
      //   var from_email = new emailHelper.Email('test@example.com');
      //   var to_email = new emailHelper.Email('emmett.j.osullivan@gmail.com');
      //   var subject = 'Hello World from the SendGrid Node.js Library!';
      //   var content = new emailHelper.Content('text/plain', 'Hello, Email!');
      //   var mail = new emailHelper.Mail(from_email, subject, to_email, content);

      //   var request = sendGrid.emptyRequest({
      //     method: 'POST',
      //     path: '/v3/mail/send',
      //     body: mail.toJSON(),
      //   });

      //   return sendGrid.API(request);
      // })
      // .then(function () {
          readCoaches(currentSettings, response, next);
      })
      .catch(function (error) {
        next(error);
      });
  });

  router.post("/updateCoach", authorizer.authorize({ isAdministrator: true }), function (request, response, next) {
    var userDetails = request.body.coachDetails;

    user.findOne({ "_id": mongoose.Types.ObjectId(userDetails._id), "__v": userDetails.__v })
      .then(function (foundUser) {
        var customError = null;

        if (!foundUser) {
          customError = new Error("User not found");

          customError.httpCode = 409;

          throw customError;
        }

        foundUser.firstName = Object.prototype.hasOwnProperty.call(userDetails, 'firstName') ? userDetails.firstName : foundUser.firstName;
        foundUser.surname = Object.prototype.hasOwnProperty.call(userDetails, 'surname') ? userDetails.surname : foundUser.surname;
        foundUser.emailAddress = Object.prototype.hasOwnProperty.call(userDetails, 'emailAddress') ? userDetails.emailAddress : foundUser.emailAddress;
        foundUser.phoneNumber = Object.prototype.hasOwnProperty.call(userDetails, 'phoneNumber') ? userDetails.phoneNumber : foundUser.phoneNumber;
        foundUser.isAdministrator = Object.prototype.hasOwnProperty.call(userDetails, 'isAdministrator') ? userDetails.isAdministrator : foundUser.isAdministrator;
    
        foundUser.modifiedBy = request.payload.userProfile.ID;
        foundUser.increment();

        return foundUser.save();
      })
      .then(function (savedUser) {
        readCoaches(currentSettings, response, next);
      })
      .catch(function (error) {
        next(error);
      });
  });

  router.post("/deleteCoach", authorizer.authorize({ isAdministrator: true }), function (request, response, next) {
    var userDetails = request.body.coachDetails;

    user.findOne({ "_id": mongoose.Types.ObjectId(userDetails._id), "__v": userDetails.__v })
      .then(function (foundUser) {
        var customError = null;

        if (!foundUser) {
          customError = new Error("User not found");

          customError.httpCode = 409;

          throw customError;
        }

        return user.deleteOne({ "_id": mongoose.Types.ObjectId(foundUser._id), "__v": foundUser.__v })
      })
      .then(function () {
        readCoaches(currentSettings, response, next);
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
}

var readCoaches = function (currentSettings, response, next) {
  var readUsers = user.find({}, "-password").lean().exec(),
      readGroups = readUsers.then(function (users) {
        return group.find({ "year": currentSettings.year }).lean().exec();
      });
  
  Promise.all([readUsers, readGroups])
    .then(function([users, groups]) {
      var returnMessage = {};

      returnMessage.error = null;
      returnMessage.body = {};

      users.forEach(function (user) {
        var group = groups.find(function (group) {
          return group.footballManager === user.emailAddress || group.hurlingManager === user.emailAddress;
        });
    
        if (group) {
          user.active = true;
        }
        else {
          user.active = false;
        }
      });

      returnMessage.body.coaches = users;

      response.status(200).json(returnMessage);
    })
    .catch(function (error) {
      next(error);
    });
};
