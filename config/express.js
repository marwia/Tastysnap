
/**
 * Configure advanced options for the Express server inside of Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */

var passport = require('passport');

module.exports.http = {

    customMiddleware: function (app) {

        console.log('Init Express midleware');

        app.use(passport.initialize());
        app.use(passport.session());

        console.log('Passport inizializzato');

    }
}

