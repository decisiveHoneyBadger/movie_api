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

// imports the auth.js file into the project
let auth = require('./auth')(app);


// requires the Passport module and imports the passport.js file
const passport = require('passport'); // these t
require('./passport');







(uuid = require('uuid')), (morgan = require('morgan'));


mongoose.connect("mongodb://127.0.0.1:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.json());





// server requests via log
app.use(morgan('common'));
app.use(bodyParser.json());

// integration of CORS
const cors = require('cors');
app.use(cors());

//static files (serving) 
app.use(express.static('public'));

// input of validation
const { check, validationResult } = require('express-validator');

// integrating auth.jhs file for authentication and authorization employing HHTP and JWSToken
// let auth = require('auth') (app);


/* POST login. */

  app.post('/login', (req, res) => {
      console.log(req);
      passport.authenticate('local', { session: false }, (error, user, info) => {
          if (error || !user) {
              console.log(user);
              return res.status(400).json({
                  message: 'Something is not right',
                  user: user
              });
          }
          req.login(user, { session: false }, (error) => {
              if (error) {
                  res.send(error);
              }
              let token = generateJWTToken(user.toJSON());
              return res.json({ user, token });
          });
      })(req, res);
  });


// CREATE Movie endpoint
app.post('/movies', (req, res) => {
  Movies.findOne({ Title: req.body.Title })
    .then((movie) => {
      if (movie) {
        return res.status(400).send(req.body.Title + 'already exists');
      } else {
        Movies
          .create({
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
  res.send('Welcome to my movies website')
});

app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
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
app.get('/movies/:Title',  (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json({ movie });
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: + err');
  });
});

app.get('/movies/genre/:Name',  (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
  .then((movie) => {
    res.json(movie.Genre.Description);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: + err');
  });
});

// READ obtains information about a director
app.get('/director/:Name',  (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
  .then((movie) => {
    res.json({"movieDirector":movie.Description, "movieDirectorBio": movie.Director.Bio, "movieDirectorBirthyaer":movie.Director.Birthyear, "movieDirectorDeathyear":movie.Director.Deathyear});
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// READ receives ALL users
app.get('/users', ( req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
  });
});

// Get a user by Username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

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
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
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
  app.put('users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, 
      { $set:
        {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }, // This line makes sure that the updates document is returned  
      (err, updateUser) => {
        if(err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updateUser);
        }  
      });
  });


// Update a Username
app.put('/users/:Username', (req, res) => {

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
app.delete('users/:Username',  (req, res) => {
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

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID',  (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This document is returned
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
app.delete('/users/:Username/movies/:MovieID',  (req, res) => {
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

