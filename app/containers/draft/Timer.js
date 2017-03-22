

import React, { Component, PropTypes } from 'react';


class Timer extends Component{

  constructor(props){
    super(props);
    this.state = {time: 60};
  }

  // componentDidMount() {
  //   socket.on('timer', (seconds)=>{
  //     this.startTimer()
  //   });
  // }

  //  componentWillUnmount () {
  //     socket.removeAllListeners('timer');
  //   }

  startTimer () {
    let self = this;
    let seconds = 60;
    if (this.timer){
      clearInterval(this.timer)
    }
    if (this.props.round < 11 ) {
      this.timer = setInterval(()=>{
      console.log('seconds  d', seconds)
      self.setState({time: seconds});
        seconds--;
        if (seconds < 1) {
          clearInterval(self.timer);
        }
      }, 1000);
    }
  }

  render () {

    const { activeTeamName, round} = this.props;
    const { time }= this.state;

    var activeString = activeTeamName ? activeTeamName+' is drafting.' : "Draft has not begun yet.";
    return (
      <div className = "round-info" >
        <p className = "round-number" >Round {round}</p>
        <p className = "round-active" >{activeString}</p>
        <p className = "round-time-left">Time Left: {time} seconds</p>
      </div>
    )
  }
}

export default Timer;