"use strict";

var models = require('../models');
var request = require('request');

if (!process.env.CLIENT_ID) {
  var keys = require('../keys.js');
  var sportRadarKey = keys.sportradarKey;
  } else {
    var sportRadarKey = process.env.CLIENT_ID;
  }

module.exports = {
  fetchAllSchools: function(req, res) {
    request({
      // url: 'http://api.sportradar.us/ncaamb-t3/tournaments/83c03d12-e03b-4f71-846c-5d42ba90eeb1/schedule.json?api_key='+keys.sportradarKey,
      url: 'http://api.sportradar.us/ncaamb-t3/tournaments/608152a4-cccc-4569-83ac-27062580099e/summary.json?api_key='+sportRadarKey
    },
      function(err, resp, body) {
        var brackets = JSON.parse(body).brackets;
        setTimeout(()=>{
          request({
            url: 'http://api.sportradar.us/ncaamb-t3/polls/rpi/2015/rankings.json?api_key='+sportRadarKey
          },
            (err, resp, body) => {
              let RPI_Teams = JSON.parse(body).rankings;
              let allSchools = [];
              brackets.forEach(function(bracket) {
                let bracketSchools = bracket.participants.map((school)=>{
                  return {bracket:bracket.name, school:school }
                });
                allSchools = allSchools.concat(bracketSchools);
              });

              allSchools = allSchools.sort((a,b)=>{
                let aRank, bRank;
                RPI_Teams.forEach((RPI_Team)=>{
                  if (RPI_Team.id === a.school.id) {
                    aRank = RPI_Team.rank;
                  } else if (RPI_Team.id === b.school.id) {
                    bRank = RPI_Team.rank;
                  }
                });
                return aRank-bRank;
              });
              allSchools.forEach(function(allSchool, index){
                models.NCAA_Team.create({
                  sportRadarID:allSchool.school.id,
                  NCAA_Team_name: allSchool.school.name,
                  sportRadarID: allSchool.school.id,
                  seed: allSchool.school.seed,
                  market: allSchool.school.market,
                  bracket: allSchool.bracket,
                  RPI_Ranking: index+1
                })
              });
        });
      },2000)
    });
  },

  fillBracket(req, res) {
    models.NCAA_Team.findAll().then((schools)=>{
      let bracketSchools = schools.map((school)=>{
        let {market, bracket, id, seed, wins, isPlayIn, playInWin, round1Win, round2Win, round16Win, round8Win, round4Win, roundFinalWin } = school;
        return {market, bracket, id, seed, wins, isPlayIn, playInWin, round1Win, round2Win, round16Win, round8Win, round4Win, roundFinalWin }
      });
      res.status(200).json(bracketSchools)
    });
  },

  fillUserBracket(req, res) {
    let leagueId = req.url.slice(1);
    models.League.findById(leagueId).then((league)=>{
      models.User.findById(req.user.id).then((user)=>{
        league.getTeams({where: {userId:req.user.id}}).then((team)=>{
          console.log(team)
        });
      });
    });

  },

  totalWins(team) {
    let total = 0;
    if (team.playInWin) {
      total++;
    }
    if (team.round1Win) {
      total++;
    }
    if (team.round2Win) {
      total++;
    }
    if (team.round16Win) {
      total++;
    }
    if (team.round8Win) {
      total++;
    }
    if (team.round4Win) {
      total++;
    }
    if (team.roundFinalWin) {
      total++;
    }
    return total;
  },

  findWins(round, roundWin) {
    round.forEach((bracket)=>{
      bracket.games.forEach((game)=> {
        if (game.away.name !== game.away.alias && game.away.source && game.away.source.outcome === "win") {
          const winnerId = game.away.id;
          models.NCAA_Team.findAll({where:{sportRadarID: winnerId}}).then((teams)=>{
            teams[0][roundWin] = true;
            teams[0].wins = module.exports.totalWins(teams[0]);
            teams[0].save();
          });
        } if (game.home.name !== game.home.alias && game.home.source && game.home.source.outcome === "win") {
          const winnerId = game.home.id;
          models.NCAA_Team.findAll({where:{sportRadarID: winnerId}}).then((teams)=>{
            teams[0][roundWin] = true;
            teams[0].wins = module.exports.totalWins(teams[0]);
            teams[0].save();
          });
        }
      });
    });
  },

  updateResults(req, res) {
     request({
      url: 'http://api.sportradar.us/ncaamb-t3/tournaments/608152a4-cccc-4569-83ac-27062580099e/schedule.json?api_key='+sportRadarKey,
    },
    (err,resp, body) => {
      const rounds = JSON.parse(body).rounds;

      const round1 = rounds[1].bracketed,
            round2 = rounds[2].bracketed,
            round16 = rounds[3].bracketed,
            round8 = rounds[4].bracketed,
            round4 = [rounds[5]],
            roundFinal = [rounds[6]];

      module.exports.findWins(round1, 'playInWin');
      module.exports.findWins(round2, 'round1Win');
      module.exports.findWins(round16, 'round2Win');
      module.exports.findWins(round8, 'round16Win');
      module.exports.findWins(round4, 'round8Win');
      module.exports.findWins(roundFinal, 'round4Win');


      res.status(200).send(rounds)
    });
  }
}