"use strict";

var models = require('../models');
var leagueFunctions = require('./leagueFunctions');
var teamFunctions = require('./teamFunctions');


module.exports = {

  createTeams (req, res) {
    let {leagueId} = req.body;

    for (var i = 2; i<=6; i++) {
      let req = {
          url: '/'+leagueId,
          user: {
            id: i
          },
          body: {
            teamname: 'team' + i,
            position: i

          }
      }
      let teamId = leagueFunctions.createOwnerTeam(req)

    }
    res.status(200).json('success');
  }


}