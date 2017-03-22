import fetch from '../../utils/api';

export const CREATED_TEAMS = Symbol('CREATED_TEAMS');


const createdTeams = () => {
  return {
    type: CREATED_TEAMS,
  };
};


export function createTeams({leagueId}) {
  return (dispatch, getState) => {
    return fetch(getState().log)('/api/mocks/teams/', {
      method: 'POST',
      body: {leagueId}
    })
      .then((response) => {
        console.log('response', response)
        return dispatch(createdTeams());
       
      });
  };
}
