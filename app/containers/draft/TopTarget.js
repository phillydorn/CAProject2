import React, {Component, PropTypes} from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes} from '../../utils/constants';
import School from './School';


const slotTarget = {

  canDrop(props) {
    return props.rankingType == 'custom';
  },

  drop (props, monitor, dropComponent) {
    console.log('dropComponent is ', dropComponent)
    return {rank: props.rank-1, dropComponent, position: 'top'}
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),

  };
}

class TopTarget extends Component {

  renderBorder() {
    return (
      <div style={{
        'borderTop': '3px solid black'
      }} />
    );
  }


  render () {
    const { connectDropTarget, isOver } = this.props;

    return connectDropTarget(
        <div className="topTarget">
        {isOver && this.renderBorder()}
          <School { ...this.props} />
        </div>
      )
  }
}

export default DropTarget(ItemTypes.SCHOOL, slotTarget, collect)(TopTarget);
