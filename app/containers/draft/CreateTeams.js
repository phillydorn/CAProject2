import React  from 'react';
import { connect } from 'react-redux';
import { createTeams } from '../../actions/draft/createTeams';


class CreateTeams extends React.Component {

  // componentDidMount() {
  //   this.props.listenTo(mockStore, this.updatePage.bind(this));
  // }

  // updatePage () {
  //   socket.emit('leaguePage', this.props.leagueId);
  // }


  clickHandler(e) {
    this.props.createTeams(this.props.leagueId);
  }


  render () {
    return (
        <button onClick = {this.clickHandler.bind(this)} >Create Teams</button>
      )
  }

}

function mapStateToProps(state) {
  // const {  } = state.leagues.toJS();
  return {  };
}

CreateTeams.propTypes = {
};


export { CreateTeams };
export default connect(mapStateToProps, { createTeams })(CreateTeams);


