
//load bcrypt
var bCrypt = require('bcrypt-nodejs');

require('dotenv').config();
// geocoder
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'mapquest',
  apiKey: process.env.SECRETKEY,
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  formatter: null // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);

module.exports = function (passport, user) {

  var User = user;

  var LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findByPk(id).then(function (user) {
      if (user) {
        done(null, user.get());
      }
      else {
        done(user.errors, null);
      }
    });

  });

  passport.use('local-signup', new LocalStrategy(

    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function (req, email, password, done) {

      console.log(email);
      var generateHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };

      User.findOne({ where: { email: email } }).then(function (user) {

        if (user) {
          return done(null, false, { message: 'That email is already taken' });
        }

        else {
          var userPassword = generateHash(password);
          geocoder
            .geocode({ address: req.body.address, country: 'USA', zipcode: req.body.zip }, function (err, res) {
              console.log(res);
            })
            .then(function (res) {
              console.log(res);
              var data = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: email,
                username: req.body.username,
                password: userPassword,
                address: req.body.address,
                city: req.body.city,
                zip: req.body.zip,
                state: req.body.state,
                latitude: res[0].latitude,
                longitude: res[0].longitude
              }
              User.create(data).then(function (newUser, created) {
                if (!newUser) {
                  console.log("not a new user")
                  return done(null, false);
                }
                if (newUser) {
                  console.log("new user")
                  return done(null, newUser);
                }

              });

            });
        }

      });



    }

  ));

  //local-signin
  //LOCAL SIGNIN
  passport.use('local-signin', new LocalStrategy(

    {

      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function (req, email, password, done) {

      var User = user;

      var isValidPassword = function (userpass, password) {
        return bCrypt.compareSync(password, userpass);
      }

      User.findOne({ where: { email: email } }).then(function (user) {
        console.log(user);
        if (!user) {
          return done(null, false, { message: 'Email does not exist' });
        }

        if (!isValidPassword(user.password, password)) {

          return done(null, false, { message: 'Incorrect password.' });

        }

        var userinfo = user.get();

        return done(null, userinfo);

      }).catch(function (err) {

        console.log("Error:", err);

        return done(null, false, { message: 'Something went wrong with your Signin' });


      });

    }
  ));


}

