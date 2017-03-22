import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from '../containers/App';
import Home from '../containers/pages/Home';
import PageNotFound from '../containers/utility/PageNotFound';
import DraftPage from '../containers/draft/DraftPage';
import Login from '../containers/auth/Login';
// import Signup from './components/Signup';
// import Bracket from './components/Bracket';
// import CreateLeague from './components/CreateLeague';
// import JoinLeagues from './components/JoinLeagues';
import Leagues from '../containers/Leagues';
// import Logout from './components/Logout';

export default function (history) {
  return (
    <Router history={history} >
      <Route path="/" component={App}>
        <Route path="404" component={PageNotFound} />
        <Route name ="Login" path="login" component={Login} />
        <Route name ="Leagues" path="leagues" component={Leagues} />
        <Route name ="League" path="league/:league" component={DraftPage} />
{/*}        <Route name ="Signup" path="signup" component={Signup} />
        <Route name ="CreateLeague" path="create" component={CreateLeague} />
        <Route name ="JoinLeagues" path="join" component={JoinLeagues} />
        <Route name ="Bracket" path="bracket/:league" component={Bracket} />
        <Route name ="Logout" path="logout" component={Logout} /> */}
        <IndexRoute component={Home} />
      </Route>
    </Router>
  );
}
