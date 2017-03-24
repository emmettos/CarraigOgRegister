"use strict";

var JSONWebToken = require("jsonwebtoken");

var config = require("../config/config");

var group   = require("./models/group");
var user 	= require("./models/user");

exports.authenticate = function (request, response, next) {
    try {
        var authorizationHeader = request.headers.authorization,
            token = null,
            payload = null,
            refreshedPayload = {},
            refreshedToken = null,
            customError = null;

        if (authorizationHeader) {
            token = authorizationHeader.replace("Bearer ", "");

            JSONWebToken.verify(token, config.secret, function (error, payload) {
                try {
                    if (error) {
                        if (request.payload) {
                            delete request.payload;
                        }
                    }
                    else {
                        request.logger.trace({ payload: payload });

                        request.payload = payload;

                        refreshedPayload.ID = payload.ID;
                        refreshedPayload.isAdministrator = payload.isAdministrator;
                        refreshedPayload.isManager = payload.isManager;
                        refreshedPayload.groups = payload.groups.slice();
                        
                        refreshedToken = JSONWebToken.sign(refreshedPayload, config.secret, { expiresIn: "1h" });

                        response.set("Authorization", "Bearer " + refreshedToken);
                    }

                    next();
                }
                catch (error) {
                    next (error);
                }
            });
        }
        else {
            if (request.payload) {
                delete request.payload;
            }

            // This is to prevent a browser from using a cached header after Express returns a 304 status code.
            refreshedPayload.ID = null;
            refreshedPayload.isAdministrator = false;
            refreshedPayload.isManager = false;
            refreshedPayload.groups = [];

            refreshedToken = JSONWebToken.sign({
                exp: Math.floor(Date.now() / 1000) - 60,
                refreshedPayload
            }, config.secret);

            response.set("Authorization", "Bearer " + refreshedToken);

            next();
        }
    }
    catch (error) {
        next (error);
    }
};

exports.createToken = function (request, currentUser) {
    var promise = new Promise(function (resolve, reject) {
        var currentDate = null,
            payload = {};

        payload.ID = currentUser.emailAddress;
        payload.isAdministrator = currentUser.isAdministrator;
        payload.isManager = false;
        payload.groups = [];

        if (!currentUser.isAdministrator) {
            group.find({}).lean().exec()
                .then(function (groups) {
                    var currentGroup = null,
                        groupIndex = 0;

                    for (groupIndex = 0; groupIndex < groups.length; groupIndex++) {
                        currentGroup = groups[groupIndex];

                        if (currentGroup.footballManager === currentUser.emailAddress || currentGroup.hurlingManager === currentUser.emailAddress) {
                            payload.isManager = true;

                            payload.groups.push(currentGroup.yearOfBirth);
                        }
                    }

                    request.logger.trace(payload);    

                    resolve(JSONWebToken.sign(payload, config.secret, { expiresIn: "1h" }));
                })
                .catch(function (error) {
                    next(error);
                });            
        }
        else {
            request.logger.trace(payload);
            
            resolve(JSONWebToken.sign(payload, config.secret, { expiresIn: "1h" }));
        }
    });

    return promise;
};

