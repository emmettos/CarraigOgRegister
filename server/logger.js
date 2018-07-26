"use strict";

var uuidv4 = require("uuid/v4");

exports = module.exports = function (app, logger) {
  app.use(function (request, response, next) {
    request.logger = logger.child({ requestID: uuidv4() }, true);

    request.logger.trace({ request: request }, "%s %s", request.method, request.originalUrl || request.url);

    next();
  });
};
