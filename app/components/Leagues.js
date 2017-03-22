import React from 'react';    
import League from './League';


const Leagues = (props) => {
  const { leaguesList } = props;

  var leagueNodes = leaguesList.map(function (league) {
    return (
        <League league= {league} key = {league.id} />
      )
  });
  return (
      <div className = "league-page">
        <h1>Your Leagues</h1>
        <ul className = "league-list">
          {leagueNodes}
        </ul>
      </div>
    );
}

export default Leagues;