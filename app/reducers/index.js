import { combineReducers } from 'redux';

import auth from './auth/auth';
import log from './log';
import leagues from './leagues';
import draft from './draft/draft';
import mockTeams from './draft/mockTeams';


const rootReducer = combineReducers({
  auth,
  log,
  leagues,
  draft,
  mockTeams,
});


export default rootReducer;
