
module.exports = function(app) {
  var leagues = require('../helpers/leagueFunctions');
  app.post('/', leagues.createLeague);
  app.get('/user', leagues.getUserLeagues);
  app.get('/', leagues.getAllLeagues);
  app.post('/start', leagues.startDraft);
  app.post('/*', leagues.createOwnerTeam);
  app.get('/*', leagues.loadSchools);
  app.put('/*', leagues.selectTeam);
};