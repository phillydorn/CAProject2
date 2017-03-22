import fetch from '../utils/api';

export const LOADED_USER_LEAGUES = Symbol('LOADED_USER_LEAGUES');


const loadedUserLeagues = ({ leaguesList }) => {
  return {
    type: LOADED_USER_LEAGUES,
    leaguesList,
  };
};


export function loadUserLeagues() {
  return (dispatch, getState) => {
    return fetch(getState().log)('api/leagues/user/')
      .then((response) => {
        console.log('response', response)
        const { leaguesList } = response;
        return dispatch(loadedUserLeagues({leaguesList}));
       
      });
  };
}

 export function loadAllLeagues() {
    $.ajax({
      url: 'api/leagues',
      dataType: 'json',
      method: 'GET',
      success: function(response) {
        var data = {
          leaguesList: response,
          joinedLeague: ''
        }
        console.log('dta', data)
        this.trigger(data);
      }.bind(this)
    });
  }
