import fetch from '../../utils/api';

export const POPULATED = Symbol('POPULATED');
export const LOADED_TEAMPOOL = Symbol('LOADED_TEAMPOOL');


const populated = ({draftOrder, leagueName, teams, userTeam, username}) => {
  return {
    type: POPULATED,
    draftOrder, 
    leagueName, 
    teams, 
    userTeam, 
    username,
  };
};

const loadedTeams = ({defaultSchoolsList, customSchoolsList}) => {
  return {
    type: LOADED_TEAMPOOL,
    defaultSchoolsList, 
    customSchoolsList,
  }
};

const sortTeamsByDefaultRanking = ({schoolsList}) => {
  return schoolsList.sort((a,b) => {
    return a.RPI_Ranking - b.RPI_Ranking;
  });
}

const sortTeamsByCustomRanking = ({schoolsList}) => {
  return schoolsList.sort((a,b) => {
    return a.playerRanking - b.playerRanking;
  });
}


export function populate({id, socket}) {
  return (dispatch, getState) => {
    dispatch({type: 'server/test', data: 'this is working'})
      return fetch(getState().log)(`/api/leagues/${id}`)
        .then((response) => {
          const {
            draftOrder,
            leagueName,
            teams,
            userTeam,
            username,
          } = response;
          dispatch(loadTeams({teamId: userTeam.id}))
          return dispatch(populated({draftOrder, leagueName, teams, userTeam, username}));
         
        });
    }
  };

export function loadTeams({teamId}) {
  return (dispatch, getState) => {
    return fetch(getState().log)(`/api/teams/pool/${teamId}`)
      .then((response) => {
        const { schoolsList } = response;
        const defaultSchoolsList = sortTeamsByDefaultRanking({schoolsList})
        const customSchoolsList = sortTeamsByCustomRanking({schoolsList})
        return dispatch(loadedTeams({defaultSchoolsList, customSchoolsList}));
      })
  }
}


  // onSelectTeamCompleted: function(leagueId, schoolId, teamId, schoolName) {
  //   console.log('complete')
  //   socket.emit('update', {leagueId, teamId, schoolName});
  // },

  // onStartDraft: function(leagueId) {
  //   socket.emit('startDraft', leagueId)
  // }
