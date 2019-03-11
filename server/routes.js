'use strict';

var fs = require('fs');

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var moment = require('moment');
var JSONWebToken = require('jsonwebtoken');
var nodemailer = require('nodemailer');

var config = require('./config/config');

var authenticator = require('./authenticator');
var authorizer = require('./authorizer');

var group = require('./models/group');
var user = require('./models/user');


exports = module.exports = function (app, router) {
  var currentSettings = app.currentSettings;

  router.get('/currentSettings', async (request, response, next) => {
    try {
      var returnMessage = {};

      returnMessage.error = null;
      returnMessage.body = {};

      returnMessage.body.currentSettings = currentSettings;

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/verifyUserToken', async (request, response, next) => {
    var verifyToken = function (userToken) {
      var promise = new Promise(function (resolve, reject) {
        JSONWebToken.verify(userToken, config.secret, function (error, payload) {
          try {
            if (error) {
              error.message = 'Invalid userToken: ' + error.message;
    
              error.httpCode = 400;
        
              reject(error);
            }

            resolve(payload);
          }
          catch (error) {
            reject(error);
          }
        });
      });
    
      return promise;
    };

    try {
      const payload = await verifyToken(request.body.userToken);
      const foundUser = await user.findOne({ emailAddress: payload.emailAddress });

      var customError = null;

      if (!foundUser) {
        customError = new Error('User not found - ' + payload.emailAddress);

        customError.httpCode = 401;

        throw customError;
      }

      if (!payload.currentPassword) {
        if (foundUser.password !== '') {
          customError = new Error('Password has already been set for ' + payload.emailAddress);
  
          customError.httpCode = 401;
  
          throw customError;  
        }
      }
      else {
        if (!foundUser.comparePassword(payload.currentPassword)) {
          customError = new Error('Token password for ' + payload.emailAddress + ' does not match existing password');
  
          customError.httpCode = 401;
  
          throw customError;  
        }  
      }

      var returnMessage = {};

      returnMessage.error = null;
      returnMessage.body = {};

      returnMessage.body.emailAddress = payload.emailAddress;

      var userProfile = {};

      userProfile.ID = payload.emailAddress;
      userProfile.createPasswordProfile = true;

      response.set('Authorization', 'Bearer ' + JSONWebToken.sign({
        userProfile: userProfile 
      }, config.secret));

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/createPassword', authorizer.authorize({ isCreatingPassword: true }), async (request, response, next) => {
    var customError = null;

    try {
      if (!(request.body.emailAddress && request.body.password)) {
        customError = new Error('Email address and password are required');

        customError.httpCode = 400;

        throw customError;
      }

      const foundUser = await user.findOne({ emailAddress: request.body.emailAddress })

      if (!foundUser) {
        customError = new Error('User not found');

        customError.httpCode = 400;

        throw customError;
      }

      foundUser.password = request.body.password;

      await foundUser.save();

      var returnMessage = {};

      returnMessage.error = null;
      returnMessage.body = {};

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/authenticate', async (request, response, next) => {
    var foundUser = null,
        passwordMatch = false,
        jwtToken = null,
        customError = null,
        returnMessage = {};

    try {
      const result = await app.pool.query(`
        SELECT 
          id,
          first_name,
          surname,
          email_address,
          administrator,
          password
        FROM
          public.coaches AS c
        WHERE
          c.email_address = $1
      `, [request.body.emailAddress]);
  
      if (result.rows.length === 0) {
        customError = new Error('User not found');

        customError.httpCode = 401;

        throw customError;
      }
       
      foundUser = result.rows[0];

      if (foundUser.password === '') {
        customError = new Error('User not validated');

        customError.httpCode = 401;

        throw customError;
      }

      passwordMatch = await bcrypt.compare(request.body.password, foundUser.password);

      if (!passwordMatch) {
        customError = new Error('Invalid password');

        customError.httpCode = 401;

        throw customError;
      }

      jwtToken = await authenticator.createToken(foundUser, currentSettings, app.pool)

      returnMessage.error = null;
      returnMessage.body = {};

      response.set('Authorization', 'Bearer ' + jwtToken);

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/changePassword', async (request, response, next) => {
    var foundUser = null,
        comparedUser = null,
        customError = null,
        returnMessage = {};

    try {
      foundUser = await user.findOne({ emailAddress: request.body.emailAddress });

      if (!foundUser) {
        customError = new Error('User not found');

        customError.httpCode = 401;

        throw customError;
      }

      comparedUser = await foundUser.comparePassword(request.body.password);

      if (!comparedUser) {
        customError = new Error('Invalid password');

        customError.httpCode = 401;

        throw customError;
      }

      comparedUser.password = request.body.newPassword;

      await comparedUser.save();

      returnMessage.error = null;
      returnMessage.body = {};

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/groupSummaries', authorizer.authorize(), async (request, response, next) => {
    try {
      await readGroupSummaries(app, currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/groups', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      const result = await app.pool.query(`
        SELECT 
          id,
          year_id,
          year_of_birth,
          name,
          football_coach_id,
          hurling_coach_id,
          created_by,
          created_date,
          updated_by,
          updated_date,
          version
        FROM
          public.groups AS g
        WHERE
          g.year_id = 
            (SELECT 
              y.id 
            FROM 
              public.years AS y 
            WHERE y.year = $1)
        ORDER BY
          g.year_of_birth DESC      
      `, [currentSettings.year]);
    
      var returnMessage = {};
    
      returnMessage.error = null;
      returnMessage.body = {};
    
      returnMessage.body.groups = result.rows.map(row => {
        Object.defineProperty(row, 'yearId', Object.getOwnPropertyDescriptor(row, 'year_id'));
        delete row['year_id'];
    
        Object.defineProperty(row, 'yearOfBirth', Object.getOwnPropertyDescriptor(row, 'year_of_birth'));
        delete row['year_of_birth'];
    
        Object.defineProperty(row, 'footballCoachId', Object.getOwnPropertyDescriptor(row, 'football_coach_id'));
        delete row['football_coach_id'];
    
        Object.defineProperty(row, 'hurlingCoachId', Object.getOwnPropertyDescriptor(row, 'hurling_coach_id'));
        delete row['hurling_coach_id'];
    
        Object.defineProperty(row, 'createdBy', Object.getOwnPropertyDescriptor(row, 'created_by'));
        delete row['created_by'];
    
        Object.defineProperty(row, 'createdDate', Object.getOwnPropertyDescriptor(row, 'created_date'));
        delete row['created_date'];
    
        Object.defineProperty(row, 'updatedBy', Object.getOwnPropertyDescriptor(row, 'updated_by'));
        delete row['updated_by'];
    
        Object.defineProperty(row, 'updatedDate', Object.getOwnPropertyDescriptor(row, 'updated_date'));
        delete row['updated_date'];
    
        return row;
      });

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/groupDetails/:groupId', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      const result = await app.pool.query(`
        SELECT 
          id,
          year_id,
          year_of_birth,
          name,
          football_coach_id,
          hurling_coach_id,
          created_by,
          created_date,
          updated_by,
          updated_date,
          version
        FROM
          public.groups AS g
        WHERE
          g.id = $1      
      `, [request.params.groupId]);
    
      var returnMessage = {};
    
      returnMessage.error = null;
      returnMessage.body = {};
    
      returnMessage.body.groupDetails = result.rows.map(row => {
        Object.defineProperty(row, 'yearId', Object.getOwnPropertyDescriptor(row, 'year_id'));
        delete row['year_id'];
    
        Object.defineProperty(row, 'yearOfBirth', Object.getOwnPropertyDescriptor(row, 'year_of_birth'));
        delete row['year_of_birth'];
    
        Object.defineProperty(row, 'footballCoachId', Object.getOwnPropertyDescriptor(row, 'football_coach_id'));
        delete row['football_coach_id'];
    
        Object.defineProperty(row, 'hurlingCoachId', Object.getOwnPropertyDescriptor(row, 'hurling_coach_id'));
        delete row['hurling_coach_id'];
    
        Object.defineProperty(row, 'createdBy', Object.getOwnPropertyDescriptor(row, 'created_by'));
        delete row['created_by'];
    
        Object.defineProperty(row, 'createdDate', Object.getOwnPropertyDescriptor(row, 'created_date'));
        delete row['created_date'];
    
        Object.defineProperty(row, 'updatedBy', Object.getOwnPropertyDescriptor(row, 'updated_by'));
        delete row['updated_by'];
    
        Object.defineProperty(row, 'updatedDate', Object.getOwnPropertyDescriptor(row, 'updated_date'));
        delete row['updated_date'];
    
        return row;
      })[0];

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/createGroup', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var groupDetails = request.body.groupDetails,
          sqlStatement = [],
          fieldIndex = 0,
          fieldNames = [],
          fieldValues = [],
          fieldPositionParams = [];

      if (!groupDetails) {
        throw new Error ('groupDetails not found in request');
      }

      sqlStatement.push('INSERT INTO public.groups (');

      fieldNames.push('year_id');
      fieldValues.push(currentSettings.year_id);

      if (Object.prototype.hasOwnProperty.call(groupDetails, 'yearOfBirth')) {
        fieldNames.push('year_of_birth');
        fieldValues.push(groupDetails.yearOfBirth);
      }
      if (Object.prototype.hasOwnProperty.call(groupDetails, 'name')) {
        fieldNames.push('name');
        fieldValues.push(groupDetails.name);
      }
      if (Object.prototype.hasOwnProperty.call(groupDetails, 'footballCoachId')) {
        fieldNames.push('football_coach_id');
        fieldValues.push(groupDetails.footballCoachId);
      }
      if (Object.prototype.hasOwnProperty.call(groupDetails, 'footballCoachId')) {
        fieldNames.push('hurling_coach_id');
        fieldValues.push(groupDetails.hurlingCoachId);
      }

      fieldNames.push('created_by');
      fieldValues.push(request.payload.userProfile.ID);
      fieldNames.push('created_date');
      fieldValues.push(moment.utc().toISOString());

      sqlStatement.push(fieldNames.join(',\n'));

      sqlStatement.push(`)
        VALUES (`);

      for (fieldIndex = 1; fieldIndex <= fieldNames.length; fieldIndex++) { 
        fieldPositionParams.push('$' + fieldIndex)  
      }

      sqlStatement.push(fieldPositionParams.join(',\n'));

      sqlStatement.push(')');

      await app.pool.query(sqlStatement.join('\n'), fieldValues);

      await readGroupSummaries(app, currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/updateGroup', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var groupDetails = request.body.groupDetails,
          sqlStatement = [],
          setIndex = 0,
          setStatements = [],
          setValues = [],
          result = null;

      if (!groupDetails) {
        throw new Error ('groupDetails not found in request');
      }

      sqlStatement.push(`
        UPDATE 
          public.groups
        SET`);

      if (Object.prototype.hasOwnProperty.call(groupDetails, 'yearOfBirth')) {
        setStatements.push('year_of_birth = ($' + (++setIndex) + ')');
        setValues.push(groupDetails.yearOfBirth);
      }
      if (Object.prototype.hasOwnProperty.call(groupDetails, 'name')) {
        setStatements.push('name = ($' + (++setIndex) + ')');
        setValues.push(groupDetails.name);
      }
      if (Object.prototype.hasOwnProperty.call(groupDetails, 'footballCoachId')) {
        setStatements.push('football_coach_id = ($' + (++setIndex) + ')');
        setValues.push(groupDetails.footballCoachId);
      }
      if (Object.prototype.hasOwnProperty.call(groupDetails, 'hurlingCoachId')) {
        setStatements.push('hurling_coach_id = ($' + (++setIndex) + ')');
        setValues.push(groupDetails.hurlingCoachId);
      }

      setStatements.push('updated_by = ($' + (++setIndex) + ')');
      setValues.push(request.payload.userProfile.ID);
      setStatements.push('updated_date = ($' + (++setIndex) + ')');
      setValues.push(moment.utc().toISOString());

      sqlStatement.push(setStatements.join(',\n'));

      sqlStatement.push(`
        WHERE 
          id = ` + groupDetails.id + ` AND
          version = '` + groupDetails.version + `'`);

      result = await app.pool.query(sqlStatement.join('\n'), setValues);
      
      if (result.rowCount === 0) {
        throw new Error('No group rows updated. Possible concurrency issue.')
      }

      await readGroupSummaries(app, currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/deleteGroup', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var result = null;

      if (!request.body.groupSummary) {
        throw new Error ('groupSummary not found in request');
      }

      result = await app.pool.query(`
        DELETE FROM 
          public.groups
        WHERE 
          id = $1 AND
          version = $2
      `, [request.body.groupSummary.id, request.body.groupSummary.version]);
        
      if (result.rowCount === 0) {
        throw new Error('No group deleted. Possible concurrency issue.')
      }

      await readGroupSummaries(app, currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/playerSummaries/:groupId', authorizer.authorize({ isGroupManager: true }), async (request, response, next) => {
    try {
      const result = await app.pool.query(`
        SELECT DISTINCT
          p.id,
          p.first_name,
          p.surname,
          p.address_line_1,
          p.address_line_2,
          p.address_line_3,
          p.date_of_birth,
          p.medical_conditions,
          p.contact_name,
          p.contact_mobile_number,
          p.contact_home_number,
          p.contact_email_address,
          p.school,
          p.version,
          gp.registered_date AS last_registered_date,
          CASE
            WHEN EXISTS
              (SELECT
                gp1.player_id
              FROM
                public.groups_players AS gp1
              WHERE
                gp1.player_id = p.id AND
                gp1.group_id = g.previous_group_id)
            THEN 0
            ELSE 1
          END AS player_state  
        FROM
          public.players AS p
        INNER JOIN public.groups_players AS gp
          ON p.id = gp.player_id
        INNER JOIN public.groups AS g
          ON gp.group_id = g.id
        WHERE
          g.id = $1
        UNION
        SELECT
          p.id,
          p.first_name,
          p.surname,
          p.address_line_1,
          p.address_line_2,
          p.address_line_3,
          p.date_of_birth,
          p.medical_conditions,
          p.contact_name,
          p.contact_mobile_number,
          p.contact_home_number,
          p.contact_email_address,
          p.school,
          p.version,
          gp.registered_date AS last_registered_date,
          2 AS player_state
        FROM
          public.players AS p
        INNER JOIN public.groups_players AS gp
          ON p.id = gp.player_id
        WHERE
          gp.group_id =
            (SELECT
              g1.previous_group_id
            FROM
              public.groups AS g1
            WHERE
              g1.id = $1) AND
          p.id NOT IN
            (SELECT
              gp1.player_id
            FROM
              public.groups_players AS gp1
            WHERE
              gp1.group_id = $1)
        ORDER BY
          id
        `, [request.params.groupId]);
  
      var returnMessage = {};

      returnMessage.error = null;
      returnMessage.body = {};

      returnMessage.body.players = result.rows.map(row => mapPlayerSummary(row));

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/searchPlayers/:dateOfBirth', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      await searchPlayers(app.pool, request.params.dateOfBirth, currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/playerDetails/:playerId', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      const playerResult = await app.pool.query(`
        SELECT
          p.id,
          p.first_name,
          p.surname,
          p.address_line_1,
          p.address_line_2,
          p.address_line_3,
          p.date_of_birth,
          p.medical_conditions,
          p.contact_name,
          p.contact_mobile_number,
          p.contact_home_number,
          p.contact_email_address,
          p.school,
          p.created_by,
          p.created_date,
          p.updated_by,
          p.updated_date,
          p.version
        FROM
          public.players AS p
        WHERE
          p.id = $1
      `, [request.params.playerId]);
  
      const groupPlayerResult = await app.pool.query(`
        SELECT
          gp.id,
          gp.group_id,
          gp.player_id,
          gp.registered_date,
          gp.created_by,
          gp.created_date,
          gp.updated_by,
          gp.updated_date,
          gp.version
        FROM
          public.groups_players AS gp
        WHERE
          gp.player_id = $1 AND
          gp.group_id IN
            (SELECT
              g1.id
            FROM
              public.groups g1
            WHERE
              g1.year_id = 
                (SELECT 
                  y.id 
                FROM 
                  public.years AS y 
                WHERE y.year = $2))
      `, [request.params.playerId, currentSettings.year]);
  
      var returnMessage = {};

      returnMessage.error = null;
      returnMessage.body = {};

      returnMessage.body.playerDetails = playerResult.rows.map(row => {
        Object.defineProperty(row, 'firstName', Object.getOwnPropertyDescriptor(row, 'first_name'));
        delete row['first_name'];
      
        Object.defineProperty(row, 'addressLine1', Object.getOwnPropertyDescriptor(row, 'address_line_1'));
        delete row['address_line_1'];
      
        Object.defineProperty(row, 'addressLine2', Object.getOwnPropertyDescriptor(row, 'address_line_2'));
        delete row['address_line_2'];
      
        Object.defineProperty(row, 'addressLine3', Object.getOwnPropertyDescriptor(row, 'address_line_3'));
        delete row['address_line_3'];
      
        Object.defineProperty(row, 'dateOfBirth', Object.getOwnPropertyDescriptor(row, 'date_of_birth'));
        delete row['date_of_birth'];
      
        Object.defineProperty(row, 'medicalConditions', Object.getOwnPropertyDescriptor(row, 'medical_conditions'));
        delete row['medical_conditions'];
      
        Object.defineProperty(row, 'contactName', Object.getOwnPropertyDescriptor(row, 'contact_name'));
        delete row['contact_name'];
      
        Object.defineProperty(row, 'contactMobileNumber', Object.getOwnPropertyDescriptor(row, 'contact_mobile_number'));
        delete row['contact_mobile_number'];
      
        Object.defineProperty(row, 'contactHomeNumber', Object.getOwnPropertyDescriptor(row, 'contact_home_number'));
        delete row['contact_home_number'];
      
        Object.defineProperty(row, 'contactEmailAddress', Object.getOwnPropertyDescriptor(row, 'contact_email_address'));
        delete row['contact_email_address'];
      
        Object.defineProperty(row, 'createdBy', Object.getOwnPropertyDescriptor(row, 'created_by'));
        delete row['created_by'];
    
        Object.defineProperty(row, 'createdDate', Object.getOwnPropertyDescriptor(row, 'created_date'));
        delete row['created_date'];
    
        Object.defineProperty(row, 'updatedBy', Object.getOwnPropertyDescriptor(row, 'updated_by'));
        delete row['updated_by'];
    
        Object.defineProperty(row, 'updatedDate', Object.getOwnPropertyDescriptor(row, 'updated_date'));
        delete row['updated_date'];

        return row;
      })[0];

      if (groupPlayerResult.rows.length > 0) {
        returnMessage.body.groupPlayerDetails = groupPlayerResult.rows.map(row => {
          Object.defineProperty(row, 'groupId', Object.getOwnPropertyDescriptor(row, 'group_id'));
          delete row['group_id'];
                  
          Object.defineProperty(row, 'playerId', Object.getOwnPropertyDescriptor(row, 'player_id'));
          delete row['player_id'];
                  
          Object.defineProperty(row, 'registeredDate', Object.getOwnPropertyDescriptor(row, 'registered_date'));
          delete row['registered_date'];
        
          Object.defineProperty(row, 'createdBy', Object.getOwnPropertyDescriptor(row, 'created_by'));
          delete row['created_by'];
      
          Object.defineProperty(row, 'createdDate', Object.getOwnPropertyDescriptor(row, 'created_date'));
          delete row['created_date'];
      
          Object.defineProperty(row, 'updatedBy', Object.getOwnPropertyDescriptor(row, 'updated_by'));
          delete row['updated_by'];
      
          Object.defineProperty(row, 'updatedDate', Object.getOwnPropertyDescriptor(row, 'updated_date'));
          delete row['updated_date'];
                  
          return row;
        })[0];
      }
      else {
        returnMessage.body.groupPlayerDetails = null;
      }

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/createPlayer', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var playerDetails = request.body.playerDetails,
          groupPlayerDetails = request.body.groupPlayerDetails,
          sqlStatement = [],
          fieldIndex = 0,
          fieldNames = [],
          fieldValues = [],
          fieldPositionParams = [],
          result = null;

      if (!(playerDetails && groupPlayerDetails)) {
        throw new Error ('playerDetails and groupPlayerDetails not found in request');
      }

      const client = await app.pool.connect();

      try {
        await client.query('BEGIN')

        sqlStatement.push('INSERT INTO public.players (');

        if (Object.prototype.hasOwnProperty.call(playerDetails, 'firstName')) {
          fieldNames.push('first_name');
          fieldValues.push(playerDetails.firstName);
        }
        if (Object.prototype.hasOwnProperty.call(playerDetails, 'surname')) {
          fieldNames.push('surname');
          fieldValues.push(playerDetails.surname);
        }
        if (Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine1')) {
          fieldNames.push('address_line_1');
          fieldValues.push(playerDetails.addressLine1);
        }
        if (Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine2')) {
          fieldNames.push('address_line_2');
          fieldValues.push(playerDetails.addressLine2);
        }
        if (Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine3')) {
          fieldNames.push('address_line_3');
          fieldValues.push(playerDetails.addressLine3);
        }
        if (Object.prototype.hasOwnProperty.call(playerDetails, 'dateOfBirth')) {
          fieldNames.push('date_of_birth');
          fieldValues.push(playerDetails.dateOfBirth);
        }
        if (Object.prototype.hasOwnProperty.call(playerDetails, 'medicalConditions')) {
          fieldNames.push('medical_conditions');
          fieldValues.push(playerDetails.medicalConditions);
        }
        if (Object.prototype.hasOwnProperty.call(playerDetails, 'contactName')) {
          fieldNames.push('contact_name');
          fieldValues.push(playerDetails.contactName);
        }
        if (Object.prototype.hasOwnProperty.call(playerDetails, 'contactMobileNumber')) {
          fieldNames.push('contact_mobile_number');
          fieldValues.push(playerDetails.contactMobileNumber);
        }
        if (Object.prototype.hasOwnProperty.call(playerDetails, 'contactHomeNumber')) {
          fieldNames.push('contact_home_number');
          fieldValues.push(playerDetails.contactHomeNumber);
        }
        if (Object.prototype.hasOwnProperty.call(playerDetails, 'contactEmailAddress')) {
          fieldNames.push('contact_email_address');
          fieldValues.push(playerDetails.contactEmailAddress);
        }
        if (Object.prototype.hasOwnProperty.call(playerDetails, 'school')) {
          fieldNames.push('school');
          fieldValues.push(playerDetails.school);
        }

        fieldNames.push('created_by');
        fieldValues.push(request.payload.userProfile.ID);
        fieldNames.push('created_date');
        fieldValues.push(moment.utc().toISOString());

        sqlStatement.push(fieldNames.join(',\n'));

        sqlStatement.push(`)
          VALUES (`);

        for (fieldIndex = 1; fieldIndex <= fieldNames.length; fieldIndex++) { 
          fieldPositionParams.push('$' + fieldIndex)  
        }

        sqlStatement.push(fieldPositionParams.join(',\n'));

        sqlStatement.push(') RETURNING id');

        result = await client.query(sqlStatement.join('\n'), fieldValues);

        sqlStatement = [];
        fieldIndex = 0;
        fieldNames = [];
        fieldValues = [];
        fieldPositionParams = [];

        sqlStatement.push('INSERT INTO public.groups_players (');

        if (Object.prototype.hasOwnProperty.call(groupPlayerDetails, 'groupId')) {
          fieldNames.push('group_id');
          fieldValues.push(groupPlayerDetails.groupId);
        }

        fieldNames.push('player_id');
        fieldValues.push(result.rows[0].id);

        if (Object.prototype.hasOwnProperty.call(groupPlayerDetails, 'registeredDate')) {
          fieldNames.push('registered_date');
          fieldValues.push(groupPlayerDetails.registeredDate);
        }

        fieldNames.push('created_by');
        fieldValues.push(request.payload.userProfile.ID);
        fieldNames.push('created_date');
        fieldValues.push(moment.utc().toISOString());

        sqlStatement.push(fieldNames.join(',\n'));

        sqlStatement.push(`)
          VALUES (`);

        for (fieldIndex = 1; fieldIndex <= fieldNames.length; fieldIndex++) { 
          fieldPositionParams.push('$' + fieldIndex)  
        }

        sqlStatement.push(fieldPositionParams.join(',\n'));

        sqlStatement.push(')');

        result = await client.query(sqlStatement.join('\n'), fieldValues);
        
        await client.query('COMMIT')
      } 
      catch (error) {
        await client.query('ROLLBACK')
        throw error;
      } 

      await searchPlayers(client, playerDetails.dateOfBirth, currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
    finally {
      client.release()
    }
  });

  router.post('/updatePlayer', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var playerDetails = request.body.playerDetails,
          groupPlayerDetails = request.body.groupPlayerDetails,
          sqlStatement = [],
          setIndex = 0,
          setStatements = [],
          setValues = [],
          result = null;

      if (!(playerDetails || groupPlayerDetails)) {
        throw new Error ('playerDetails or groupPlayerDetails not found in request');
      }

      const client = await app.pool.connect();

      try {
        await client.query('BEGIN')

        if (playerDetails) {
          sqlStatement.push(`
            UPDATE 
              public.players
            SET`);

          if (Object.prototype.hasOwnProperty.call(playerDetails, 'firstName')) {
            setStatements.push('first_name = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.firstName);
          }
          if (Object.prototype.hasOwnProperty.call(playerDetails, 'surname')) {
            setStatements.push('surname = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.surname);
          }
          if (Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine1')) {
            setStatements.push('address_line_1 = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.addressLine1);
          }
          if (Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine2')) {
            setStatements.push('address_line_2 = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.addressLine2);
          }
          if (Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine3')) {
            setStatements.push('address_line_3 = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.addressLine3);
          }
          if (Object.prototype.hasOwnProperty.call(playerDetails, 'dateOfBirth')) {
            setStatements.push('date_of_birth = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.dateOfBirth);
          }
          if (Object.prototype.hasOwnProperty.call(playerDetails, 'medicalConditions')) {
            setStatements.push('medical_conditions = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.medicalConditions);
          }
          if (Object.prototype.hasOwnProperty.call(playerDetails, 'contactName')) {
            setStatements.push('contact_name = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.contactName);
          }
          if (Object.prototype.hasOwnProperty.call(playerDetails, 'contactMobileNumber')) {
            setStatements.push('contact_mobile_number = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.contactMobileNumber);
          }
          if (Object.prototype.hasOwnProperty.call(playerDetails, 'contactHomeNumber')) {
            setStatements.push('contact_home_number = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.contactHomeNumber);
          }
          if (Object.prototype.hasOwnProperty.call(playerDetails, 'contactEmailAddress')) {
            setStatements.push('contact_email_address = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.contactEmailAddress);
          }
          if (Object.prototype.hasOwnProperty.call(playerDetails, 'school')) {
            setStatements.push('school = ($' + (++setIndex) + ')');
            setValues.push(playerDetails.school);
          }

          setStatements.push('updated_by = ($' + (++setIndex) + ')');
          setValues.push(request.payload.userProfile.ID);
          setStatements.push('updated_date = ($' + (++setIndex) + ')');
          setValues.push(moment.utc().toISOString());

          sqlStatement.push(setStatements.join(',\n'));

          sqlStatement.push(`
            WHERE 
              id = ` + playerDetails.id + ` AND
              version = '` + playerDetails.version + `'`);

          result = await client.query(sqlStatement.join('\n'), setValues);
          
          if (result.rowCount === 0) {
            throw new Error('No player rows updated. Possible concurrency issue.')
          }
        }

        if (groupPlayerDetails) {
          if (!groupPlayerDetails.id) {
            let fieldIndex = 0,
                fieldNames = [],
                fieldValues = [],
                fieldPositionParams = [];

            sqlStatement = [];

            sqlStatement.push('INSERT INTO public.groups_players (');

            if (Object.prototype.hasOwnProperty.call(groupPlayerDetails, 'groupId')) {
              fieldNames.push('group_id');
              fieldValues.push(groupPlayerDetails.groupId);
            }

            fieldNames.push('player_id');
            fieldValues.push(playerDetails.id);

            if (Object.prototype.hasOwnProperty.call(groupPlayerDetails, 'registeredDate')) {
              fieldNames.push('registered_date');
              fieldValues.push(groupPlayerDetails.registeredDate);
            }

            fieldNames.push('created_by');
            fieldValues.push(request.payload.userProfile.ID);
            fieldNames.push('created_date');
            fieldValues.push(moment.utc().toISOString());

            sqlStatement.push(fieldNames.join(',\n'));

            sqlStatement.push(`)
              VALUES (`);

            for (fieldIndex = 1; fieldIndex <= fieldNames.length; fieldIndex++) { 
              fieldPositionParams.push('$' + fieldIndex)  
            }

            sqlStatement.push(fieldPositionParams.join(',\n'));

            sqlStatement.push(')');

            result = await client.query(sqlStatement.join('\n'), fieldValues);
          }
          else {
            sqlStatement = [];
            setIndex = 0;
            setStatements = [];
            setValues = [];
  
            if (groupPlayerDetails.groupId !== -1) {
              sqlStatement.push(`
                UPDATE 
                  public.groups_players
                SET`);

              if (Object.prototype.hasOwnProperty.call(groupPlayerDetails, 'groupId')) {
                setStatements.push('group_id = ($' + (++setIndex) + ')');
                setValues.push(groupPlayerDetails.groupId);
              }
              if (Object.prototype.hasOwnProperty.call(groupPlayerDetails, 'registeredDate')) {
                setStatements.push('registered_date = ($' + (++setIndex) + ')');
                setValues.push(groupPlayerDetails.registeredDate);
              }

              setStatements.push('updated_by = ($' + (++setIndex) + ')');
              setValues.push(request.payload.userProfile.ID);
              setStatements.push('updated_date = ($' + (++setIndex) + ')');
              setValues.push(moment.utc().toISOString());
    
              sqlStatement.push(setStatements.join(',\n'));

              sqlStatement.push(`
                WHERE 
                  id = ` + groupPlayerDetails.id + ` AND
                  version = '` + groupPlayerDetails.version + `'`);
            }
            else {
              sqlStatement.push(`
                DELETE FROM 
                  public.groups_players
                WHERE 
                  id = ` + groupPlayerDetails.id + ` AND
                  version = '` + groupPlayerDetails.version + `'`);
            }

            result = await client.query(sqlStatement.join('\n'), setValues);
            
            if (result.rowCount === 0) {
              throw new Error('No groups_players rows updated. Possible concurrency issue.')
            }
          }
        }

        await client.query('COMMIT')
      } 
      catch (error) {
        await client.query('ROLLBACK')
        throw error;
      } 

      await searchPlayers(client, playerDetails.dateOfBirth, currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
    finally {
      client.release()
    }
  });

  router.post('/deletePlayer', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var result = null;

      if (!request.body.playerSummary) {
        throw new Error ('playerSummary not found in request');
      }

      const client = await app.pool.connect();

      try {
        await client.query('BEGIN')

        result = await client.query(`
          DELETE FROM 
            public.groups_players
          WHERE 
            player_id = $1
        `, [request.body.playerSummary.id]);
          
        result = await client.query(`
          DELETE FROM 
            public.players
          WHERE 
            id = $1 AND
            version = $2
        `, [request.body.playerSummary.id, request.body.playerSummary.version]);
          
        if (result.rowCount === 0) {
          throw new Error('No player deleted. Possible concurrency issue.')
        }

        await client.query('COMMIT');
      } 
      catch (error) {
        await client.query('ROLLBACK')
        throw error;
      } 

      await searchPlayers(client, request.body.playerSummary.dateOfBirth, currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
    finally {
      client.release()
    }
  });

  router.get('/coachSummaries', authorizer.authorize(), async (request, response, next) => {
    try {
      await readCoachSummaries(app, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/coaches', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      const result = await app.pool.query(`
        SELECT 
          id,
          first_name,
          surname,
          email_address,
          phone_number,
          administrator,
          created_by,
          created_date,
          updated_by,
          updated_date,
          version
        FROM
          public.coaches AS c
        ORDER BY
          c.surname,
          c.first_name
      `);
    
      var returnMessage = {};
  
      returnMessage.error = null;
      returnMessage.body = {};
    
      returnMessage.body.coaches = result.rows.map(row => {
        Object.defineProperty(row, 'firstName', Object.getOwnPropertyDescriptor(row, 'first_name'));
        delete row['first_name'];
    
        Object.defineProperty(row, 'emailAddress', Object.getOwnPropertyDescriptor(row, 'email_address'));
        delete row['email_address'];
    
        Object.defineProperty(row, 'phoneNumber', Object.getOwnPropertyDescriptor(row, 'phone_number'));
        delete row['phone_number'];
    
        Object.defineProperty(row, 'createdBy', Object.getOwnPropertyDescriptor(row, 'created_by'));
        delete row['created_by'];
    
        Object.defineProperty(row, 'createdDate', Object.getOwnPropertyDescriptor(row, 'created_date'));
        delete row['created_date'];
    
        Object.defineProperty(row, 'updatedBy', Object.getOwnPropertyDescriptor(row, 'updated_by'));
        delete row['updated_by'];
    
        Object.defineProperty(row, 'updatedDate', Object.getOwnPropertyDescriptor(row, 'updated_date'));
        delete row['updated_date'];
    
        return row;
      });
  
      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/coachDetails/:coachId', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var result = await app.pool.query(`
        SELECT 
          id,
          first_name,
          surname,
          email_address,
          phone_number,
          administrator,
          created_by,
          created_date,
          updated_by,
          updated_date,
          version
        FROM
          public.coaches AS c
        WHERE
          c.id = $1      
      `, [request.params.coachId]);
    
      var returnMessage = {};
    
      returnMessage.error = null;
      returnMessage.body = {};
    
      returnMessage.body.coachDetails = result.rows.map(row => {
        Object.defineProperty(row, 'firstName', Object.getOwnPropertyDescriptor(row, 'first_name'));
        delete row['first_name'];
    
        Object.defineProperty(row, 'emailAddress', Object.getOwnPropertyDescriptor(row, 'email_address'));
        delete row['email_address'];
    
        Object.defineProperty(row, 'phoneNumber', Object.getOwnPropertyDescriptor(row, 'phone_number'));
        delete row['phone_number'];
    
        Object.defineProperty(row, 'createdBy', Object.getOwnPropertyDescriptor(row, 'created_by'));
        delete row['created_by'];
    
        Object.defineProperty(row, 'createdDate', Object.getOwnPropertyDescriptor(row, 'created_date'));
        delete row['created_date'];
    
        Object.defineProperty(row, 'updatedBy', Object.getOwnPropertyDescriptor(row, 'updated_by'));
        delete row['updated_by'];
    
        Object.defineProperty(row, 'updatedDate', Object.getOwnPropertyDescriptor(row, 'updated_date'));
        delete row['updated_date'];
    
        return row;
      })[0];

      const football_coach_roles = await app.pool.query(`
        SELECT 
          g.name AS group_name,
          'Football Coach' AS role
        FROM
          public.groups AS g
        WHERE
          g.football_coach_id = $1
      `, [request.params.coachId]);

      const hurling_coach_roles = await app.pool.query(`
        SELECT 
          g.name AS group_name,
          'Hurling Coach' AS role
        FROM
          public.groups AS g
        WHERE
          g.hurling_coach_id = $1
      `, [request.params.coachId]);

      returnMessage.body.coachRoles = football_coach_roles.rows.concat(hurling_coach_roles.rows);

      returnMessage.body.coachRoles.sort((a, b) => {
        if (a.group_name > b.group_name) {
          return -1;
        }
        if (a.group_name < b.group_name) {
          return 1;
        }
        
        return 0;
      });

      returnMessage.body.coachRoles = returnMessage.body.coachRoles.map(row => {
        Object.defineProperty(row, 'groupName', Object.getOwnPropertyDescriptor(row, 'group_name'));
        delete row['group_name'];

        return row;
      });

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/createCoach', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var coachDetails = request.body.coachDetails,
          sqlStatement = [],
          fieldIndex = 0,
          fieldNames = [],
          fieldValues = [],
          fieldPositionParams = [];

      if (!coachDetails) {
        throw new Error ('coachDetails not found in request');
      }

      sqlStatement.push('INSERT INTO public.coaches (');

      if (Object.prototype.hasOwnProperty.call(coachDetails, 'emailAddress')) {
        fieldNames.push('email_address');
        fieldValues.push(coachDetails.emailAddress);
      }
      if (Object.prototype.hasOwnProperty.call(coachDetails, 'firstName')) {
        fieldNames.push('first_name');
        fieldValues.push(coachDetails.firstName);
      }
      if (Object.prototype.hasOwnProperty.call(coachDetails, 'surname')) {
        fieldNames.push('surname');
        fieldValues.push(coachDetails.surname);
      }
      if (Object.prototype.hasOwnProperty.call(coachDetails, 'phoneNumber')) {
        fieldNames.push('phone_number');
        fieldValues.push(coachDetails.phoneNumber);
      }
      if (Object.prototype.hasOwnProperty.call(coachDetails, 'administrator')) {
        fieldNames.push('administrator');
        fieldValues.push(coachDetails.administrator);
      }

      fieldNames.push('created_by');
      fieldValues.push(request.payload.userProfile.ID);
      fieldNames.push('created_date');
      fieldValues.push(moment.utc().toISOString());

      sqlStatement.push(fieldNames.join(',\n'));

      sqlStatement.push(`)
        VALUES (`);

      for (fieldIndex = 1; fieldIndex <= fieldNames.length; fieldIndex++) { 
        fieldPositionParams.push('$' + fieldIndex)  
      }

      sqlStatement.push(fieldPositionParams.join(',\n'));

      sqlStatement.push(')');

      await app.pool.query(sqlStatement.join('\n'), fieldValues);

      const emailTemplate = await readFile('email_templates/create-password-template.html');
  
      sendEmail(coachDetails.emailAddress, 
        'Welcome to Carraig Og Register. Please verify your account...', 
        emailTemplate.replace('[[token]]', JSONWebToken.sign({ emailAddress: coachDetails.emailAddress }, config.secret)), 
        request);  

      await readCoachSummaries(app, response, next);
    }
    catch (error) {
      next(error);
    };
  });

  router.post('/updateCoach', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var coachDetails = request.body.coachDetails,
          sqlStatement = [],
          setIndex = 0,
          setStatements = [],
          setValues = [],
          result = null;

      if (!coachDetails) {
        throw new Error ('coachDetails not found in request');
      }

      sqlStatement.push(`
        UPDATE 
          public.coaches
        SET`);

      if (Object.prototype.hasOwnProperty.call(coachDetails, 'emailAddress')) {
        setStatements.push('email_address = ($' + (++setIndex) + ')');
        setValues.push(coachDetails.emailAddress);
      }
      if (Object.prototype.hasOwnProperty.call(coachDetails, 'firstName')) {
        setStatements.push('first_name = ($' + (++setIndex) + ')');
        setValues.push(coachDetails.firstName);
      }
      if (Object.prototype.hasOwnProperty.call(coachDetails, 'surname')) {
        setStatements.push('surname = ($' + (++setIndex) + ')');
        setValues.push(coachDetails.surname);
      }
      if (Object.prototype.hasOwnProperty.call(coachDetails, 'phoneNumber')) {
        setStatements.push('phone_number = ($' + (++setIndex) + ')');
        setValues.push(coachDetails.phoneNumber);
      }
      if (Object.prototype.hasOwnProperty.call(coachDetails, 'administrator')) {
        setStatements.push('administrator = ($' + (++setIndex) + ')');
        setValues.push(coachDetails.administrator);
      }

      setStatements.push('updated_by = ($' + (++setIndex) + ')');
      setValues.push(request.payload.userProfile.ID);
      setStatements.push('updated_date = ($' + (++setIndex) + ')');
      setValues.push(moment.utc().toISOString());

      sqlStatement.push(setStatements.join(',\n'));

      sqlStatement.push(`
        WHERE 
          id = ` + coachDetails.id + ` AND
          version = '` + coachDetails.version + `'`);

      result = await app.pool.query(sqlStatement.join('\n'), setValues);
      
      if (result.rowCount === 0) {
        throw new Error('No coach rows updated. Possible concurrency issue.')
      }

      await readCoachSummaries(app, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/deleteCoach', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      if (!request.body.coachSummary) {
        throw new Error ('coachSummary not found in request');
      }

      const result = await app.pool.query(`
        DELETE FROM 
          public.coaches
        WHERE 
          id = $1 AND
          version = $2
      `, [request.body.coachSummary.id, request.body.coachSummary.version]);
        
      if (result.rowCount === 0) {
        throw new Error('No coach deleted. Possible concurrency issue.')
      }

      if (request.body.sendGoodbyeEmail) {
        const emailTemplate = await readFile('email_templates/goodbye-template.html');
    
        sendEmail(foundUser.emailAddress, 'Goodbye from Carraig Og Register', emailTemplate, request);
      }

      await readCoachSummaries(app, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/writeLog', authorizer.authorize(), function (request, response, next) {
    request.logger.error({ clientError: request.body });
    
    var returnMessage = {};

    returnMessage.error = null;
    returnMessage.body = {};

    response.status(200).json(returnMessage);
  });

  app.use('/api', router);

  app.use(function (request, response) {
    response.sendFile('index.html', { 'root': './dist'});
  });
}

var readGroupSummaries = async (app, currentSettings, response, next) => {
  const result = await app.pool.query(`
    SELECT
      g.id,
      g.year_of_birth,
      g.name,
      g.version,
      (SELECT 
        c1.first_name || ' ' || c1.surname
      FROM
        public.coaches AS c1
      WHERE
        g.football_coach_id = c1.id) AS football_coach_full_name,
      (SELECT 
        c1.first_name || ' ' || c1.surname
      FROM
        public.coaches AS c1
      WHERE
        g.hurling_coach_id = c1.id) AS hurling_coach_full_name,
      (SELECT
        COUNT(*)
      FROM
        public.groups_players AS gp1
      WHERE
        gp1.group_id = g.id) AS number_of_players,
      (SELECT
        MAX(p1.updated_date)
      FROM
        public.players AS p1
      INNER JOIN public.groups_players gp1
        ON p1.id = gp1.player_id
      WHERE
        gp1.group_id = g.id) AS last_updated_date
    FROM
      public.groups AS g
    WHERE
      g.year_id = 
        (SELECT 
          y.id 
        FROM 
          public.years AS y 
        WHERE y.year = $1)
    ORDER BY
      g.year_of_birth ASC
  `, [currentSettings.year]);

  var returnMessage = {};

  returnMessage.error = null;
  returnMessage.body = {};

  returnMessage.body.groups = result.rows.map(row => {
    Object.defineProperty(row, 'yearOfBirth', Object.getOwnPropertyDescriptor(row, 'year_of_birth'));
    delete row['year_of_birth'];

    Object.defineProperty(row, 'footballCoachFullName', Object.getOwnPropertyDescriptor(row, 'football_coach_full_name'));
    delete row['football_coach_full_name'];

    Object.defineProperty(row, 'hurlingCoachFullName', Object.getOwnPropertyDescriptor(row, 'hurling_coach_full_name'));
    delete row['hurling_coach_full_name'];

    Object.defineProperty(row, 'numberOfPlayers', Object.getOwnPropertyDescriptor(row, 'number_of_players'));
    delete row['number_of_players'];

    Object.defineProperty(row, 'lastUpdatedDate', Object.getOwnPropertyDescriptor(row, 'last_updated_date'));
    delete row['last_updated_date'];

    return row;
  });

  response.status(200).json(returnMessage);
}

var searchPlayers = async (connection, dateOfBirth, currentSettings, response, next) => {
  const result = await connection.query(`
    SELECT
      p.id,
      p.first_name,
      p.surname,
      p.address_line_1,
      p.address_line_2,
      p.address_line_3,
      p.date_of_birth,
      p.medical_conditions,
      p.contact_name,
      p.contact_mobile_number,
      p.contact_home_number,
      p.contact_email_address,
      p.school,
      p.version,
      (SELECT
        MAX(gp1.registered_date)
      FROM
        public.groups_players AS gp1
      WHERE
        gp1.player_id = p.id) AS last_registered_date,
      CASE
        WHEN EXISTS
          (SELECT
            gp1.id
          FROM
            public.groups_players AS gp1
          INNER JOIN public.groups AS g1
            ON gp1.group_id = g1.id
          WHERE
            gp1.player_id = p.id AND
            g1.year_id = 
              (SELECT 
                y2.id 
              FROM 
                public.years AS y2 
              WHERE 
                y2.year = $2) AND
            EXISTS
              (SELECT
                gp2.id
              FROM
                public.groups_players AS gp2
              INNER JOIN public.groups AS g2
                ON gp2.group_id = g2.id
              WHERE
                gp2.player_id = p.id AND
                g2.year_id = 
                  (SELECT 
                    y3.id 
                  FROM 
                    public.years AS y3 
                  WHERE 
                    y3.year = $3)))
        THEN 0
        WHEN EXISTS
          (SELECT
            gp1.id
          FROM
            public.groups_players AS gp1
          INNER JOIN public.groups AS g1
            ON gp1.group_id = g1.id
          WHERE
            gp1.player_id = p.id AND
            g1.year_id = 
              (SELECT 
                y2.id 
              FROM 
                public.years AS y2 
              WHERE 
                y2.year = $2))
        THEN 1
        WHEN EXISTS
          (SELECT
            gp1.id
          FROM
            public.groups_players AS gp1
          INNER JOIN public.groups AS g1
            ON gp1.group_id = g1.id
          WHERE
            gp1.player_id = p.id AND
            g1.year_id = 
              (SELECT 
                y2.id 
              FROM 
                public.years AS y2 
              WHERE 
                y2.year = $3))
        THEN 2
        ELSE 3
      END AS player_state          
    FROM
      public.players AS p
    WHERE
      p.date_of_birth = $1
  `, [dateOfBirth, currentSettings.year, currentSettings.year - 1]);

  var returnMessage = {};

  returnMessage.error = null;
  returnMessage.body = {};

  returnMessage.body.players = result.rows.map(row => mapPlayerSummary(row));

  response.status(200).json(returnMessage);
}

var readCoachSummaries = async (app, response, next) => {
  const result = await app.pool.query(`
    SELECT 
      id,
      first_name,
      surname,
      email_address,
      phone_number,
      administrator,
      version,
      CASE 
        WHEN EXISTS
          (SELECT
            g1.id
          FROM
            public.groups AS g1
          WHERE
            g1.year_id = 
              (SELECT 
                y2.id 
              FROM 
                public.years AS y2 
              WHERE y2.year = 
                (SELECT 
                  MAX(y3.year) 
                FROM 
                  public.years AS y3)) AND
            ((g1.football_coach_id = c.id) OR (g1.hurling_coach_id = c.id))) 
		    THEN true
		    ELSE false
	    END AS active
    FROM
      public.coaches AS c
  `);
  
  var returnMessage = {};

  returnMessage.error = null;
  returnMessage.body = {};

  returnMessage.body.coaches = result.rows.map(row => {
    Object.defineProperty(row, 'firstName', Object.getOwnPropertyDescriptor(row, 'first_name'));
    delete row['first_name'];

    Object.defineProperty(row, 'emailAddress', Object.getOwnPropertyDescriptor(row, 'email_address'));
    delete row['email_address'];

    Object.defineProperty(row, 'phoneNumber', Object.getOwnPropertyDescriptor(row, 'phone_number'));
    delete row['phone_number'];

    return row;
  });

  response.status(200).json(returnMessage);
};

var mapPlayerSummary = (row) => {
  Object.defineProperty(row, 'firstName', Object.getOwnPropertyDescriptor(row, 'first_name'));
  delete row['first_name'];

  Object.defineProperty(row, 'addressLine1', Object.getOwnPropertyDescriptor(row, 'address_line_1'));
  delete row['address_line_1'];

  Object.defineProperty(row, 'addressLine2', Object.getOwnPropertyDescriptor(row, 'address_line_2'));
  delete row['address_line_2'];

  Object.defineProperty(row, 'addressLine3', Object.getOwnPropertyDescriptor(row, 'address_line_3'));
  delete row['address_line_3'];

  Object.defineProperty(row, 'dateOfBirth', Object.getOwnPropertyDescriptor(row, 'date_of_birth'));
  delete row['date_of_birth'];

  Object.defineProperty(row, 'medicalConditions', Object.getOwnPropertyDescriptor(row, 'medical_conditions'));
  delete row['medical_conditions'];

  Object.defineProperty(row, 'contactName', Object.getOwnPropertyDescriptor(row, 'contact_name'));
  delete row['contact_name'];

  Object.defineProperty(row, 'contactMobileNumber', Object.getOwnPropertyDescriptor(row, 'contact_mobile_number'));
  delete row['contact_mobile_number'];

  Object.defineProperty(row, 'contactHomeNumber', Object.getOwnPropertyDescriptor(row, 'contact_home_number'));
  delete row['contact_home_number'];

  Object.defineProperty(row, 'contactEmailAddress', Object.getOwnPropertyDescriptor(row, 'contact_email_address'));
  delete row['contact_email_address'];

  Object.defineProperty(row, 'lastRegisteredDate', Object.getOwnPropertyDescriptor(row, 'last_registered_date'));
  delete row['last_registered_date'];

  Object.defineProperty(row, 'playerState', Object.getOwnPropertyDescriptor(row, 'player_state'));
  delete row['player_state'];

  return row;
};

var readFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf-8', (error, data) => {
      try {
        if (error) {
          reject(error);
        }

        resolve(data);
      }
      catch (error) {
        reject(error);
      }
    });
  });
};

var sendEmail = (emailAddress, emailSubject, emailTemplate, request) => {
  if (process.env.NODE_ENV === 'production') {
    emailTemplate = emailTemplate.replace('[[hostname]]', request.hostname);
  }
  else {
    emailTemplate = emailTemplate.replace('[[hostname]]', request.hostname + ':' + config.port);
  }

  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'oauth2',
      user: 'carraigogregister@gmail.com',
      clientId: process.env.GOOGLE_API_CLIENT_ID,
      clientSecret: process.env.GOOGLE_API_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_OUTH2_PLAYGROUND_REFRESH_TOKEN,
      accessToken: process.env.GOOGLE_OUTH2_PLAYGROUND_ACCESS_TOKEN
    }
  });

  const mailOptions = {
    from: 'carraigogregister@gmail.com',
    to: emailAddress,
    subject: emailSubject,
    html: emailTemplate
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      request.logger.error(error);
    }
  });
}
