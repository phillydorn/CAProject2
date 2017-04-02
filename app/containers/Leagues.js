import React, {Component, PropTypes} from 'react';
import {connect } from 'react-redux';
import { loadUserLeagues } from '../actions/leagues';
import AuthComponent from './Authenticated';
import Leagues from '../components/Leagues';



 class LeaguesContainer extends Component {


    componentDidMount(){
      this.props.loadUserLeagues();
    }



    render() {
      const { leaguesList } = this.props;

     
      return (
          <Leagues leaguesList={leaguesList} />
        );
    }
  };

function mapStateToProps(state) {
  const { leaguesList } = state.leagues.toJS();
  return { leaguesList };
}

LeaguesContainer.propTypes = {
  leaguesList: PropTypes.array,
};


export { LeaguesContainer };
export default AuthComponent(connect(mapStateToProps, { loadUserLeagues })(LeaguesContainer));


