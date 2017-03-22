"use strict";

if (!process.env.CLIENT_ID) {
  var keys = require('../keys.js');
  var dbUser = keys.pg_username;
  var dbPassword = keys.pg_password;
  var dbAddress = keys.pg_address;
  var dbHost = keys.pg_hostName;
  var dbName = keys.pg_name;
  var dbPort = keys.pg_port;
  } else {
  var dbUser = process.env.PG_USERNAME;
  var dbPassword = process.env.PG_PASSWORD;
  var dbAddress = process.env.PG_ADDRESS;
  var dbHost = process.env.PG_HOSTNAME;
  var dbName = process.env.PG_NAME;
  var dbPort = process.env.PG_PORT;
  }

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
  port: dbPort,
  native: true,
  logging: false,
  pool: {
    max: 5,
    min: 1,
    idle: 5
  }
});
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
sequelize.sync();
module.exports = db;
