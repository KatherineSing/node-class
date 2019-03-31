//lect 2: creating a model

//this pulls from sequelize.js 
const sequelize = require('./../database/sequelize');
const Sequelize = require('sequelize'); 

// from app.js: const Playlist = sequelize.define('playlist', {
module.exports = sequelize.define('playlist', {

  id: { //the name you want to use
    field: 'PlaylistId', //original name as in the table of the db
    type: Sequelize.INTEGER, //what type it is in the db
    primaryKey: true
  },
  name: { //the name you want to use. Prof said he didn't want a capital letter
    field: 'Name', //changed from the original Name, which was capital
    type: Sequelize.STRING,
  }
}, {
    timestamps:false 
    //because our db didn't have timestamps, we should put it to false so we don't modify the db
});