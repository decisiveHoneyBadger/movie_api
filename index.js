const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
// logging middleware library for Express via Morgan to log all requests
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

// imports the auth.js file into the project
let auth = require('./auth')(app);

// requires the Passport module and imports the passport.js file
const passport = require('passport'); // these t
require('./passport');

(uuid = require('uuid')), (morgan = require('morgan'));

// hides connection settings in environment variable of heroku

// mongoose.connect('mongodb://localhost:27017/myFlixDB',
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// server requests via log
app.use(morgan('common'));
// app.use(bodyParser.json());

//static files (serving)
app.use(express.static('public'));

// input of validation
const { check, validationResult } = require('express-validator');

// integrating auth.jhs file for authentication and authorization employing HHTP and JWSToken
// let auth = require('auth') (app);

// CREATE Movie endpoint
app.post(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
            .then((user) => {
              res.status(200).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  },
);

// read welcome page
app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('Welcome to my movies website');
});

app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then(function (movies) {
        res.status(201).json(movies);
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  },
);

// READ responses based on a json file a particular genre
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json({ movie });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: + err');
      });
  },
);

app.get(
  '/movies/genre/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
      .then((movie) => {
        res.json(movie.Genre.Description);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: + err');
      });
  },
);

// READ obtains information about a director
app.get(
  '/director/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
      .then((movie) => {
        res.json({
          movieDirector: movie.Description,
          movieDirectorBio: movie.Director.Bio,
          movieDirectorBirthyaer: movie.Director.Birthyear,
          movieDirectorDeathyear: movie.Director.Deathyear,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  },
);

// READ favorite movies of a given user - OWN CREATION:)
app.get(
  '/user/:Username/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        console.info(user);
        user.FavoriteMovies.forEach((movieID) => {
          Movies.findOne({ 'Movie.ID': movieID }).then((movie) => {
            res.json(movie);
          });
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  },
);

// READ receives ALL users
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
      });
  },
);

// Get a user by Username
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  },
);

// CREATE User
//Add a user
/* We’ll expect JSON in this format
{
 ID: Integer,
 Username: String,
 Password: String,
 Email: String,
 Birthday: Date
}*/
app.post(
  '/users',
  // Validation logic here for request
  // You can either use a chain of methods like .not().isEmpty()
  // which means "opposite of isEmpty" in plain english "is not empty"
  // or use .isLength({ min: 5 }) which means
  // minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'username contains non alphanumeric characters - not allowed.',
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(442).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password); // hashes any password entered by the user when registering before stroring it in the MongoDB
    Users.findOne({ Username: req.body.Username }) // searches to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          // if the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  },
);

// Update a user's info, by username
/* We’ll expect JSON in this format
 {
   Username: String,
   (required)
   Password: String,
   (required)
   Email: String,
   (required)
   Birthday: Date
 }*/
// Update a Username
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let errors = validationResult(req);
    let hashedPassword = Users.hashPassword(req.body.Password); // hashes any password entered by the user when registering before stroring it in the MongoDB

    if (!errors.isEmpty()) {
      return res.status(442).json({ errors: errors.array() });
    }

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
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
      },
    );
  },
);

// Delete a User by Username
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        console.log(user);
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  },
);

// Add a movie to a user's list of favorites
app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // This document is returned
      (err, updateUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updateUser);
        }
      },
    );
  },
);

// deletes a movie from a users list (favorite movies)
app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updateUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updateUser);
        }
      },
    );
  },
);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('something got broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('listening on Port ' + port);
});
