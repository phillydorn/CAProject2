"use strict";

module.exports = function(sequelize, DataTypes) {
  var League = sequelize.define('League', {
    name: DataTypes.STRING,
    totalUsers: {type: DataTypes.INTEGER, defaultValue: 0}
  },{
    classMethods: {
      associate: function(models) {
        League.hasMany(models.Team);
        League.belongsToMany(models.User, {through: 'league_managers'});
        League.belongsToMany(models.NCAA_Team, {through: 'Undrafted_teams'});
      }
    }
  });

  return League;
}

