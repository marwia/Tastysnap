
/**
 * Configure advanced options for the Passport authentication middleware.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy, 
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google-oauth').Strategy;

// Local strategy
/*
*
* DA TOGLIERE ! ! !
*
*/
passport.use(new LocalStrategy(
    function(username, password, done) {
        
        console.log("=> localVerifyHandler with ", username, password);

        User.findOne({ username: username }, function (err, user) {

            if (err) { return done(err); }

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (!User.validPassword(user, password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    }
));

// Facebook strategy
passport.use(new FacebookStrategy({
    clientID: "617087911724851",
    clientSecret: "5e8033ba7bc89b9c72d890862b5d618c",
    callbackURL: "http://localhost:1337/api/v1/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
      console.log("Facebook strategy triggered...\n");
    User.findOrCreate({
        facebookId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value,
        profileImage: profile.photos[0].value
    }).exec( function(err, user) {
      if (err) { return done(err); }
      console.log("Utente FB creato o trovato....", user);
      done(null, user);
    });
  }
));

// Google strategy
passport.use(new FacebookStrategy({
    clientID: "509022100010-cp58s7r02fg0o9mov51g6ngb8ugc9dbc.apps.googleusercontent.com",
    clientSecret: "gQR5REP8GLh86OJaC4mDLNcb",
    callbackURL: "http://localhost:1337/api/v1/auth/google/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
      console.log("Google strategy triggered...\n");
      /*
    User.findOrCreate({
        facebookId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value,
        profileImage: profile.photos[0].value
    }).exec( function(err, user) {
      if (err) { return done(err); }
      console.log("Utente FB creato o trovato....", user);
      done(null, user);
    });
    */
  }
));

// Twitter strategy
passport.use(new TwitterStrategy({
    consumerKey: "FPIFJMkD0a91C2PWr4ow42jtI",
    consumerSecret: "oayhHlz10mYJY84NsuyqUd960UrClxgkUYYLgcok2Z62VLaGJg",
    callbackURL: "http://localhost:1337/api/v1/auth/twitter/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
      console.log("Twitter strategy triggered...\n");
      /*
    User.findOrCreate({
        facebookId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value,
        profileImage: profile.photos[0].value
    }).exec( function(err, user) {
      if (err) { return done(err); }
      console.log("Utente FB creato o trovato....", user);
      done(null, user);
    });
    */
  }
));
