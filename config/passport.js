
/**
 * Configure advanced options for the Passport authentication middleware.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google-oauth20').Strategy;

// Facebook strategy
var FBstrategy;
if (process.env.NODE_ENV === 'production') {
    FBstrategy = {
        clientID: "617087911724851",
        clientSecret: "5e8033ba7bc89b9c72d890862b5d618c",
        callbackURL: "https://tastysnap.com/api/v1/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'picture.type(large)', 'name', 'gender', 'emails']
    };
    
} else {// development
    FBstrategy = {
        clientID: "1049533381779590",
        clientSecret: "8a55b07428ba961582bb5d4e870df4b4",
        callbackURL: "http://localhost:1337/api/v1/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'picture.type(large)', 'name', 'gender', 'emails']
    };
}
passport.use(new FacebookStrategy(FBstrategy,
    function(accessToken, refreshToken, profile, done) {
        console.log("Facebook strategy triggered...\n");
        var fbUser = {
            facebookId: profile.id,
            facebookImageUrl: profile.photos[0].value,
            name: profile.name.givenName,
            surname: profile.name.familyName,
            email: profile.emails[0].value
        };

        User.update({
            or: [
                { facebookId: profile.id },
                { email: profile.emails[0].value }
            ]
        }, fbUser).exec(function(err, foundUser) {
            if (err) { return done(err); }
            if (foundUser[0]) {// login
                done(null, foundUser[0], false);// l'ultimo argomento indica se l'utente è nuovo
            } else {// register
                User.create(fbUser).exec(function(err, user) {
                    if (err) { return done(err); }
                    done(null, user, true);// l'ultimo argomento indica se l'utente è nuovo
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
        var gUser = {
            googleId: profile.id,
            googleImageUrl: profile.photos[0].value,
            name: profile.name.givenName,
            surname: profile.name.familyName,
            email: profile.emails[0].value
        };

        User.update({
            or: [
                { googleId: profile.id },
                { email: profile.emails[0].value }
            ]
        }, gUser).exec(function(err, foundUser) {
            if (err) { return done(err); }
            if (foundUser[0]) {// login
                done(null, foundUser[0], false);// l'ultimo argomento indica se l'utente è nuovo
            } else {// register
                User.create(gUser).exec(function(err, user) {
                    if (err) { return done(err); }
                    done(null, user, true);// l'ultimo argomento indica se l'utente è nuovo
                });
            }
        });
    }
));

// Twitter strategy
passport.use(new TwitterStrategy({
    consumerKey: "xF1qv1cSAZQEXYMDFB7bFqqlM",
    consumerSecret: "cQSEQXnPiYIrDef1K6QPo8HigHM4XT3jbX0MXhFihk6DfbNbJO",
    callbackURL: "http://localhost:1337/api/v1/auth/twitter/callback",
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
},
    function(accessToken, refreshToken, profile, done) {
        console.log("Twitter strategy triggered...\n", profile);
        var tUser = {
            twitterId: profile.id,
            twitterImageUrl: profile.photos[0].value,
            name: profile.displayName.split(' ')[0],
            surname: profile.displayName.split(' ')[1],
            email: profile.emails[0].value
        };

        User.update({
            or: [
                { twitterId: profile.id },
                { email: profile.emails[0].value }
            ]
        }, tUser).exec(function(err, foundUser) {
            if (err) { return done(err); }
            if (foundUser[0]) {// login
                done(null, foundUser[0], false);// l'ultimo argomento indica se l'utente è nuovo
            } else {// register
                User.create(tUser).exec(function(err, user) {
                    if (err) { return done(err); }
                    done(null, user, true);// l'ultimo argomento indica se l'utente è nuovo
                });
            }
        });
    }
));
