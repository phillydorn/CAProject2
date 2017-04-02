import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import SchoolSlot  from './SchoolSlot';
import { loadTeams } from '../../actions/draft/draft';



class TeamPoolContainer extends Component {


  constructor(props) {
    super(props);
    this.state = {ranking: 'default'};
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.teamId !== this.props.teamId ||
  //          nextProps.schoolsList.length !== this.props.schoolsList.length ||
  //          nextProps.yourTurn !== this.props.yourTurn ||
  //          nextState.ranking !== this.state.ranking ||
  //          !this.checkSchoolsList(nextProps);
  // }

  // checkSchoolsList (nextProps) {
  //   // console.log('this', this.props.schoolsList, 'next', nextProps.schoolsList)
  //     let len = this.props.schoolsList.length;
  //     for (let i = 0; i<len; i++) {
  //       if (this.props.schoolsList[i].id !== nextProps.schoolsList[i].id) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   }

  toggleDefault(e) {
    e.preventDefault();
    this.setState({ranking: 'default'})
  }

  toggleCustom (e) {
    e.preventDefault();
    this.setState({ranking: 'custom'})
  }

  render() {
    // console.log('render teampool', this.props, 'state', this.state)
    const { ranking } = this.state;
    const { customSchoolsList, defaultSchoolsList } = this.props;

    let isDefault = ranking === 'default' ? 'ranking-on' : '';
    let isCustom = ranking === 'custom' ? 'ranking-on' : '';

    let schoolsList = ranking === 'default' ? defaultSchoolsList : customSchoolsList;

    let schoolNodes = schoolsList.map((school, rank) => {
        return (
            <SchoolSlot { ...this.props} schoolName = {school.market} schoolId= {school.id} rank={rank+1} rankingType={this.state.ranking} key={school.id} >
            </SchoolSlot>
          )
      });
    return (
      <div className="team-box-container">
        <div className="ranking-switch">
          <p>Ranking</p>
          <button className={"ranking-button ranking-default " + isDefault } onClick={this.toggleDefault.bind(this)} >Default </button>
          <button className= {"ranking-button ranking-custom " + isCustom } onClick={this.toggleCustom.bind(this)} >Custom</button>
        </div>
        <div className = "team-box team-pool">
          <ul className="team-list">
           {schoolNodes}
          </ul>
        </div>
      </div>
    )
  }
};

function mapStateToProps(state) {
  const {  } = state.auth.toJS();
  return {  };
}

TeamPoolContainer.propTypes = {
};


export { TeamPoolContainer};

export default connect(mapStateToProps, { loadTeams })(TeamPoolContainer);
