import fetch from '../../utils/api';

export const CREATED_TEAMS = Symbol('CREATED_TEAMS');


const createdTeams = ({leagueId}) => {
  return {
    type: 'server/leaguePage',
    data: {
      leagueId,
    },
  };
};


export function createTeams({leagueId}) {
  return (dispatch, getState) => {
    return fetch(getState().log)('/api/mocks/teams/', {
      method: 'POST',
      body: JSON.stringify({leagueId})
    })
      .then((response) => {
        // dispatch leaguepage
        return dispatch(createdTeams({leagueId}));
       
      });
  };
}
