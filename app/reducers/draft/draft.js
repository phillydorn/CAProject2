import Immutable from 'immutable';
import * as ActionType from '../../actions/draft/draft';

const defaultState = Immutable.fromJS({
    draftOrder: [[{team_name: ''}]], 
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
      return state.merge(Immutable.fromJS({draftOrder, leagueName, teams, userTeam, username}));
    case ActionType.LOADED_TEAMPOOL:
      return state.merge(Immutable.fromJS({schoolsList}));
    case 'returning':
      console.log('we made it', action.data);
 
    default:
      return state;
  }
}

export default draftReducer;
