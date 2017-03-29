import  React, {Component, PropTypes } from 'react';

class DraftOrder extends Component {

  displayDrafters () {
    let { round, position, order } = this.props;
    if (order.length) {
      let currentPosition = order[round][position];
      let currentDrafter = {currentlyDrafting : true, team_name: currentPosition.team_name} ;
      let prev = this.getPreviousDrafters(order, round, position).map((drafter)=>{
        return drafter ? {team_name: drafter.team_name, currentlyDrafting: false} : null;
      });
      let next = this.getNextDrafters(order, round, position).map((drafter)=>{

        return drafter ? {team_name: drafter.team_name, currentlyDrafting: false} : null ;
      });
      // console.log('drafters', prev.concat(currentDrafter).concat(next))
      return prev.concat(currentDrafter).concat(next);
    } else {
      return [];
    }
  }

  getPreviousDrafters(order, round, position) {
    if (position > 1) {
      return order[round].slice(position-2, position);
    } else if (round > 0) {
      if (position == 1) {
        return [order[round-1][5], order[round][0]];
      } else {
        return order[round-1].slice(4);
      }
    } else {
      return order[0].slice(0,position);
    }
  }

  getNextDrafters(order, round, position) {
    if (position < 3) {
      return order[round].slice(position+1, position+4);
    } else if (round < 9) {
      let draftersLeftThisRound = 5 - position;
      let draftersFromNextRound = 3 - draftersLeftThisRound;
      return order[round].slice(position+1).concat(order[round+1].slice(0, draftersFromNextRound));
    } else {
      return order[9].slice(position+1);
    }
  }


  render() {
    const draftTeams = this.displayDrafters().map((drafter)=>{
      let teamName;
      if (drafter) {
        teamName = drafter.team_name;
      } else {
        teamName = "No Player";
      }

      let isDrafting = drafter && drafter.currentlyDrafting ? 'is-drafting' : '';

      return (<li className = "draftPosition">
              <div className = "drafter-avatar"></div>
              <p className = {"drafter-name " + isDrafting} >{teamName}</p>
              </li>)
    });

    return (
      <ul className = "draftOrder">
        {draftTeams}
      </ul>
      )
  }

}


export default DraftOrder;