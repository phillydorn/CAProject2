import React, {Component, PropTypes } from 'react';
// import UserSchool from './userSchool.jsx.js';
// import otherTeamStore from '../stores/otherTeamStore';
// import OtherTeamActions from '../actions/OtherTeamActions';
import OtherTeam from './OtherTeam';
// import UserTeam from './userTeam.jsx.js';

class OtherTeams extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teamId: '', 
      teamName: '', 
      team: {},
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.otherTeams.length !== this.props.otherTeams.length ||
  //          nextState.otherTeamId !== this.state.otherTeamId;

  // },

  handleSelect (e) {
    var teamName;
    const { value } = e.target;
    this.props.otherTeams.forEach ((team) => {
      if (team.id == value) {
        teamName = team.team_name;
      }
    });
    this.setState({
      teamId: value,
      teamName,
    });
  }


  render () {

    const { teamId, teamName } = this.state;
    // console.log('render other Teams', this.props, 'state', this.state)
    const otherTeams = this.props.otherTeams.map(function(team) {
      return (
        <option key={team.id} value={team.id}>{team.team_name}</option>
      )
    })
    return (
      <div className = "team-box-container otherTeam">
      <select onChange={this.handleSelect.bind(this)}>
        <option value="">Other Teams</option>
        {otherTeams}
      </select>
        <OtherTeam teamId ={teamId} teamName={teamName} />
      </div>
    )
  }
};


export default OtherTeams;
