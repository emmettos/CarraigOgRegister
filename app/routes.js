exports = module.exports = function (app) {
  app.get('/api/groups', function (request, response, next) {
  	var returnMessage = {};

  	returnMessage.error = null;
  	returnMessage.body = {};

  	returnMessage.body.groups = [{
	  name: "Under 5",
	  yearOfBirth: 2011,
	  footballManager: "Pat",
	  hurlingManager: "Pat",
	  numberOfPlayers: 22
    }, {
	  name: "Under 6",
	  yearOfBirth: 2010,
	  footballManager: "John",
	  hurlingManager: "John",
	  numberOfPlayers: 20
    }, {
	  name: "Under 7",
	  yearOfBirth: 2009,
	  footballManager: "Jack",
      hurlingManager: "Jack",
	  numberOfPlayers: 23
    }, {
	  name: "Under 8",
	  yearOfBirth: 2008,
	  footballManager: "Peter",
	  hurlingManager: "Peter",
	  numberOfPlayers: 24
    }, {
	  name: "Under 9",
	  yearOfBirth: 2007,
	  footballManager: "Pat",
	  hurlingManager: "Pat",
	  numberOfPlayers: 25
    }, {
	  name: "Under 10",
	  yearOfBirth: 2006,
	  footballManager: "Kevin",
	  hurlingManager: "Kevin",
	  numberOfPlayers: 26
    }];

    response.status(200).json(returnMessage);
  });

  app.get("/", function (request, response) {
    response.sendfile("./public/index.html");
  });
};
