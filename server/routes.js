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
var player = require('./models/player');
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
          coaches AS c
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

      jwtToken = await authenticator.createToken(foundUser, app.pool)

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

  router.get('/groupOverviews', authorizer.authorize(), async (request, response, next) => {
    try {
      const result = await app.pool.query(`
        SELECT
          g.id,
          g.year_of_birth,
          g.name,
          (SELECT 
            c1.first_name || ' ' || c1.surname
          FROM
            coaches AS c1
          WHERE
            g.football_coach_id = c1.id) AS football_coach_full_name,
          (SELECT 
            c1.first_name || ' ' || c1.surname
          FROM
            coaches AS c1
          WHERE
            g.hurling_coach_id = c1.id) AS hurling_coach_full_name,
          (SELECT
            COUNT(*)
          FROM
            groups_players AS gp1
          WHERE
            gp1.group_id = g.id) AS number_of_players,
          (SELECT
            MAX(p1.updated_date)
          FROM
            players AS p1
          INNER JOIN groups_players gp1
            ON p1.id = gp1.player_id
          WHERE
            gp1.group_id = g.id) AS last_updated_date
        FROM
          groups AS g
        WHERE
          g.year_id = 
            (SELECT 
              y.id 
            FROM 
              years AS y 
            WHERE y.year = $1)
        ORDER BY
          g.year_of_birth ASC      
      `, [currentSettings.year]);
  
      var returnMessage = {};

      returnMessage.error = null;
      returnMessage.body = {};

      returnMessage.body.groupOverviews = result.rows.map(row => {
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
    catch (error) {
      next(error);
    }
  });

  router.get('/playerSummaries/:yearOfBirth', authorizer.authorize({ isGroupManager: true }), async (request, response, next) => {
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
          (SELECT
            MAX(gp1.registered_date)
          FROM
            groups_players AS gp1
          WHERE
            gp1.player_id = p.id) AS last_registered_date,
          CASE
            WHEN EXISTS
              (SELECT
                gp1.id
              FROM
                groups_players AS gp1
              INNER JOIN groups AS g1
                ON gp1.group_id = g1.id
              WHERE
                gp1.player_id = p.id AND
                g1.year_id = 
                  (SELECT 
                    y2.id 
                  FROM 
                    years AS y2 
                  WHERE 
                    y2.year = $2) AND
                EXISTS
                  (SELECT
                    gp2.id
                  FROM
                    groups_players AS gp2
                  INNER JOIN groups AS g2
                    ON gp2.group_id = g2.id
                  WHERE
                    gp2.player_id = p.id AND
                    g2.year_id = 
                      (SELECT 
                        y3.id 
                      FROM 
                        years AS y3 
                      WHERE 
                        y3.year = $3)))
            THEN 0
            WHEN EXISTS
              (SELECT
                gp1.id
              FROM
                groups_players AS gp1
              INNER JOIN groups AS g1
                ON gp1.group_id = g1.id
              WHERE
                gp1.player_id = p.id AND
                g1.year_id = 
                  (SELECT 
                    y2.id 
                  FROM 
                    years AS y2 
                  WHERE 
                    y2.year = $2))
            THEN 1
            ELSE 2
          END AS player_state
        FROM
          players AS p
        INNER JOIN groups_players AS gp
          ON p.id = gp.player_id
        INNER JOIN groups AS g
          ON gp.group_id = g.id
        WHERE
          g.year_of_birth = $1 AND
          (g.year_id = 
            (SELECT 
              y1.id 
            FROM 
              years AS y1 
            WHERE 
            y1.year = $2) OR
          g.year_id = 
            (SELECT 
              y1.id 
            FROM 
              years AS y1 
            WHERE 
              y1.year = $3))
        `, [request.params.yearOfBirth, currentSettings.year, currentSettings.year - 1]);
  
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

  router.get('/searchPlayers/:dateOfBirthISOString', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      const result = await app.pool.query(`
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
          (SELECT
            MAX(gp1.registered_date)
          FROM
            groups_players AS gp1
          WHERE
            gp1.player_id = p.id) AS last_registered_date,
          CASE
            WHEN EXISTS
              (SELECT
                gp1.id
              FROM
                groups_players AS gp1
              INNER JOIN groups AS g1
                ON gp1.group_id = g1.id
              WHERE
                gp1.player_id = p.id AND
                g1.year_id = 
                  (SELECT 
                    y2.id 
                  FROM 
                    years AS y2 
                  WHERE 
                    y2.year = $2) AND
                EXISTS
                  (SELECT
                    gp2.id
                  FROM
                    groups_players AS gp2
                  INNER JOIN groups AS g2
                    ON gp2.group_id = g2.id
                  WHERE
                    gp2.player_id = p.id AND
                    g2.year_id = 
                      (SELECT 
                        y3.id 
                      FROM 
                        years AS y3 
                      WHERE 
                        y3.year = $3)))
            THEN 0
            WHEN EXISTS
              (SELECT
                gp1.id
              FROM
                groups_players AS gp1
              INNER JOIN groups AS g1
                ON gp1.group_id = g1.id
              WHERE
                gp1.player_id = p.id AND
                g1.year_id = 
                  (SELECT 
                    y2.id 
                  FROM 
                    years AS y2 
                  WHERE 
                    y2.year = $2))
            THEN 1
            ELSE 2
          END AS player_state          
        FROM
          players AS p
        WHERE
          p.date_of_birth = $1
      `, [request.params.dateOfBirthISOString, currentSettings.year, currentSettings.year - 1]);
  
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
          players AS p
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
          groups_players AS gp
        WHERE
          gp.player_id = $1 AND
          gp.registered_date = 
            (SELECT
              MAX(gp1.registered_date)
            FROM
              groups_players AS gp1
            WHERE
              gp1.player_id = $1)
      `, [request.params.playerId]);
  
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
        row['dateOfBirth'] = moment.utc(row['date_of_birth']).add(0 - row['date_of_birth'].getTimezoneOffset(), "m");
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
      returnMessage.body.groupPlayerDetails = groupPlayerResult.rows.map(row => {
        Object.defineProperty(row, 'groupId', Object.getOwnPropertyDescriptor(row, 'group_id'));
        delete row['group_id'];
                
        Object.defineProperty(row, 'playerId', Object.getOwnPropertyDescriptor(row, 'player_id'));
        delete row['player_id'];
                
        Object.defineProperty(row, 'registeredDate', Object.getOwnPropertyDescriptor(row, 'registered_date'));
        row['registeredDate'] = moment.utc(row['registered_date']).add(0 - row['registered_date'].getTimezoneOffset(), "m");
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

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/groupSummaries', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      await readGroupSummaries(app, currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/coaches', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      await readCoaches(app, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/groups', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      await readGroups(currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.get('/coachGroups/:emailAddress', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    var groups = null,
        groupIndex = 0,
        currentGroup = null,
        coachGroup = null,
        coachGroups = [],
        returnMessage = {};

    try {
      groups = await group.find({ 'year': currentSettings.year }, '-_id -__v').lean().exec();

      for (groupIndex = 0; groupIndex < groups.length; groupIndex++) {
        currentGroup = groups[groupIndex];

        if (currentGroup.footballCoach === request.params.emailAddress) {
          coachGroup = {};

          coachGroup.groupName = currentGroup.name;
          coachGroup.role = 'Football Coach';

          coachGroups.push(coachGroup);
        }
        if (currentGroup.hurlingCoach === request.params.emailAddress) {
          coachGroup = {};

          coachGroup.groupName = currentGroup.name;
          coachGroup.role = 'Hurling Coach';

          coachGroups.push(coachGroup);
        }
      }

      returnMessage.error = null;
      returnMessage.body = {};

      returnMessage.body.coachGroups = coachGroups;

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/createPlayer', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var groupDetails = request.body.groupDetails,
          playerDetails = request.body.playerDetails,
          newPlayer = new player(),
          lastRegisteredDate = null,
          savedPlayer = null, 
          returnMessage = {};

      newPlayer.dateOfBirth = new Date(playerDetails.dateOfBirth);
      newPlayer.yearOfBirth = newPlayer.dateOfBirth.getFullYear();

      newPlayer.firstName = playerDetails.firstName;
      newPlayer.surname = playerDetails.surname;
      newPlayer.addressLine1 = playerDetails.addressLine1;
      newPlayer.addressLine2 = playerDetails.addressLine2;
      newPlayer.addressLine3 = playerDetails.addressLine3;
      newPlayer.addressLine4 = playerDetails.addressLine4;
      newPlayer.medicalConditions = playerDetails.medicalConditions;
      newPlayer.contactName = playerDetails.contactName;
      newPlayer.contactHomeNumber = playerDetails.contactHomeNumber;
      newPlayer.contactMobileNumber = playerDetails.contactMobileNumber;
      newPlayer.contactEmailAddress = playerDetails.contactEmailAddress;
      newPlayer.school = playerDetails.school;

      lastRegisteredDate = new Date(playerDetails.lastRegisteredDate)
      newPlayer.lastRegisteredDate = lastRegisteredDate;
      newPlayer.lastRegisteredYear = lastRegisteredDate.getFullYear();
      newPlayer.registeredYears.push(newPlayer.lastRegisteredYear);

      newPlayer.modifiedBy = request.payload.userProfile.ID;

      savedPlayer = await newPlayer.save();

      await group.findOneAndUpdate(
          { 'year': groupDetails.year, 'yearOfBirth': groupDetails.yearOfBirth }, 
          { 'lastUpdatedDate': new Date() });

      returnMessage.error = null;
      returnMessage.body = {};

      returnMessage.body.player = savedPlayer.toObject();

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/updatePlayer', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var groupDetails = request.body.groupDetails,
          playerDetails = request.body.playerDetails,
          lastRegisteredDate = null,
          lastRegisteredYear = null,
          foundPlayer = null,
          updatedPlayer = null,
          customError = null,
          returnMessage = {};

      foundPlayer = await player.findOne({ '_id': mongoose.Types.ObjectId(playerDetails._id), '__v': playerDetails.__v });

      if (!foundPlayer) {
        customError = new Error('Player not found');

        customError.httpCode = 409;

        throw customError;
      }

      foundPlayer.addressLine1 = Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine1') ? playerDetails.addressLine1 : foundPlayer.addressLine1;
      foundPlayer.addressLine2 = Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine2') ? playerDetails.addressLine2 : foundPlayer.addressLine2;
      foundPlayer.addressLine3 = Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine3') ? playerDetails.addressLine3 : foundPlayer.addressLine3;
      foundPlayer.addressLine4 = Object.prototype.hasOwnProperty.call(playerDetails, 'addressLine4') ? playerDetails.addressLine4 : foundPlayer.addressLine4;
      foundPlayer.medicalConditions = Object.prototype.hasOwnProperty.call(playerDetails, 'medicalConditions') ? playerDetails.medicalConditions : foundPlayer.medicalConditions;
      foundPlayer.contactName = Object.prototype.hasOwnProperty.call(playerDetails, 'contactName') ? playerDetails.contactName : foundPlayer.contactName;
      foundPlayer.contactHomeNumber = Object.prototype.hasOwnProperty.call(playerDetails, 'contactHomeNumber') ? playerDetails.contactHomeNumber : foundPlayer.contactHomeNumber;
      foundPlayer.contactMobileNumber = Object.prototype.hasOwnProperty.call(playerDetails, 'contactMobileNumber') ? playerDetails.contactMobileNumber : foundPlayer.contactMobileNumber;
      foundPlayer.contactEmailAddress = Object.prototype.hasOwnProperty.call(playerDetails, 'contactEmailAddress') ? playerDetails.contactEmailAddress : foundPlayer.contactEmailAddress;
      foundPlayer.school = Object.prototype.hasOwnProperty.call(playerDetails, 'school') ? playerDetails.school : foundPlayer.school;

      if (Object.prototype.hasOwnProperty.call(playerDetails, 'lastRegisteredDate')) {
        lastRegisteredDate = new Date(playerDetails.lastRegisteredDate)
        foundPlayer.lastRegisteredDate = lastRegisteredDate;
        foundPlayer.lastRegisteredYear = lastRegisteredDate.getFullYear();

        lastRegisteredYear = foundPlayer.registeredYears.find(function (item) {
          return item === foundPlayer.lastRegisteredYear;
        });
        if (!lastRegisteredYear) {
          foundPlayer.registeredYears.push(foundPlayer.lastRegisteredYear);
        }
      }

      foundPlayer.modifiedBy = request.payload.userProfile.ID;
      foundPlayer.increment();

      updatedPlayer = await foundPlayer.save();

      await group.findOneAndUpdate(
        { 'year': groupDetails.year, 'yearOfBirth': groupDetails.yearOfBirth }, 
        { 'lastUpdatedDate': new Date() });

      returnMessage.error = null;
      returnMessage.body = {};

      returnMessage.body.player = updatedPlayer.toObject();

      response.status(200).json(returnMessage);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/createCoach', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var userDetails = request.body.coachDetails,
          newUser = new user(),
          savedUser,
          emailTemplate;

      newUser.firstName = userDetails.firstName;
      newUser.surname = userDetails.surname;
      newUser.emailAddress = userDetails.emailAddress;
      newUser.phoneNumber = userDetails.phoneNumber;
      newUser.isAdministrator = userDetails.isAdministrator;
      newUser.password = '';

      newUser.modifiedBy = request.payload.userProfile.ID;

      savedUser = await newUser.save();

      emailTemplate = await readFile('email_templates/create-password-template.html');
   
      sendEmail(savedUser.emailAddress, 
        'Welcome to Carraig Og Register. Please verify your account...', 
        emailTemplate.replace('[[token]]', JSONWebToken.sign({ emailAddress: savedUser.emailAddress }, config.secret)), 
        request);

      await readCoaches(currentSettings, response, next);
    }
    catch (error) {
      next(error);
    };
  });

  router.post('/updateCoach', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var userDetails = request.body.coachDetails,
          customError = null,
          foundUser = null;

      foundUser = await user.findOne({ '_id': mongoose.Types.ObjectId(userDetails._id), '__v': userDetails.__v });

      if (!foundUser) {
        customError = new Error('User not found');

        customError.httpCode = 409;

        throw customError;
      }

      foundUser.firstName = Object.prototype.hasOwnProperty.call(userDetails, 'firstName') ? userDetails.firstName : foundUser.firstName;
      foundUser.surname = Object.prototype.hasOwnProperty.call(userDetails, 'surname') ? userDetails.surname : foundUser.surname;
      foundUser.emailAddress = Object.prototype.hasOwnProperty.call(userDetails, 'emailAddress') ? userDetails.emailAddress : foundUser.emailAddress;
      foundUser.phoneNumber = Object.prototype.hasOwnProperty.call(userDetails, 'phoneNumber') ? userDetails.phoneNumber : foundUser.phoneNumber;
      foundUser.isAdministrator = Object.prototype.hasOwnProperty.call(userDetails, 'isAdministrator') ? userDetails.isAdministrator : foundUser.isAdministrator;
  
      foundUser.modifiedBy = request.payload.userProfile.ID;
      foundUser.increment();

      await foundUser.save();

      await readCoaches(currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/deleteCoach', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var userDetails = request.body.coachDetails,
          customError = null,
          foundUser = null,
          emailTemplate = null;

      foundUser = await user.findOne({ '_id': mongoose.Types.ObjectId(userDetails._id), '__v': userDetails.__v })

      if (!foundUser) {
        customError = new Error('User not found');

        customError.httpCode = 409;

        throw customError;
      }

      await group.update({ 'year': currentSettings.year, 'footballCoach': foundUser.emailAddress }, { 'footballCoach': '' });
      await group.update({ 'year': currentSettings.year, 'hurlingCoach': foundUser.emailAddress }, { 'hurlingCoach': '' });
      
      await user.deleteOne({ '_id': mongoose.Types.ObjectId(foundUser._id), '__v': foundUser.__v })
 
      if (request.body.sendGoodbyeEmail) {
        emailTemplate = await readFile('email_templates/goodbye-template.html');
    
        sendEmail(foundUser.emailAddress, 'Goodbye from Carraig Og Register', emailTemplate, request);
      }

      await readCoaches(currentSettings, response, next);
    }
    catch (error) {
      next(error);
    }
  });

  router.post('/updateGroup', authorizer.authorize({ isAdministrator: true }), async (request, response, next) => {
    try {
      var groupDetails = request.body.groupDetails,
          customError = null,
          foundGroup = null;

      foundGroup = await group.findOne({ '_id': mongoose.Types.ObjectId(groupDetails._id), '__v': groupDetails.__v });

      if (!foundGroup) {
        customError = new Error('Group not found');

        customError.httpCode = 409;

        throw customError;
      }

      foundGroup.footballCoach = Object.prototype.hasOwnProperty.call(groupDetails, 'footballCoach') ? groupDetails.footballCoach : foundGroup.footballCoach;
      foundGroup.hurlingCoach = Object.prototype.hasOwnProperty.call(groupDetails, 'hurlingCoach') ? groupDetails.hurlingCoach : foundGroup.hurlingCoach;
  
      foundGroup.modifiedBy = request.payload.userProfile.ID;
      foundGroup.increment();

      await foundGroup.save();

      await readGroups(currentSettings, response, next);
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
      (SELECT 
        c1.first_name || ' ' || c1.surname
      FROM
        coaches AS c1
      WHERE
        g.football_coach_id = c1.id) AS football_coach_full_name,
      (SELECT 
        c1.first_name || ' ' || c1.surname
      FROM
        coaches AS c1
      WHERE
        g.hurling_coach_id = c1.id) AS hurling_coach_full_name,
      (SELECT
        MAX(p1.updated_date)
      FROM
        players AS p1
      INNER JOIN groups_players gp1
        ON p1.id = gp1.player_id
      WHERE
        gp1.group_id = g.id) AS last_updated_date
    FROM
      groups AS g
    WHERE
      g.year_id = 
        (SELECT 
          y.id 
        FROM 
          years AS y 
        WHERE y.year = $1)
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

    Object.defineProperty(row, 'lastUpdatedDate', Object.getOwnPropertyDescriptor(row, 'last_updated_date'));
    delete row['last_updated_date'];

    return row;
  });

  response.status(200).json(returnMessage);
}

var readCoaches = async (app, response, next) => {
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
      version,
      CASE 
        WHEN EXISTS
          (SELECT
            g1.id
          FROM
            groups AS g1
          WHERE
            g1.year_id = 
              (SELECT 
                y2.id 
              FROM 
                years AS y2 
              WHERE y2.year = 
                (SELECT 
                  MAX(y3.year) 
                FROM 
                  years AS y3)) AND
            ((g1.football_coach_id = c.id) OR (g1.hurling_coach_id = c.id))) 
		    THEN true
		    ELSE false
	    END AS active
    FROM
      coaches AS c
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
  row['dateOfBirth'] = moment.utc(row['date_of_birth']).add(0 - row['date_of_birth'].getTimezoneOffset(), "m");
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
  row['lastRegisteredDate'] = moment.utc(row['last_registered_date']).add(0 - row['last_registered_date'].getTimezoneOffset(), "m");
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
