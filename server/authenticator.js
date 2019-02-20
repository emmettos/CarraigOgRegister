'use strict';

var JSONWebToken = require('jsonwebtoken');

var config = require('./config/config');


exports.authenticate = function (request, response, next) {
  try {
    var authorizationHeader = request.headers.authorization,
        token = null,
        userProfile = {},
        refreshedToken = null;

    if (authorizationHeader) {
      token = authorizationHeader.replace('Bearer ', '');

      JSONWebToken.verify(token, config.secret, function (error, payload) {
        try {
          if (!error) {
            request.logger.trace({ payload: payload });

            request.payload = payload;

            if (!payload.userProfile.createPasswordProfile) {
              refreshedToken = signToken(request.payload.userProfile);

              response.set('Authorization', 'Bearer ' + refreshedToken);
            }
          }

          next();
        }
        catch (error) {
          next(error);
        }
      });
    }
    else {
      // This is to prevent a browser from using a cached header after Express returns a 304 status code.
      if (request.xhr) {
        userProfile.ID = null;
        userProfile.fullName = null;
        userProfile.isAdministrator = false;
        userProfile.isManager = false;
        userProfile.groups = [];

        refreshedToken = signToken(userProfile, Math.floor(Date.now() / 1000) - 60);

        response.set('Authorization', 'Bearer ' + refreshedToken);
      }

      next();
    }
  }
  catch (error) {
    next(error);
  }
};

exports.createToken = async (user, currentSettings, pool) => {
  var userProfile = {};

  userProfile.ID = user.email_address;
  userProfile.fullName = user.first_name + ' ' + user.surname;
  userProfile.isAdministrator = user.administrator;
  userProfile.isManager = false;
  userProfile.groups = [];

  if (!userProfile.isAdministrator) {
    const result = await pool.query(`
      SELECT 
        g.id
      FROM
        groups AS g
      WHERE
        (g.football_coach_id = $1 OR g.hurling_coach_id = $1) AND
        g.year_id = 
          (SELECT 
            y1.id 
          FROM 
            public.years AS y1 
          WHERE y1.year = $2)
      ORDER BY
        g.id
    `, [user.id, currentSettings.year]);

    result.rows.forEach(row => {
      userProfile.groups.push(row.id);
    });
  }

  return signToken(userProfile);
};

var signToken = function (userProfile, expiration) {
  return JSONWebToken.sign({
    exp: expiration || Math.floor(Date.now() / 1000) + (60 * 60),
    userProfile
  }, config.secret);
}

