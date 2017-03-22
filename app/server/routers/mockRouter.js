var mocks = require('../helpers/mockFunctions');

module.exports = function(app) {
  app.post('/teams', mocks.createTeams);
};