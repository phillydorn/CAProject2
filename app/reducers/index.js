import { combineReducers } from 'redux';

import auth from './auth/auth';
import log from './log';
import leagues from './leagues';
import draft from './draft/draft';


const rootReducer = combineReducers({
  auth,
  log,
  leagues,
  draft,
});


export default rootReducer;
