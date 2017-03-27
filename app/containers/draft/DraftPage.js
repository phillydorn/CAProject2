import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {Link } from 'react-router';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext }from 'react-dnd';
// import mainStore from '../stores/mainStore';
import { populate } from '../../actions/draft/draft';
import TeamPool from './TeamPool';
// import teamPoolStore from '../stores/teamPoolStore.js';
import Timer from './Timer';
import UserTeam from './UserTeam';
import CreateTeams from './CreateTeams';
import OtherTeams from './OtherTeams';
import DraftOrder from './DraftOrder';
import ChatWindow from './ChatWindow';
// import Bracket from './bracket.jsx.js';
import AuthComponent from '../Authenticated';




  class DraftPageContainer extends Component {

    constructor(props) {
      super(props);
      this.state = {
        round: 0,
        position: 0,
        leagueId: this.props.params.league,
        username: '',
        teamId: '',
        leagueName: '',
        schoolsList: [],
        yourTurn: false,
        activeTeam: '',
        drafting: false,
        draftOrder: []
      }
    }


    componentDidMount(){
      this.props.populate({id: this.props.params.league});
    //   this.listenTo(mainStore, this.populate);
    //   this.listenTo(teamPoolStore, this.rerank);
    //   socket.emit('leaguePage', {leagueId: this.state.leagueId});
    //   socket.on('update', (message) =>{
    //     console.log('updating', message)
    //     MainActions.populate(this.state.leagueId);
    //   });

    //   socket.on('advance', (data)=>{
    //     console.log('advance', data)
    //     let { round, position } = data;
    //     this.setState({
    //               drafting: true,
    //               round: round,
    //               position: position
    //             });
    //     if (data.round == 10) {
    //       this.setState({yourTurn: false});
    //     } else {
    //       if (this.state.teamId == data.nextUpId) {
    //         this.setState({yourTurn: true});
    //       } else {
    //         this.setState({yourTurn: false});
    //       }
    //       this.setState({activeTeamId: data.nextUpId, activeTeamName: data.nextUpName})
    //     }
    //   });

    //   socket.on('draftEnd', (data)=>{
    //     this.setState({
    //       drafting: false,
    //       yourTurn: false
    //     })
    //   });
    }


    // populate (data) {
    //   console.log('bakc', data)
    //   if (data.teams) {
    //     this.setState({
    //       otherTeams: data.teams,
    //       schoolsList: data.schoolsList,
    //       leagueName: data.leagueName,
    //       teamId: data.userTeam.id,
    //       username: data.username,
    //       draftOrder: data.draftOrder
    //     });
    //   } else {
    //     this.setState({schoolsList: data.schoolsList})
    //   }

    // }

    // rerank(data) {
    //   this.setState({schoolsList: data.schoolsList})
    // }

    // startDraft(e) {
    //   if (this.state.otherTeams.length === 6) {
    //     socket.emit('startDraft', this.state.leagueId);
    //     this.setState({drafting: true});
    //   } else {
    //     alert('You cannot begin a draft with less than 6 teams.');
    //   }
    // }

    // componentWillUnmount () {
    //   socket.removeAllListeners('advance');
    //   socket.removeAllListeners('update');
    //   socket.emit('leave', {leagueId: this.state.leagueId, teamId: this.state.teamId});
    // }

    render() {
      console.log('render main', this.props, 'state', this.state)
      const {
        schoolsList,
        teams,
      } = this.props;
      
      const { 
        drafting, 
        leagueName, 
        round, 
        activeTeamId, 
        activeTeamName, 
        leagueId, 
        draftOrder, 
        position, 
        yourTurn, 
        teamId, 
        username 
      } = this.state;

      let startButton = drafting ? '' : <button className="start" onClick={this.startDraft} >Start Draft</button>
      return (
          <div className="main">
            <h1>{leagueName}</h1>
            <Timer round={round+1} activeTeamId={activeTeamId} activeTeamName={activeTeamName} />
            {startButton}
            <CreateTeams leagueId = {leagueId} />
            <DraftOrder order = {draftOrder} round = {round} position = {position} />
            <a href={"/bracket/" + leagueId } className="bracketLink"></a>
            <TeamPool yourTurn={yourTurn} leagueId={leagueId} schoolsList={schoolsList} teamId={teamId} />
            <OtherTeams otherTeams={teams} />
            <UserTeam teamId={teamId} />
            <ChatWindow leagueId = {leagueId} username={username} />
          </div>
        );
    }
  };

function mapStateToProps(state) {
  const { loggedIn } = state.auth.toJS();
  const {draftOrder, leagueName, schoolsList, teams, userTeam, username} = state.draft.toJS();
  return { loggedIn, draftOrder, leagueName, schoolsList, teams, userTeam, username};
}

DraftPageContainer.propTypes = {
};


export { DraftPageContainer};

export default DragDropContext(HTML5Backend)(AuthComponent(connect(mapStateToProps, { populate })(DraftPageContainer)));
