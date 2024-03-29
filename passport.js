/*
Here, two passport strategies are defined. 
LocalStrategy takes a username and password from the request body 
and uses Mongoose to check your database for a user with the same username
*/
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    (username, password, callback) => {
      console.log(username + '  ' + password);

      Users.findOne({ Username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log('incorrect username');
          return callback(null, false, { message: 'Incorrect username.' }); // If an error occurs, or if the username can’t be found within the database, an error message is passed to the callback
        }

        if (!user.validatePassword(password)) {
          // hashes any password entered by the user when loogging in before comparing to the password stored in MongoDB
          console.log('validtion failed');
          return callback(null, false, { message: 'Incorrect password.' });
        }

        console.log('finished');
        return callback(null, user);
      });
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // this "secret" key is to verify the signature of the JWT. This signature verifies that the sender of the JWT (the client) is who it says it is
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    },
  ),
);
