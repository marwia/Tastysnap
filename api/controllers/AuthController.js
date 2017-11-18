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



    /***************************************************************************
    *                                                                          *
    * Funzioni comuni a tutte le politiche di login                            *
    *                                                                          *
    ***************************************************************************/



var finishLogin = function (res, user, isNewUser) {
    if (user) {
        // rispondo con il token generato in base all'oggetto "user"
        // così, ogni volta che verifico il token posso risalire ai dati dell'utente
        var payload = { id: user.id, name: user.name, surname: user.surname, email: user.email };
        console.log("payload del token:", payload);
        return res.redirect('/login?token=' + jwToken.issue(payload) + '&new=' + isNewUser);
    } else {
        return res.status(401).json({ message: 'User not found.' });//info contains the error message
    }
}

var authenticateUser = function (queryArray, res, next, user, invitation_code) {
    User.update({
        or: queryArray
    }, user).exec(function (err, foundUser) {
        if (err) { return next(err); }
        if (foundUser.length > 0) {// login
            finishLogin(res, foundUser[0], false);
        } else {// register
            // verifico se è stato passato il codice
            if (sails.config.invitation.on == true && invitation_code != null) {
                // verifico che il codice non sia stato già usato
                if (!MyUtils.isValidInvitation(invitation_code)) {
                    return res.redirect('/login?error=' + 1);//invalid invitation code
                }
                User.create(user).exec(function (err, createdUser) {
                    if (err) { return next(err); }
                    finishLogin(res, createdUser, true);
                });
            } else if (sails.config.invitation.on == false) { // iscrizione con codice disabilitata
                User.create(user).exec(function (err, createdUser) {
                    if (err) { return next(err); }
                    finishLogin(res, createdUser, true);
                });
            } else if (sails.config.invitation.on == true && invitation_code == null) {
                return res.redirect('/login?error=' + 2);//invitation code required
            }
        }
    });
}

module.exports = {



    /***************************************************************************
    *                                                                          *
    * FACEBOOK                                                                 *
    *                                                                          *
    ***************************************************************************/



    facebookCallback: function (req, res, next) {
        passport.authenticate('facebook',
            function (err, user, isNewUser) {

                console.log("AUTH Facebook Response error=", err, "user=", user);

                if (err) { return next(err); }

                var invitation_code = req.query.state;

                authenticateUser([
                    { facebookId: user.facebookId },
                    { email: user.email }
                ], res, next, user, invitation_code);

            })(req, res, next);
    },

    facebook: function (req, res, next) {
        passport.authenticate('facebook', {
            scope: 'email',
            state: req.param("invitation_id"),
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: false
        })(req, res, next);
    },



    /***************************************************************************
    *                                                                          *
    * GOOGLE                                                                   *
    *                                                                          *
    ***************************************************************************/



    googleCallback: function (req, res, next) {
        passport.authenticate('google',
            function (err, user, isNewUser) {

                console.log("AUTH Google Response error=", err, "user=", user);

                if (err) { return next(err); }

                var invitation_code = req.query.state;

                authenticateUser([
                    { googleId: user.googleId },
                    { email: user.email }
                ], res, next, user, invitation_code);

            })(req, res, next);
    },

    google: function (req, res, next) {
        passport.authenticate('google', {
            // aggiunta l'autorizzazione a richiedere l'email dell'utente
            // maggiori info su:  https://developers.google.com/+/web/api/rest/oauth#authorization-scopes
            scope: ['https://www.googleapis.com/auth/plus.login', "email"],
            state: req.param("invitation_id"),
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: false
        })(req, res, next);
    },



    /***************************************************************************
    *                                                                          *
    * TWITTER                                                                  *
    *                                                                          *
    ***************************************************************************/



    twitterCallback: function (req, res, next) {
        passport.authenticate('twitter',
            function (err, user, isNewUser) {

                console.log("AUTH Twitter Response error= ", err, "user= ", user);

                if (err) { return next(err); }

                var invitation_code = req.query.state;

                authenticateUser([
                    { twitterId: user.twitterId },
                    { email: user.email }
                ], res, next, user, invitation_code);

            })(req, res, next);
    },

    twitter: function (req, res, next) {
        passport.authenticate('twitter', {
            state: req.param("invitation_id"),
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: false
        })(req, res, next);
    },



    /**
     * @api {get} /auth/invitation Check if invitation is on
     * @apiName CheckInvitation
     * @apiGroup Invitation
     *
     * @apiDescription Serve per sapere se il sistema ad inviti è attivo oppure no.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *
     */
    isInvitationRequired: function (req, res, next) {
        return res.json(sails.config.invitation);
    }

};