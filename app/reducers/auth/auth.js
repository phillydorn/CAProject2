import Immutable from 'immutable';
import * as ActionType from '../../actions/auth/auth';

const defaultState = Immutable.fromJS({
  loggedIn: false,
});


function authReducer(state = defaultState, action) {
  const {
    loggedIn,
  } = action;

  switch (action.type) {

    case ActionType.VERIFIED_LOGIN:
      return state.merge(Immutable.fromJS({ loggedIn }));

 
    default:
      return state;
  }
}

export default authReducer;
