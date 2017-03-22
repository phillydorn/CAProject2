"use strict";



module.exports = function(sequelize, DataTypes) {
  var NCAA_Team = sequelize.define('NCAA_Team', {
    NCAA_Team_name: DataTypes.STRING,
    wins: {type: DataTypes.INTEGER, defaultValue: 0},
    market: DataTypes.STRING,
    sportRadarID: DataTypes.STRING,
    bracket: DataTypes.STRING,
    seed: DataTypes.INTEGER,
    RPI_Ranking: DataTypes.INTEGER,
    isPlayIn: { type: DataTypes.BOOLEAN, defaultValue: false},
    playInWin: { type: DataTypes.BOOLEAN, defaultValue: false},
    round1Win: { type: DataTypes.BOOLEAN, defaultValue: false},
    round2Win: { type: DataTypes.BOOLEAN, defaultValue: false},
    round16Win: { type: DataTypes.BOOLEAN, defaultValue: false},
    round8Win: { type: DataTypes.BOOLEAN, defaultValue: false},
    round4Win: { type: DataTypes.BOOLEAN, defaultValue: false},
    roundFinalWin: { type: DataTypes.BOOLEAN, defaultValue: false},


  }, {
    classMethods: {
      associate: function(models) {
        NCAA_Team.belongsToMany(models.Team, {through: 'Team_NCAA'});
        NCAA_Team.belongsToMany(models.League, {through: 'Undrafted_teams'});
      }
    }
  });


  return NCAA_Team;
}

