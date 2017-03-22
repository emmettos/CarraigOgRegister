var express	        = require("express");
var mongoose        = require("mongoose")
var bodyParser      = require("body-parser");
var methodOverride	= require("method-override");
var bunyan          = require("bunyan");

var app = express();

var config          = require("./config/config");
var authenticator   = require("./app/authenticator");

var currentSettings = require("./app/models/currentSettings");

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

app.use(bodyParser.json());
app.use(bodyParser.json( {type: "application/vnd.api+json"} ));
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(express.static(__dirname + "/public"));

require("./app/logger")(app, bunyan.createLogger(loggerOptions));

app.use(authenticator.authenticate);

mongoose.connect(config.database)
    .then(function () {
        return currentSettings.findOne({}, "-_id").lean().exec();
    })
    .then(function (settings) {
        app.currentSettings = settings;

        require("./app/routes")(app, express.Router());
        require("./app/errorHandlers")(app);

        app.listen(port);
    })
    .catch(function (error) {
        //TODO: Log this error.
    });

exports = module.exports = app;
