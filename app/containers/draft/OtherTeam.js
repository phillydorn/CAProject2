import React, { Component, PropTypes } from 'react';
import UserSchool from './UserSchool';
// import OtherTeamActions from '../actions/OtherTeamActions';
// import otherTeamStore  from '../stores/otherTeamStore';

class OtherTeam  extends Component {

    // mixins: [Reflux.connect(otherTeamStore, "otherSchoolList")],


 constructor (props) {
    super(props);
    let list = [];
    for (var i=0; i<10; i++) {
      list.push({Team_NCAA: {round: 0}});
    }
    this.state = {otherSchoolList: list};
  }

 //  componentWillReceiveProps  (){
 //    setTimeout(function() {
 //      OtherTeamActions.loadSchools(this.props.teamId || 0);
 //    }.bind(this), 500)
 //  },

  render () {
    const schoolNodes = this.state.otherSchoolList.sort((a,b)=>{
      return a.Team_NCAA.round - b.Team_NCAA.round;
    }).map(function (school, order) {
      return (
          <UserSchool order={order+1} schoolName = {school.market} schoolId={school.id} key={school.id} />
        )
    });
    return (
      <div className = "team-box otherTeam" key="otherTeamBox">
      <h1 key="teamName">{this.props.teamName}</h1>
        <ul className="team-list" key="team-list">
         {schoolNodes}
        </ul>
      </div>
    )
  }
};


export default OtherTeam;
