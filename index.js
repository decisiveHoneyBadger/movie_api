// logging middleware library for Express via Morgan to log all requests
const express = require('express'),
  app = express();
bodyParser = require('body-parser');
(uuid = require('uuid')), (morgan = require('morgan'));
mongoose = require('mongoose');
Models = require('./models.js');
Movies = Models.Movie;
Users = Models.User;

mongoose.connect("mongodb://127.0.0.1:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.json());

// server requests via log
app.use(morgan('common'));
app.use(bodyparser.json());

// integration of CORS
const cors = require('cors');
app.use(cors());

//static files (serving) 
app.use(express.static('public'));

// input of validation
const { check, validationResult } = require('express-validator');

// integrating auth.jhs file for authentication and authorization employing HHTP and JWSToken
let auth = require('./auth') (app);
const passport = require('passport');
require('./passport');

// CREATE Movie endpoint
app.post('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.findOne({ Title: req.body.Title })
    .then((movie) => {
      if (movie) {
        return res.status(400).send(req.body.Title + 'already exists');
      } else {
        Movies.create({
        Title: req.body.Title,
        Description: req.body.Description,
        Genre: req.body.Genre.Name,
        Director: req.body.Director.Name,
      })
      .then((user) => { res.status(2021).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// read
app.get('/', (req, res) => {
  res.send('Welcome to myFlix website')
});

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// READ responses based on a json file a particular genre
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
  .then((movie) => {
    res.json(movie.Genre.Description);
  })
  .catch((error) => {
    console.error(err);
    res.status(500).send('Error: + err');
  });
});

// READ obtains information about a director
app.get('/director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
  .then((movie) => {
    res.json(movie.Director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// READ receives ALL users
app.get('/users', passport.authenticate('jwt', { session: false }), function ( req, res) {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
  });
});

// CREATE User
app.post('/users',

[
  check('Username', 'username is required').isLength({ min: 5 }),
  check('Username', 'username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {


  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(442).json({ errors: errors.array() });
  }


  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
       } else { 
         Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
        .then((user) => { res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
  });


// Update a Username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {

  let errors = validationResult(req);


  if (!errors.isEmpty()) {
    return res.status(442).json({ errors: errors.array() });
  }

  Users.findOneAndUpdate({ Username: req.params.Username }, { 
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    },
  },
    { new: true },
    (err, updateUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error ' + err);
      } else {
        res.json(updateUser);
      }
    }
  );
});

// Delete a User by Username
app.delete('users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username * ' was deleted.');  
    } 
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// adds a movie to a users list (favorite movies)
app.post('/users/:Username/movies:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updateUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updateUser);
      }
    });
});

// deletes a movie from a users list (favorite movies)
app.delete('/users/:Username/movies:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updateUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updateUser);
      }
    });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('somethoing got broke!');
});


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('listening on Port ' + port);
});










 







//   // CREATE - adds new users and displays it afterwards
//   app.post('/users', (req, res) => {
//     const newUser = req.body;
//     if (newUser.name) {
//       newUser.id = uuid.v4();
//       users.push(newUser);
//       res.status(201).json(newUser);
//     } else {
//       res.status(400).send('users need names');
//     }
//   });

//   // CREATE - enables users to add any movie to their favorite list
//   app.post('/users/:id/:movieTitle', (req, res) => {
//     const { id, movieTitle } = req.params;

//     let user = users.find((user) => user.id == id);

//     if (user) {
//       user.favoriteMovies.push(movieTitle);
//       res.status(200).send(`$(movieName) has been added to user $(id)'s array`);
//     } else {
//       res.status(400).send('no such user');
//     }
//   });

//   // READ - returns a list of all movies available
//   app.get('/movies', (req, res) => {
//     Movies.find()
//       .then(function (movies) {
//         console.log("Found: " + movies.length);
//         res.status(201).json(movies);
//       })
//       .catch(function (error) {
//         console.error(error);
//         res.status(500).send('Error: ' + error);
//       });
//   });

// // READ - returns the movies based on the searched title
// app.get('/movies/:title', (req, res) => {
//   const { title } = req.params;
//   const movie = movies.find((movie) => movie.Title === title);

//   if (movie) {
//     res.status(200).json(movie);
//   } else {
//     res.status(400).send('no such movie');
//   }
// });

// // READ - returns the genre of a movie (based on the given genre)
// app.get('/movies/genre/:genreName', (req, res) => {
//   const { genreName } = req.params;
//   const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

//   if (genre) {
//     res.status(200).json(genre);
//   } else {
//     res.status(400).send('no such genre');
//   }
// });

// // READ - returns additional information about the director based on its name
// app.get('/movies/directors/:directorName', (req, res) => {
//   const { directorName } = req.params;
//   const director = movies.find(
//     (movie) => movie.Director.Name === directorName,
//   ).Director;

//   if (director) {
//     res.status(200).json(director);
//   } else {
//     res.status(400).send('no such genre');
//   }
// });

// // UPDATE - updates user name by given user id
// app.put('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;
//   let user = users.find((user) => user.id == id);

//   if (user) {
//     user.name = updatedUser.name;
//     res.status(200).json(user);
//   } else {
//     res.status(400).send('no such user');
//   }
// });

// // DELETE - compared to the code above, however, this code enables users to remove a movie from their list
// app.delete('/users/:id/:movieTitle', (req, res) => {
//   const { id, movieTitle } = req.params;

//   let user = users.find((user) => user.id == id);

//   if (user) {
//     user.favoriteMovies = user.favoriteMovies.filter(
//       (title) => title !== movieTitle,
//     );
//     res
//       .status(200)
//       .send(`${movieTitle} has been removed from user ${id}'s array`);
//   } else {
//     res.status(400).send('no such user');
//   }
// });

// // DELETE - this code enables the user to delete his/her account (deregister)
// app.delete('/users/:id', (req, res) => {
//   const { id } = req.params;

//   let user = users.find((user) => user.id == id);

//   if (user) {
//     users = users.filter((user) => user.id != id);
//     res.status(200).send(`${id} has been deleted`);
//   } else {
//     res.status(400).send('no such user');
//   }
// });

// // GET requests
// app.get('/', (req, res) => {
//   res.send('Welcome to the movie_api!');
// });

// app.get('/documentation', (req, res) => {
//   res.sendFile('public/documentation.html', { root: __dirname });
// });
// app.use(express.static('public'));

// app.get('/movies', (req, res) => {
//   res.json(movies);
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(404).send('page not found');
// });

// // listen for requests
// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });
