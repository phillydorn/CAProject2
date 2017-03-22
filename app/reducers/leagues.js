import Immutable from 'immutable';
import * as ActionType from '../actions/leagues';

const defaultState = Immutable.fromJS({
  leaguesList: [],
});


function leaguesReducer(state = defaultState, action) {
  const {
    leaguesList,
  } = action;

  switch (action.type) {

    case ActionType.LOADED_USER_LEAGUES:
      return state.merge(Immutable.fromJS({ leaguesList }));

 
    default:
      return state;
  }
}

export default leaguesReducer;
