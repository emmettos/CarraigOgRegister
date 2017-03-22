"use strict";

exports = module.exports = function (app) {
    app.use(function (error, request, response, next) {
        request.logger.error(error);

        next(error);
    });

    app.use(function (error, request, response, next) {
        var returnMessage = {};

        returnMessage.error = {};

        if (request.xhr) {
            returnMessage.error.statusCode = error.code || 500;
            returnMessage.error.requestID = request.logger.fields.requestID;
            returnMessage.error.message = error.message;

            response.status(returnMessage.error.statusCode).send(returnMessage);
        } else {
            next(error);
        }
    });
};
