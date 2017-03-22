import Immutable from 'immutable';
import * as ActionType from '../actions/draft/draft';

const defaultState = Immutable.fromJS({
    draftOrder: [[]], 
    leagueName: '', 
    schoolsList: [], 
    teams: [], 
    userTeam: {}, 
    username: '',
});


function draftReducer(state = defaultState, action) {
  const {
    draftOrder, 
    leagueName, 
    schoolsList, 
    teams, 
    userTeam, 
    username,
  } = action;

  switch (action.type) {

    case ActionType.POPULATED:
      return state.merge(Immutable.fromJS({draftOrder, leagueName, schoolsList, teams, userTeam, username}));

 
    default:
      return state;
  }
}

export default draftReducer;
