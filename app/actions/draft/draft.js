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

const loadedTeams = ({schoolsList}) => {
  return {
    type: LOADED_TEAMPOOL,
    schoolsList,
  }
};


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
        return dispatch(loadedTeams({schoolsList}));
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
