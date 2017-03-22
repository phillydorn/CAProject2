"use strict";


module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define('Team', {
    team_name: DataTypes.STRING,
    wins: DataTypes.INTEGER,
    draftPosition: DataTypes.INTEGER,
    autodraft: {type: DataTypes.BOOLEAN, default: true}
  },

  {
    classMethods: {
      associate: function(models) {
        Team.belongsTo(models.League);
        Team.belongsTo(models.User);
        Team.belongsToMany(models.NCAA_Team, {through: 'Team_NCAA'});
      }
    }
  });
  return Team;

}


