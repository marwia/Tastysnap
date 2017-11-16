
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
            facebookImageUrl: "https://graph.facebook.com/" + profile.id + "/picture" + "?width=200&height=200" + "&access_token=" + accessToken,
            name: profile.name.givenName,
            surname: profile.name.familyName,
            email: profile.emails[0].value
        };

        done(null, fbUser, null);
   
    }));



// Google strategy
var Gstrategy;
if (process.env.NODE_ENV === 'production') {
    Gstrategy = {
        clientID: "509022100010-cp58s7r02fg0o9mov51g6ngb8ugc9dbc.apps.googleusercontent.com",
        clientSecret: "gQR5REP8GLh86OJaC4mDLNcb",
        callbackURL: "https://tastysnap.com/api/v1/auth/google/callback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'photos']
    };
    
} else {// development
    Gstrategy = {
        clientID: "509022100010-cp58s7r02fg0o9mov51g6ngb8ugc9dbc.apps.googleusercontent.com",
        clientSecret: "gQR5REP8GLh86OJaC4mDLNcb",
        callbackURL: "http://localhost:1337/api/v1/auth/google/callback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'photos']
    };
}

passport.use(new GoogleStrategy(Gstrategy,
    function(accessToken, refreshToken, profile, done) {
        console.log("Google strategy triggered...\n");
        var gUser = {
            googleId: profile.id,
            googleImageUrl: profile.photos[0].value,
            name: profile.name.givenName,
            surname: profile.name.familyName,
            email: profile.emails[0].value
        };

        done(null, gUser, null);

    }));



// Twitter strategy
var Tstrategy;
if (process.env.NODE_ENV === 'production') {
    Tstrategy = {
        consumerKey: "xF1qv1cSAZQEXYMDFB7bFqqlM",
        consumerSecret: "cQSEQXnPiYIrDef1K6QPo8HigHM4XT3jbX0MXhFihk6DfbNbJO",
        callbackURL: "https://tastysnap.com/api/v1/auth/twitter/callback",
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
    };
    
} else {// development
    Tstrategy = {
        consumerKey: "xF1qv1cSAZQEXYMDFB7bFqqlM",
        consumerSecret: "cQSEQXnPiYIrDef1K6QPo8HigHM4XT3jbX0MXhFihk6DfbNbJO",
        callbackURL: "http://localhost:1337/api/v1/auth/twitter/callback",
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
    };
}

passport.use(new TwitterStrategy(Tstrategy,
    function(accessToken, refreshToken, profile, done) {
        console.log("Twitter strategy triggered...\n", profile);
        var tUser = {
            twitterId: profile.id,
            twitterImageUrl: profile.photos[0].value,
            name: profile.displayName.split(' ')[0],
            surname: profile.displayName.split(' ')[1],
            email: profile.emails[0].value
        };

        done(null, tUser, null);

    }));
