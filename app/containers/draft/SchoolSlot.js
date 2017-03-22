import React, {Component, PropTypes} from 'react';
import TopTarget from './TopTarget';
import BottomTarget from './BottomTarget';





class SchoolSlot extends React.Component {

  constructor(props) {
    super(props);
    this.state = {hovering: false}

  }

  handleMouseOver(e) {
    this.setState ({hovering: true});
  }

  handleMouseOut(e) {
    this.setState ({hovering: false});
  }

  render () {

    let background = this.props.rank % 2 === 0 ? '#a081a5' : 'inherit';
    let hoverBackground = this.state.hovering ? '#e7ceeb' : background;
    return (
      <div
      className="schoolSlot"
      style = {{position: 'relative', height: '20px', 'backgroundColor': hoverBackground}}
      onMouseOver = {this.handleMouseOver.bind(this)}
      onMouseOut = {this.handleMouseOut.bind(this)}>
        <TopTarget { ...this.props} />
        <BottomTarget { ...this.props} />
      </div>
    )
  }

}


export default SchoolSlot;