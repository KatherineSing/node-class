/*
 * Katie Sing's lecture notes and labs
 * There is a lot of commenting out because I want to save
 * all my previous code and notes taken in class, all in one file.
 *
 * It is very messy to someone else reading this - but it is for
 * personal reference for my learning. Sorry about that!
 *
 */



// function timeout(ms) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(ms);
//     }, ms);
//   })
// }

// timeout(1000)
//   .then((milliseconds) => {
//     console.log(`waited ${milliseconds} ms`);
//   }, (milliseconds) => {
//     console.log(`rejected: ${milliseconds}`);
//   });
//   //.then resolve, reject
////******************************

// let express = require('express');
// let app = express();

// app.get('/api/genres', function(requst, response) {
//   response.json([1, 2, 3]);
// });

// app.listen(8000);
// //nodemon app.js then go to localhost:8000/api/genres
////******************************
let express = require('express');
let knex = require('knex'); //lecture 1 only
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
//lecture 2 only

// const Sequelize = require('sequelize'); 

//our db configuration; moved to sequalize.js
// const sequelize = new Sequelize('sqlite:chinook.db'); //lect 2

const Playlist = require('./models/playlist');
const Artist = require('./models/artist');
const Album = require('./models/album');
const Track = require('./models/track');

const { Op } = Sequelize;
const app = express();

app.use(bodyParser.json());

Artist.hasMany(Album, {
  foreignKey: 'ArtistId'
});

Album.belongsTo(Artist, {
  foreignKey: 'ArtistId'
});

Playlist.belongsToMany(Track, {
  through: 'playlist_track',
  foreignKey: 'PlaylistId',
  timestamps: false
});

Track.belongsToMany(Playlist, {
  through: 'playlist_track',
  foreignKey: 'TrackId',
  timestamps: false
})



//lect 1 this is an "endpoint"
app.get('/api/genres', function(requst, response) {
  let connection = knex({
    client:'sqlite3',
    connection: {
      filename: 'chinook.db'
    }
  });

  connection.select().from('genres').then((genres) => {
    response.json(genres); //same genres as the param passed into .then
  });
  //this connection bts returns results from the db
});

//lect 1: this is an "endpoint"
//:id is a wildcard param
app.get('/api/genres/:id', function(request, response) {
  let id = request.params.id; //has access to the params in the url
  console.log(id);
  let connection = knex({
    client:'sqlite3',
    connection: {
      filename: 'chinook.db'
    }
  });

//   connection.select().from('genres').then((genres) => {
//     response.json(genres); //same genres as the param passed into .then
//   });
//   //this connection bts returns results from the db
// });

  connection
  .select()
  .from('genres')
  .where('GenreId', id) //where genreid = id
  .first() //get the first object
  .then((genre) => {
    if(genre){
      response.json(genre); //same genres as the param passed into .then
    }
    else {
      response.status(404).json({
        error:`Genre of id ${id} not found`
      })
    }
  });
  //this connection bts returns results from the db
});


//this is another endpoint, for lab 3, related to lect 1
//lab 3: Building API Endpoints with Express / Express and Knex
app.get('/api/artists', function(request, response) {
  console.log(request.query.filter);
  let filter = request.query.filter;

  let connection = knex({
    client: 'sqlite3',
    connection: {
      filename: 'chinook.db'
    }
  });

  if (filter) {
    console.log("here");
    connection.select()
    .from('artists')
    .where('Name', 'like', `%${filter}%`)
    .then((artist) => {
      if(artist) {
        response.json(artist);
      }

      else {
        response.status(404).json({
          error: 'Artist with name containing ${filter} not found'
        });
      };

    });
  }

  else {
    connection.select().from('artists').then((artists) =>{
      var formatted = artists.map(artist => {
        var rObj = {};
        rObj["id"] = artist.ArtistId;
        rObj["name"] = artist.Name;
        return rObj;
      });
      response.json(formatted);
    });
  }

});

////The following model was moved to models/playlist.js
// //lect 2: creating a model
// const Playlist = sequelize.define('playlist', {
//   id: { //the name you want to use
//     field: 'PlaylistId', //original name as in the table of the db
//     type: Sequelize.INTEGER, //what type it is in the db
//     primaryKey: true
//   },
//   name: { //the name you want to use. Prof said he didn't want a capital letter
//     field: 'Name', //changed from the original Name, which was capital
//     type: Sequelize.STRING,
//   }
// }, {
//     timestamps:false 
//     //because our db didn't have timestamps, we should put it to false so we don't modify the db
// });

// //lecture 2: new endpoint
// app.get('/api/playlists', function(request, response) {
//   //call the model we created earlier
//   Playlist.findAll().then((playlists) => { 
//     response.json(playlists); 
//     //lowercase playlists is what was just passed in as a param one line above
//   });
// });

// //endpoint to return a single playlist resource
// app.get('/api/playlists/:id', function(request, response) {
//   let id = request.params.id;
//   //findByPk 
//   Playlist.findByPk(id).then((playlist) => { 
//     response.json(playlist); 

