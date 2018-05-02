"use strict";

exports.authorize = function (requiredProfile) {
  return function (request, response, next) {
    var customError = null,
        yearOfBirth = parseInt(request.params.yearOfBirth),
        index = 0,
        groupFound = false,
        userProfile = null;

    try {
      if (!request.payload) {
        customError = new Error("User not authenticated");
        customError.code = 401;

        throw customError;
      }

      userProfile = request.payload.userProfile;

      if (userProfile.isAdministrator) {
        return next();
      }

      if (requiredProfile) {
        if (requiredProfile.isGroupManager) {
          if (userProfile.isManager) {
            index = 0;
            groupFound = false;

            while (!groupFound && index < userProfile.groups.length) {
              if (userProfile.groups[index++] === yearOfBirth) {
                groupFound = true;
              }
            }

            if (groupFound) {
              return next();
            }
          }
        }

        customError = new Error("User not authorized");
        customError.code = 403;

        throw customError;
      }

      next();
    }
    catch (error) {
      next(error);
    }
  }
};
