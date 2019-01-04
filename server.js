'use strict';

var express = require('express');
var { Pool } = require('pg')
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var bunyan = require('bunyan');

var app = express();

require('dotenv').config();

var config = require('./server/config/config');
var authenticator = require('./server/authenticator');

//var currentSettings = require("./server/models/currentSettings");


var loggerOptions = {
  name: 'carraigOgRegister',
  level: 'trace',
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

if (process.env.NODE_ENV === 'production') {
  app.use(function (request, response, next) {
    if (request.headers['x-forwarded-proto'] !== 'https') {
      return response.redirect(['https://', request.hostname, request.url].join(''));
    }

    return next();
  });
}

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static('dist'));

require('./server/logger')(app, bunyan.createLogger(loggerOptions));

app.use(authenticator.authenticate);

const pool = new Pool()

pool.query('SELECT MAX(y.year) AS year FROM years AS y')
  .then(result => {
    app.currentSettings = result.rows[0];    
    app.pool = pool;
    
    require('./server/routes')(app, express.Router());
    require('./server/errorHandlers')(app);

    app.listen(config.port);
  })
  .catch(error => {
    //TODO: Use bunyan logger here.
    console.log(error.stack)
  });

exports = module.exports = app;
