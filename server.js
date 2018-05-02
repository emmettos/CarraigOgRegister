var express = require("express");
var mongoose = require("mongoose")
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var bunyan = require("bunyan");

var app = express();

var config = require("./server/config/config");
var authenticator = require("./server/authenticator");

var currentSettings = require("./server/models/currentSettings");

var port = process.env.PORT || 8081;

var loggerOptions = {
  name: "carraigOgRegister",
  level: "trace",
  serializers: {
    request: function (request) {
      return {
        method: request.method,
        url: request.originalUrl || request.url,
        headers: request.headers
      }
    }
  }
};

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV === "production") {
  app.use(function (request, response, next) {
    if (request.headers["x-forwarded-proto"] !== "https") {
      return response.redirect(["https://", request.hostname, request.url].join(""));
    }

    return next();
  });
}

app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(express.static("dist"));

require("./server/logger")(app, bunyan.createLogger(loggerOptions));

app.use(function (request, response, next) {
  if (mongoose.connection.readyState !== 1) {
    mongoose.connect(config.database)
      .then(function () {
        next();
      })
      .catch(function (error) {
        next(error);
      });
  }
  else {
    next();
  }
});

app.use(authenticator.authenticate);

mongoose.connect(config.database)
  .then(function () {
    return currentSettings.findOne({}, "-_id").lean().exec();
  })
  .then(function (settings) {
    app.currentSettings = settings;

    require("./server/routes")(app, express.Router());
    require("./server/errorHandlers")(app);

    app.listen(port);
  })
  .catch(function (error) {
    //TODO: Log this error.
  });

exports = module.exports = app;
