/**
 * AuthController.js
 *
 * Controller che espone il metodo per fare il login di un utente. 
 * In pratica permette di verificare il username e password di un utente
 * se questi combaciano a quelli di un utente registrato, viene 
 * ritrovato l'oggetto 'User'.
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');

module.exports = {

    facebookCallback: function (req, res, next) {
        passport.authenticate('facebook',
            function (err, user) {

                console.log("AUTH Facebook Response error=", err, "user=", user);
                //se l'utente non esiste allora rimane uguale a false
                if (err) { return next(err); }

                if (user) {
                    // rispondo con il token generato in base all'oggetto "user"
                    // così, ogni volta che verifico il token posso risalire ai dati dell'utente
                    var payload = {id: user.id, name: user.name, surname: user.surname};
                    console.log("payload del token:", payload);
                    return res.redirect('/login?token=' + jwToken.issue(payload))
                } else {
                    return res.status(401).json({ message: 'User not found.' });//info contains the error message
                }
                //res.redirect('/dashboard');
            })(req, res, next);
    },

    facebook: function (req, res, next) {
        passport.authenticate('facebook', {
            scope: 'email',
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: false
        })(req, res, next);
    },

    googleCallback: function (req, res, next) {
        passport.authenticate('google',
            function (err, user) {

                console.log("AUTH Google Response error=", err, "user=", user);
                //se l'utente non esiste allora rimane uguale a false
                if (err) { return next(err); }

                if (user) {
                    // rispondo con il token generato in base all'oggetto "user"
                    // così, ogni volta che verifico il token posso risalire ai dati dell'utente
                    var payload = {id: user.id, name: user.name, surname: user.surname};
                    return res.redirect('/login?token=' + jwToken.issue(payload))
                } else {
                    return res.status(401).json({ message: 'User not found.' });//info contains the error message
                }
                //res.redirect('/dashboard');
            })(req, res, next);
    },

    google: function (req, res, next) {
        passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: false,
            // aggiunta l'autorizzazione a richiedere l'email dell'utente
            // maggiori info su:  https://developers.google.com/+/web/api/rest/oauth#authorization-scopes
            scope: ['https://www.googleapis.com/auth/plus.login', "email"]
        })(req, res, next);
    },

    twitterCallback: function (req, res, next) {
        passport.authenticate('twitter',
            function (err, user) {

                console.log("AUTH Twitter Response error= ", err, "user= ", user);
                //se l'utente non esiste allora rimane uguale a false
                if (err) { return next(err); }

                if (user) {
                    // rispondo con il token generato in base all'oggetto "user"
                    // così, ogni volta che verifico il token posso risalire ai dati dell'utente
                    var payload = {id: user.id, name: user.name, surname: user.surname};
                    return res.redirect('/login?token=' + jwToken.issue(payload))
                } else {
                    return res.status(401).json({ message: 'User not found.' });//info contains the error message
                }
                //res.redirect('/dashboard');
            })(req, res, next);
    },

    twitter: function (req, res, next) {
        passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: false
        })(req, res, next);
    }

};