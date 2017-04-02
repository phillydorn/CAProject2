import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../utils/constants';
import { rerank } from '../../actions/draft/teamPool';
// import SchoolActions from '../actions/SchoolActions';

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
      const {rank, dropComponent, position} = monitor.getDropResult();
      const newRank = rank;
      const {teamId, schoolId, customSchoolsList} = props;
      const currentRank = props.rank;
      console.log('diddrop',monitor.getDropResult())
      console.log('drag', dragComponent)
      dragComponent.props.rerank({currentRank, newRank, customSchoolsList, teamId, schoolId})

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


export default connect(null, { rerank })(DragSource(ItemTypes.SCHOOL, schoolSource, collect)(School));
