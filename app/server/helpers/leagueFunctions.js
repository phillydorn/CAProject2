"use strict";

var models = require('../models');
var draft = require('./draftFunctions');

var draftOrder = [
  [0,1,2,3,4,5],
  [5,4,3,2,1,0],
  [4,5,0,1,2,3],
  [3,2,1,0,5,4],
  [2,3,4,5,0,1],
  [1,0,5,4,3,2],
  [0,1,2,3,4,5],
  [5,4,3,2,1,0],
  [4,5,0,1,2,3],
  [3,2,1,0,5,4]
];

var draftPositions = [{},{},{},{},{},{}],
    round = 0,
    position = 0;

module.exports = {


  createLeague : function(req, res) {

    models.sequelize.sync().then(function() {
      models.League.findOrCreate({
        where: {
          name: req.body.leaguename
        },
        defaults: {
          name: req.body.leaguename
        }
      }).then(function(league) {
        models.NCAA_Team.findAll().then(function(teams) {
          league[0].setNCAA_Teams(teams);
        })
        .then(function() {
            models.User.find({
              where: {
                id: req.user.id
              }
            }).then (function(user) {
              league[0].setUsers(user);
              console.log('league id', league[0].id)
              res.status(200).json(league[0].id);
            });

        });
      });
    });
  },

  createOwnerTeam: function(req, res) {

    var io = require('../server');
    var teamName = req.body.teamname;
    var userID = req.user.id;
    var leagueID = req.url.slice(1);
    let {position} = req.body;

    console.log('team', teamName, 'user', userID, 'leag', leagueID, 'pos', position)

    models.Team.create({team_name:teamName, wins:0}).then (function(team) {
      models.League.findById(leagueID).then(function(league) {
        league.addTeam(team).then (function() {
          league.totalUsers++;
          league.save().then (function() {
            team.draftPosition = league.totalUsers;
            team.save().then (function() {
              models.User.findById(userID).then(function(user) {
                user.addTeam(team).then(function() {
                  user.addLeague(league).then (function() {
                    models.NCAA_Team.findAll().then(function(NCAAs) {
                      NCAAs.forEach((NCAA)=>{
                        team.addNCAA_Team(NCAA, {playerRanking: NCAA.RPI_Ranking});
                        team.autodraft = true;
                        if (position) {
                          team.draftPosition = position;
                          league.totalUsers = 6;
                        }
                        league.save();
                        team.save();
                      })
                      if (res) {
                        res.status(200).send('success');
                      } else {
                        io.to(leagueID).emit('update', leagueID);
                        return team.id;
                      }
                    })
                  });
                });
              });
            });
          })
        });
      });
    });


  },


  getUserLeagues: function(req, res) {
    if (req.user) {
      models.League.findAll({
        include: [{
          model: models.User,
          where: {
            id: req.user.id
          }
        }]
      }).then (function(leagues) {
        res.status(200).json({leaguesList: leagues});
      });
    } else {
      res.status(200).json({leaguesList: []});
    }

  },

  getAllLeagues: function(req, res) {
    models.League.findAll({
      where: {
        totalUsers: {
          $lt: 6
        }
      }
    }).then (function(leagues) {
      res.status(200).json(leagues);
    });
  },

  loadSchools: function(req, res) {
    var id = req.url.slice(1);
    console.log('url', req.url)
    models.League.findById(id).then ( (league)=> {
      league.getNCAA_Teams({
        order: ['RPI_Ranking']
      }).then ((NCAATeams) =>{
        let data = {schoolsList: NCAATeams, leagueName:league.name}
        league.getTeams().then((teams)=>{
          data.teams = teams;
          models.User.findById(req.user.id).then((user) => {
            data.username = user.username;
            teams.forEach((team) =>{
              if (team.UserId===user.id) {
                team.autodraft = false;
                team.save();
                data.userTeam = team;
                data.draftOrder = module.exports.getDraftOrder(teams);
                res.status(200).json(data);
              }
            });
          });
        });

      });
    })
  },

  getDraftOrder (teams) {
    return draftOrder.map((round)=>{
      return round.map((position)=>{
        return teams.filter((team)=>{
          return team.draftPosition-1 == position;
        })[0]
      });
    });
  },

  draftTeam(league, team, schoolId, round, res, io) {
    team.getNCAA_Teams({where: {id: schoolId}}).then (function(schools) {
      let school = schools[0];
      school.Team_NCAA.draftedByMe = true;
      school.Team_NCAA.round = round;
      school.Team_NCAA.save();
      school.getTeams({
        include: [{
          model: models.League,
          where: {id: league.id}
        }],
        where: {
          $not: [{id:team.id}],

        }
      }).then((otherTeams)=>{
        otherTeams.forEach((otherTeam)=>{
          otherTeam.Team_NCAA.draftedByOther = true;
          otherTeam.Team_NCAA.save();
        });
      });
      console.log('team', team.team_name, 'drafting', school.market)
      league.removeNCAA_Team(school).then (function() {
        if (res) {
          res.status(200).json(league);
        } else {
          draft.advance(league.id, io)
        }
      })
    });
  },

  selectTeam(req, res) {
    var schoolId = req.body.schoolId;
    var leagueId = req.url.slice(1);
    var userId = req.user.id;
    var round = draft.getRound(leagueId);
    models.League.findById(leagueId).then((league)=> {
      models.Team.findOne({
        where: {
          LeagueId: leagueId,
          UserId: userId
        }
      }).then ((team) => {
        module.exports.draftTeam(league, team, schoolId, round, res);
      });
    });
  },

  findNextDraftId(round, position) {
    console.log('round', round, 'position', position)
    let currentDraftPosition = draftOrder[round][position];
    return draftPositions[currentDraftPosition];
  },

  startDraft(io, leagueId) {
    models.League.findById(leagueId).then((league)=>{
      league.getTeams().then((teams)=>{
        teams.forEach((team)=>{
          draftPositions[team.draftPosition-1].id=team.id;
          draftPositions[team.draftPosition-1].team_name=team.team_name;
        });
        console.log('draftpositions', draftPositions)
        io.to(leagueId).emit('advance', {round: 0, position: 0, nextUpId:draftPositions[0].id, nextUpName: draftPositions[0].team_name});
        draft.startDraft(io, leagueId, draftPositions[0].id);

      });
    });
  },

  updateLeague(leagueId) {
    models.League.findById(leagueId).then((league)=>{
      league.getUsers().then((users)=>{
      });
    });
  }
}
