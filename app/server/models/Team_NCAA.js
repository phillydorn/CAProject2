"use strict";



module.exports = function(sequelize, DataTypes) {
  var Team_NCAA = sequelize.define('Team_NCAA', {
    playerRanking: DataTypes.INTEGER,
    draftedByMe: {type: DataTypes.BOOLEAN, defaultValue: false},
    draftedByOther: {type: DataTypes.BOOLEAN, defaultValue: false},
    round: {type: DataTypes.INTEGER, defaultValue: 0}
  });


  return Team_NCAA;
}

