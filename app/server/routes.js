var express=require('express');
var bodyParser = require('body-parser');


module.exports = function(app, io) {

  var schoolRouter = express.Router();
  var leagueRouter = express.Router();
  var teamRouter = express.Router();
  var mockRouter = express.Router();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use('/api/schools', schoolRouter);
  app.use('/api/leagues', leagueRouter);
  app.use('/api/teams', teamRouter);
  app.use('/api/mocks', mockRouter);

  require('./routers/schoolRouter.js')(schoolRouter);
  require('./routers/leagueRouter.js')(leagueRouter, io);
  require('./routers/teamRouter.js')(teamRouter);
  require('./routers/mockRouter.js')(mockRouter);
};