//     // if (playlist) {
//     //   response.json(playlist); 
//     // } else {
//     //   response.status(404).send();
//     // }
//     //lowercase playlists is what was just passed in as a param one line above
//   });
// });

// app.patch('/api/tracks/:id', function (request, response) {
//   let { id } = request.params;
//   let updates = request.body;

//   Track.findByPk(id, {
//     include: [Playlist]
//     }).then((track) => {
//       console.log(track);
//       if (track) {
//         return track.update(updates);
//       } else {
//         return Promise.reject();
//       }
//     }).then((updatedTrack) => {
//       // If the update passes validation, respond with a 200 status code and 
//       // the updated track in the response body
//       response.json(updatedTrack);
//       response.status(200).send();
//     }, (validation) => {
//       // If the track isn’t found, return an empty response with a 404 status code.
//       response.status(404).json({
//         errors: validation.errors.map((error) => {
//           return {
//             attribute: error.path,
//             message: error.message
//           };
//         })
//       });
//     });
// });


//lab 5: Sequelize ORM /  Build an API Endpoint with Express and Sequelize
app.patch('/api/tracks/:id', function (request, response) {
  let { id } = request.params;
  let updates = request.body;

  Track.findByPk(id, {
    include: [Playlist]
    }).then((track) => {
      console.log(track);
      if (track) {
        return track.update(updates);
      } else {
        return Promise.reject();
      }
    }).then((updatedTrack) => {
      response.json(updatedTrack);
      response.status(200).send();
    }, (validation) => {
      response.status(404).json({
        errors: validation.errors.map((error) => {
          return {
            attribute: error.path,
            message: error.message
          };
        })
      });
    });
});

app.delete('/api/playlists/:id', function(request, response) {
  let { id } = request.params;

  Playlist
    .findByPk(id)
    .then( (playlist) => {
      if (playlist) {
        return playlist.setTracks([]).then( () => {
          return playlist.destroy();
        });
      } else {
        return Promise.reject();
        
      }
    }).then( () => {
      response.status(200).send();
    }, () => {
      response.status(404).send();
    });
});

app.post('/api/artists', function(request, response) {
  Artist.create({
    name: request.body.name
  }).then( (artist) => {
    response.json(artist);
  }, (validation) => {
    response.status(422).json({
      errors: validation.errors.map((error) => {
        return {
          attribute: error.path,
          message: error.message
        };
      })
    });
  });
});

app.get('/api/playlists', function(request, response) {
  let filter = {};
  let { q } = request.query;

  if (q) {
    filter = {
      where: {
        name: {
          // pass in a symbol in [] to create a unique key
          [Op.like]: `${q}%`
        }
      }
    };
  }


  Playlist.findAll().then( (playlists) => {
    response.json(playlists);
  }) 
});

app.get('/api/playlists/:id', function(request, response) {
  let { id } = request.params;

  Playlist.findByPk(id, {
    include: [Track]
  }).then( (playlist) => {
    if (playlist) {
      response.json(playlist);
    } else {
      response.status(404).send();
    }
    
  }); 
});

app.get('/api/tracks/:id', function(request, response) {
  let { id } = request.params;

  Track.findByPk(id, {
    include: [Playlist]
  }).then( (track) => {
    if (track) {
      response.json(track);
    } else {
      response.status(404).send();
    }
    
  }); 
});

app.get('/api/artists/:id', function(request, response) {
  let { id } = request.params;

  Artist.findByPk(id, {
    include: [Album]
  }).then( (artist) => {
    if (artist) {
      response.json(artist);
    } else {
      response.status(404).send();
    }
  }); 
});

app.get('/api/albums/:id', function(request, response) {
  let { id } = request.params;

  Album.findByPk(id, {
    include: [Artist]
  }).then( (album) => {
    if (album) {
      response.json(album);
    } else {
      response.status(404).send();
    }
    
  }); 
});


app.listen(process.env.PORT || 8000); //left is for the app to work heroku, right is local
//nodemon app.js then go to localhost:8000/api/genres





////***********************************
// //David Tang's class demo code
// let express = require('express');
// let knex = require('knex');

// let app = express();

// app.get('/api/genres', function(request, response) {
//   let connection = knex({
//     client: 'sqlite3',
//     connection: {
//       filename: 'chinook.db'
//     }
//   });

//   connection.select().from('genres').then((genres) => {
//     response.json(genres);
//   });
// });

// app.get('/api/genres/:id', function(request, response) {
//   let id = request.params.id;

//   let connection = knex({
//     client: 'sqlite3',
//     connection: {
//       filename: 'chinook.db'
//     }
//   });

//   connection
//     .select()
//     .from('genres')
//     .where('GenreId', id)
//     .first()
//     .then((genre) => {
//       if (genre) {
//         response.json(genre);
//       } else {
//         response.status(404).json({
//           error: `Genre ${id} not found`
//         });
//       }
//     });
// });


// app.listen(process.env.PORT || 8000);
