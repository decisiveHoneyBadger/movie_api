const jwtSecret = process.env.JWT_SECRET; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Your local passport file

/**
 * generates JWT web token
 * @function generateJWTToken
 * @param {object} - containing user data
 * @returns {string} - jwt web token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username being encoded in the JWT
    expiresIn: '7d', // This specifies a limited use of the token which will expire in 7 days
    algorithm: 'HS256', // This is the algorithm used to "sign" or encode the values of the JWT
  });
};

/**
 * CREATE(S) login credentials creating JWT web token
 * @method POST
 * @function [path]/login
 * @params {*} router
 * @returns {object} user
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        console.log(error);
        return res.status(400).json({
          message: 'Something is not right',
          user: user,
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
};
