"use strict";

exports.authorize = function (requiredPayload) {
    return function(request, response, next) {
        var customError = null,
            yearOfBirth = parseInt(request.params.yearOfBirth),
            index = 0,
            groupFound = false;

        try {
            if (!request.payload) {
                customError = new Error("User not authenticated");
                customError.code = 401;
            
                throw customError;                
            }

            if (request.payload.isAdministrator) {
                return next();
            }

            if (requiredPayload) {
                if (requiredPayload.isGroupManager) {
                    if (request.payload.isManager) {
                        index = 0;
                        groupFound = false;

                        while (!groupFound && index < request.payload.groups.length) {
                            if (request.payload.groups[index++] === yearOfBirth) {
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
            next (error);
        }
    } 
};
