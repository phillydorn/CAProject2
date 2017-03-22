"use strict";

var models = require('../models');
var Sequelize = require('sequelize');

module.exports = {

  loadPool (req, res) {
    console.log('loadingpool')
    let teamId = req.url.split('/')[2];
    models.Team.findById(teamId).then((team)=>{
      team.getNCAA_Teams().then((schools)=>{
        models.League.findById(team.LeagueId).then((league)=>{
          league.getNCAA_Teams().then((leagueSchools) => {
            schools = schools.sort((a,b)=>{
              return a.Team_NCAA.playerRanking - b.Team_NCAA.playerRanking;
            })
            let undraftedSchools = [];
            schools.forEach((school) =>{
              leagueSchools.forEach((leagueSchool) =>{
                if (school.id == leagueSchool.id) {
                  undraftedSchools.push(leagueSchool);
                }
              });
            });
            res.status(200).json({schoolsList: undraftedSchools});

          });
        });
      });
    });
  },

  loadSchools: function(req, res) {
    var teamId = req.url.slice(1);
    models.Team.findById(teamId).then(function(team) {
      if (team) {
        team.getNCAA_Teams().then(function(schools){
          let draftedSchools = schools.filter((school)=>{
            return school.Team_NCAA.draftedByMe;
          });
          res.status(200).send(draftedSchools);
        });
      } else {
        res.status(200).send([]);
      }
    }).catch(function(err) {
        res.status(200).send([]);
      });
  },

  rerank(req, res){
    let teamId = req.url.slice(1);
    let {schoolId, currentRank, newRank } = req.body;
    currentRank = +currentRank;
    newRank = +newRank;
    let totalTeams = 0;
    console.log('current', currentRank, 'newrank', newRank)

    models.Team.findById(teamId).then((team)=>{
      team.getNCAA_Teams().then((NCAATeams)=>{
        NCAATeams.forEach((NCAATeam) => {
          let {playerRanking} = NCAATeam.Team_NCAA;
          let { market } = NCAATeam;


          if (newRank < currentRank) {
            if (NCAATeam.id == schoolId) {
              NCAATeam.Team_NCAA.playerRanking = newRank+1;
            } else if (playerRanking >newRank && playerRanking < currentRank) {
              NCAATeam.Team_NCAA.playerRanking++;
            };
          } else {
            if (NCAATeam.id == schoolId) {
              NCAATeam.Team_NCAA.playerRanking = newRank;
            } else if (playerRanking > currentRank && playerRanking <= newRank) {
              NCAATeam.Team_NCAA.playerRanking --;
            }
          }
          NCAATeam.Team_NCAA.save();
          // NCAATeam.save();
          totalTeams ++;
          if (totalTeams >= NCAATeams.length) {
            res.sendStatus(200);
          }
        })
      })
    })
  },

  turnOffAutoDraft(teamId) {
    console.log('turning off', teamId)
    models.Team.findById(teamId).then((team) =>{
      team.autodraft=false;
      team.save();
    });
  },

  turnOnAutoDraft(teamId) {
    console.log('turnign on', teamId)
    models.Team.findById(teamId).then((team) =>{
      team.autodraft=true;
      team.save();
    });
  },

  getTeamId(req, res) {
    let leagueId = req.url.split('/')[2];

    models.Team.findAll({
      where: {
        LeagueId: leagueId,
        UserId: req.user.id
      }
    }).then ((teams)=>{
        res.status(200).json(teams[0].id);
      });
  },

  getTeamName(teamId, leagueId, schoolName, io) {
    models.Team.findById(teamId).then((team)=>{
      console.log('team name ', team.team_name)
      let message = {username: 'DraftBot', content: team.team_name + ' has chosen ' + schoolName + '.'};
      io.to(leagueId).emit('newMessage', message);
    });
  },

  getTopRankedTeam(team, league, callback) {

    league.getNCAA_Teams().then((schools)=>{
      team.getNCAA_Teams().then((teamSchools)=>{
        schools = schools.sort((a,b)=>{
          let aPlayerRanking, bPlayerRanking;
          teamSchools.forEach((teamSchool)=>{
            if (a.id == teamSchool.id) {
              aPlayerRanking = teamSchool.Team_NCAA.playerRanking;
            } else if (b.id == teamSchool.id) {
              bPlayerRanking = teamSchool.Team_NCAA.playerRanking;

            }
          });
          return aPlayerRanking - bPlayerRanking;
        })
        callback(schools[0]);
      }).catch((error) =>{
        console.log('error', error)
      })

    });
  }
}