var teams = require('../helpers/teamFunctions');

module.exports = function(app) {
  app.get('/pool/*', teams.loadPool);
  app.get('/league/*', teams.getTeamId);
  app.get('/*', teams.loadSchools);
  app.put('/*', teams.rerank);
};