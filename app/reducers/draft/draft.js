import Immutable from 'immutable';
import * as ActionType from '../../actions/draft/draft';
import * as TeamPoolActionType from '../../actions/draft/teamPool';

const defaultState = Immutable.fromJS({
    draftOrder: [[{team_name: ''}]], 
    leagueName: '', 
    defaultSchoolsList: [], 
    customSchoolsList: [], 
    teams: [], 
    userTeam: {}, 
    username: '',
});


function draftReducer(state = defaultState, action) {
  const {
    draftOrder, 
    leagueName, 
    defaultSchoolsList, 
    customSchoolsList, 
    teams, 
    userTeam, 
    username,
  } = action;

  switch (action.type) {

    case ActionType.POPULATED:
      return state.merge(Immutable.fromJS({draftOrder, leagueName, teams, userTeam, username}));
    case ActionType.LOADED_TEAMPOOL:
      return state.merge(Immutable.fromJS({defaultSchoolsList, customSchoolsList}));
    case TeamPoolActionType.RERANKED:
    console.log('schol', customSchoolsList[0])
      return state.merge(Immutable.fromJS({customSchoolsList}));

    case 'returning':
      console.log('we made it', action.data);
 
    default:
      return state;
  }
}

export default draftReducer;
