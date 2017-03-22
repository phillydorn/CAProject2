var schools = require('../helpers/schoolFunctions');

module.exports = function(app) {
  app.get('/', schools.fetchAllSchools);
  app.get('/results', schools.updateResults);
  app.get('/bracket/*', schools.fillUserBracket);
  app.get('/bracket/', schools.fillBracket);
};