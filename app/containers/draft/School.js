import React, {Component, PropTypes} from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../utils/constants';
// import SchoolActions from '../actions/SchoolActions';
// import UserTeamActions from '../actions/UserTeamActions';
// import schoolStore from '../stores/schoolStore';
// import TeamPoolActions from '../actions/TeamPoolActions';

const schoolSource = {

  canDrag(props) {
    return props.rankingType == 'custom';
  },

  beginDrag(props) {
    console.log('begin', props)
    return {};
  },
  endDrag(props, monitor, dragComponent) {
    if (monitor.didDrop()){
      let {rank, dropComponent, position} = monitor.getDropResult();
      let {teamId, schoolId, schoolsList} = props;
      let currentRank = props.rank;
      console.log('diddrop',monitor.getDropResult())
      console.log('drag', dragComponent)
      // TeamPoolActions.rerank(dragComponent, dropComponent, currentRank, rank, position, schoolsList);
      // SchoolActions.rerank(schoolId, currentRank, rank, teamId);

    }
  }
}

let collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class School extends Component {

  handleSelect(e) {
    e.preventDefault();
    if (this.props.yourTurn) {
      let { schoolId, leagueId, teamId, schoolName } = this.props;
      // SchoolActions.selectTeam(schoolId, leagueId, teamId, schoolName);
    } else {
      alert ('It is not your turn.')
    }
  }

  render() {

    let connectDragSource = this.props.connectDragSource;
    let isDragging = this.props.isDragging;

    return connectDragSource(
        <li className ="school" style={{
        cursor: 'move'
      }}
      onClick = {this.handleSelect.bind(this)} className = {"school " + this.props.schoolName}>
          <a href="#">{this.props.rank}.  {this.props.schoolName}</a>
        </li>
      )
  }
};

School.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };


export default DragSource(ItemTypes.SCHOOL, schoolSource, collect)(School);
