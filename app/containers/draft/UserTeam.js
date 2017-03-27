import React, { Component, PropTypes } from 'react';
import UserSchool from './UserSchool';
// import UserTeamActions from '../actions/UserTeamActions');
// import userTeamStore  from '../stores/userTeamStore');

class UserTeam extends Component {

 //    mixins: [Reflux.connect(userTeamStore, "userSchoolList")],


 constructor (props) {
    super(props);
    this.state = {userSchoolList: []};
  }

 //  componentWillReceiveProps: function (){
 //    setTimeout(()=> {
 //      UserTeamActions.loadSchools(this.props.teamId);
 //    }, 500)
 //  },

 //  shouldComponentUpdate(nextProps, nextState) {
 //    return nextProps.teamId !== this.props.teamId || nextState.userSchoolList.length !== this.state.userSchoolList.length;
 //  },

  render () {
    console.log('render user', this.props, 'state', this.state)
    var schoolNodes = this.state.userSchoolList.sort((a,b)=>{
      return a.Team_NCAA.round - b.Team_NCAA.round;
    }).map(function (school, order) {
      const { market, id} = school;
      return (
          <UserSchool order={order+1} schoolName = {market} schoolId={id} key={id} />
        )
    });
    return (
      <div className = "team-box-container userTeam">
      <h1>Your Team</h1>
        <ul className="team-list">
         {schoolNodes}
        </ul>
      </div>
    )
  }
};


export default UserTeam;

