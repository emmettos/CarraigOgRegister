"use strict";

var uuid = require("node-uuid");

exports = module.exports = function (app, logger) {
  app.use(function (request, response, next) {
    request.logger = logger.child({ requestID: uuid.v4() }, true);

    request.logger.trace({ request: request }, "%s %s", request.method, request.originalUrl || request.url);

    next();
  });
};
