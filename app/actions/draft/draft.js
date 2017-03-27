import fetch from '../../utils/api';

export const POPULATED = Symbol('POPULATED');


const populated = ({draftOrder, leagueName, schoolsList, teams, userTeam, username}) => {
  return {
    type: POPULATED,
    draftOrder, 
    leagueName, 
    schoolsList, 
    teams, 
    userTeam, 
    username,
  };
};


export function populate({id, socket, order}) {
  return (dispatch, getState) => {
    dispatch({type: 'server/test', data: 'this is working'})
    if (id) {
      order = order || 'default';
      let url;
      if (order === 'default') {
        url = '/api/leagues/'+id;
      } else if (order == 'custom') {
        url = '/api/teams/pool/' + id
      }
      return fetch(getState().log)(url)
        .then((response) => {
          const {
            draftOrder,
            leagueName,
            schoolsList,
            teams,
            userTeam,
            username,
          } = response;
          return dispatch(populated({draftOrder, leagueName, schoolsList, teams, userTeam, username}));
         
        });
    }
  };
}

  // onSelectTeamCompleted: function(leagueId, schoolId, teamId, schoolName) {
  //   console.log('complete')
  //   socket.emit('update', {leagueId, teamId, schoolName});
  // },

  // onStartDraft: function(leagueId) {
  //   socket.emit('startDraft', leagueId)
  // }
