
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
//******************************

// let express = require('express');
// let app = express();

// app.get('/api/genres', function(requst, response) {
//   response.json([1, 2, 3]);
// });

// app.listen(8000);
// //nodemon app.js then go to localhost:8000/api/genres
//******************************
let express = require('express');
let knex = require('knex');

let app = express();

//this is an "endpoint"
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

//this is an "endpoint"
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

app.listen(process.env.PORT || 8000); //left is for the app to work heroku, right is local
//nodemon app.js then go to localhost:8000/api/genres


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
