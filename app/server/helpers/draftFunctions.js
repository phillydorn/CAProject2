"use strict";
var models = require('../models');
var teams = require('./teamFunctions');

var drafts = {};

module.exports = {

  startTimer(io, leagueId, teamId) {
    let leagues = require('./leagueFunctions');
    let seconds = 60;
    io.to(leagueId).emit('timer', seconds)
    drafts[leagueId].timer = setInterval(()=>{
      seconds--;
      console.log('seconds', seconds)
      if (seconds < 1) {
        clearInterval(drafts[leagueId].timer);
        models.League.findById(leagueId).then((league)=>{
          models.Team.findById(teamId).then((team)=>{
            teams.getTopRankedTeam(team, league, (topTeam)=>{
              console.log('top ranked is', topTeam.market)
              leagues.draftTeam(league, team, topTeam.id, 0, null, io);
            });
          });
        });
      }
    }, 1000);
  },

  startDraft (io, leagueId, firstTeamId) {
    drafts[leagueId] = {
          timer:60,
          round: 0,
          position: 0,
          drafting: true
        }
    this.startTimer(io, leagueId, firstTeamId);
  },

  checkDraftInProgress(leagueId, socket) {
    var leagues = require('./leagueFunctions');
    if (drafts[leagueId] && drafts[leagueId].round<10) {
      let nextDraft = leagues.findNextDraftId(drafts[leagueId].round, drafts[leagueId].position);
      socket.emit('advance', {round: drafts[leagueId].round, position: drafts[leagueId].position, nextUpId:nextDraft.id, nextUpName: nextDraft.team_name});
    }
  },

  advance (leagueId, io) {
    console.log('advance')
    var leagues = require('./leagueFunctions');
    clearInterval(drafts[leagueId].timer);

    io.to(leagueId).emit('update', leagueId);

    if (drafts[leagueId].position<5) {
      drafts[leagueId].position++;
    } else {
      drafts[leagueId].position = 0;
      drafts[leagueId].round++;
    }
    if (drafts[leagueId].round < 10) {
      let nextDraft = leagues.findNextDraftId(drafts[leagueId].round, drafts[leagueId].position);
      console.log('next', nextDraft)

      models.League.findById(leagueId).then((league)=>{
        models.Team.findById(nextDraft.id).then((team)=>{
          if(team.autodraft === true) {
            io.to(leagueId).emit('advance', {round: drafts[leagueId].round, position: drafts[leagueId].position, nextUpId:nextDraft.id, nextUpName: nextDraft.team_name});

            teams.getTopRankedTeam(team, league, (topTeam)=>{
              console.log('top ranked is', topTeam.market, 'round is ', drafts[leagueId].round)
              leagues.draftTeam(league, team, topTeam.id, drafts[leagueId].round, null, io);
              let message = {username: 'DraftBot', content: team.team_name + ' has chosen ' + topTeam.market + '.'};
              io.to(leagueId).emit('newMessage', message);

            });

          } else {

            io.to(leagueId).emit('advance', {round: drafts[leagueId].round, position: drafts[leagueId].position, nextUpId:nextDraft.id, nextUpName: nextDraft.team_name});
            if (drafts[leagueId].round < 10) {
              this.startTimer(io, leagueId, nextDraft.id);
            }
          }
        });
      });
    } else {
      io.to(leagueId).emit('draftEnd', {});
    }
  },

  getRound(leagueId) {
    return drafts[leagueId].round;
  }

}