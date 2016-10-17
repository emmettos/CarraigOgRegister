var express			    = require("express");
var bodyParser		  = require("body-parser");
var methodOverride	= require("method-override");
var bunyan          = require("bunyan");

var app = express();

//var db 	= require("./config/db");

var port = process.env.PORT || 8081;

// mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(bodyParser.json( {type: "application/vnd.api+json"} ));
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(express.static(__dirname + "/public"));

var loggerOptions = {
  name:   "carraigOgRegister",
  level:  "trace",
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

require("./app/logger")(app, bunyan.createLogger(loggerOptions));
require("./app/routes")(app);
require("./app/errorHandlers")(app);

app.listen(port);

exports = module.exports = app;
