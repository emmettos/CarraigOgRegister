"use strict";

var JSONWebToken = require("jsonwebtoken");

var config = require("./config/config");
var group = require("./models/group");


exports.authenticate = function (request, response, next) {
  try {
    var authorizationHeader = request.headers.authorization,
        token = null,
        userProfile = {},
        refreshedToken = null;

    if (authorizationHeader) {
      token = authorizationHeader.replace("Bearer ", "");

      JSONWebToken.verify(token, config.secret, function (error, payload) {
        try {
          if (!error) {
            request.logger.trace({ payload: payload });

            request.payload = payload;

            if (!payload.userProfile.createPasswordProfile) {
              refreshedToken = signToken(request.payload.userProfile);

              response.set("Authorization", "Bearer " + refreshedToken);
            }
          }

          next();
        }
        catch (error) {
          next(error);
        }
      });
    }
    else {
      // This is to prevent a browser from using a cached header after Express returns a 304 status code.
      if (request.xhr) {
        userProfile.ID = null;
        userProfile.fullName = null;
        userProfile.isAdministrator = false;
        userProfile.isManager = false;
        userProfile.groups = [];

        refreshedToken = signToken(userProfile, Math.floor(Date.now() / 1000) - 60);

        response.set("Authorization", "Bearer " + refreshedToken);
      }

      next();
    }
  }
  catch (error) {
    next(error);
  }
};

exports.createToken = function (request, currentUser) {
  var promise = new Promise(function (resolve, reject) {
    var userProfile = {};

    userProfile.ID = currentUser.emailAddress;
    userProfile.fullName = currentUser.firstName + ' ' + currentUser.surname;
    userProfile.isAdministrator = currentUser.isAdministrator;
    userProfile.isManager = false;
    userProfile.groups = [];

    if (!currentUser.isAdministrator) {
      group.find({}).lean().exec()
        .then(function (groups) {
          var currentGroup = null,
              groupIndex = 0;

          for (groupIndex = 0; groupIndex < groups.length; groupIndex++) {
            currentGroup = groups[groupIndex];

            if (currentGroup.footballCoach === currentUser.emailAddress || currentGroup.hurlingCoach === currentUser.emailAddress) {
              userProfile.isManager = true;

              userProfile.groups.push(currentGroup.yearOfBirth);
            }
          }

          resolve(signToken(userProfile));
        })
        .catch(function (error) {
          next(error);
        });
    }
    else {
      resolve(signToken(userProfile));
    }
  });

  return promise;
};

var signToken = function (userProfile, expiration) {
  return JSONWebToken.sign({
    exp: expiration || Math.floor(Date.now() / 1000) + (60 * 60),
    userProfile
  }, config.secret);
}

