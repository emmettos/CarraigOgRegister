'use strict';

var express = require('express');
var pg = require('pg')
var { Pool } = require('pg')
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var bunyan = require('bunyan');

var app = express();

require('dotenv').config();

var config = require('./server/config/config');
var authenticator = require('./server/authenticator');


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

const sql = `
  SELECT
    y.id AS year_id,
    y.year
  FROM
    public.years AS y
  WHERE
    y.year =
      (SELECT
        MAX(y1.year)
      FROM
        public.years AS y1)
`;

pool.query(sql)
  .then(result => {
    // Turn off node-postgres date and timestamp parsing. Just treat all as strings.
    pg.types.setTypeParser(1082, stringValue => stringValue);
    pg.types.setTypeParser(1114, stringValue => stringValue);

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
