const Sequelize = require('sequelize'); 

//module system called common.js; use module.exports 
//in order to expose things from a file
module.exports = new Sequelize('sqlite:chinook.db')