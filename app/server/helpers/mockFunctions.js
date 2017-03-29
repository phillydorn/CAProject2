"use strict";

var models = require('../models');
var leagueFunctions = require('./leagueFunctions');
var teamFunctions = require('./teamFunctions');


module.exports = {

  countTeams(leagueId) {
    models.League.findById(leagueId).then((league)=>{
      league.getTeams().then((teams)=>{
        return Promise.resolve(teams.length);
      });
    });
  },

  createTeams (req, res) {
    let {leagueId} = req.body;

    countTeams(leagueId)
      .then((teamCount)=> {
        if (teamCount < 6) {
          for (var i = teamCount+1; i<=6; i++) {
            let req = {
                url: '/'+leagueId,
                user: {
                  id: i
                },
                body: {
                  teamname: 'CPU Team ' + i,
                  position: i

                }
            }
            let teamId = leagueFunctions.createOwnerTeam(req)

          }
        }
        res.status(200).json('success');
      })
  }


}