
/**
 * Configure advanced options for the Passport authentication middleware.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Facebook strategy
passport.use(new FacebookStrategy({
    clientID: "617087911724851",
    clientSecret: "5e8033ba7bc89b9c72d890862b5d618c",
    callbackURL: "http://localhost:1337/api/v1/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'photos']
},
    function (accessToken, refreshToken, profile, done) {
        console.log("Facebook strategy triggered...\n");
        //TODO: sostituire con delle update!
        User.findOne().where({
            or: [
                { facebookId: profile.id },
                { name: profile.name.givenName, surname: profile.name.familyName }
            ]
        }).exec(function (err, foundUser) {
            if (err) { return done(err); }
            if(foundUser) {
                console.log("Utente FB loggato", foundUser);
                done(null, foundUser);
            } else {
                User.create({
                    facebookId: profile.id,
                    facebookImageUrl: profile.photos[0].value,
                    name: profile.name.givenName,
                    surname: profile.name.familyName,
                    email: profile.emails[0].value
                }).exec(function (err, user) {
                    
                    if (err) { return done(err); }
                    console.log("Utente FB creato", user);
                    done(null, user);
                });
            }
            });
}));

// Google strategy
passport.use(new GoogleStrategy({
    clientID: "509022100010-cp58s7r02fg0o9mov51g6ngb8ugc9dbc.apps.googleusercontent.com",
    clientSecret: "gQR5REP8GLh86OJaC4mDLNcb",
    callbackURL: "http://localhost:1337/api/v1/auth/google/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
      console.log("Google strategy triggered...\n");
      User.findOne().where({
            or: [
                { googleId: profile.id },
                { name: profile.name.givenName, surname: profile.name.familyName }
            ]
        }).exec(function (err, foundUser) {
            if (err) { return done(err); }
            if(foundUser) {
                console.log("Utente Google loggato", foundUser);
                done(null, foundUser);
            } else {
                User.create({
                    googleId: profile.id,
                    googleImageUrl: profile.photos[0].value,
                    name: profile.name.givenName,
                    surname: profile.name.familyName,
                    email: profile.emails[0].value
                }).exec(function (err, user) {
                    
                    if (err) { return done(err); }
                    console.log("Utente Google creato", user);
                    done(null, user);
                });
            }
            });
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
      console.log("Twitter strategy triggered...\n", profile);
      User.findOne().where({
            or: [
                { twitterId: profile.id },
                { name: profile.displayName.split(' ')[0], surname: profile.displayName.split(' ')[1] }
            ]
        }).exec(function (err, foundUser) {
            if (err) { return done(err); }
            if(foundUser) {
                console.log("Utente Twitter loggato", foundUser);
                done(null, foundUser);
            } else {
                User.create({
                    twitterId: profile.id,
                    twitterImageUrl: profile.photos[0].value,
                    name: profile.displayName.split(' ')[0],
                    surname: profile.displayName.split(' ')[1]
                    //email: profile.emails[0].value
                }).exec(function (err, user) {
                    
                    if (err) { return done(err); }
                    console.log("Utente Twitter creato", user);
                    done(null, user);
                });
            }
            });
  }
));
