
/**
 * Configure advanced options for the Passport authentication middleware.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */

var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

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
