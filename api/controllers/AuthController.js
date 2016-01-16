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
    /**
     * @api {post} /login User login
     * @apiGroup User
     * @apiName UserLogin
     * 
     *
     * @apiDescription Per eseguire il login di un utente puoi inviare le sue credenziali
     * al server, così otterrai il token che ti servirà per tutte le successive operazioni.
     * Il username e la password sono parametri da inserire nel body della richiesta.
     *
     * @apiParam {String} username Username of the User.
     * @apiParam {String} password  Password of the User.
     *
     * @apiParamExample {url-encoded} Request-Example:
     *     username=cavallo&password=cavallo
     *
     * @apiSuccess {String} token  Token for identification.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
     *     }
     *
     * @apiError message Breve descrizione dell'errore che ha riscontrato il server.
     *
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "User and password required."
     *     }
     *
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "User not found."
     *     }
     */

    index: function (req, res, next) {
        var username = req.param('username');
        var password = req.param('password');
        console.log("login action");
        if (!username || !password) {
            return res.status(401).json({ message: 'User and password required.' });
        }

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: false
        }, function (err, user) {

            console.log("AUTH Local Response error=", err, "user=", user);
            //se l'utente non esiste allora rimane uguale a false
            if (err) { return next(err); }

            if (user) {
                // rispondo con il token generato in base all'oggetto "user"
                // così, ogni volta che verifico il token posso risalire ai dati dell'utente
                return res.json({ token: jwToken.issue(user) });
            } else {
                return res.status(401).json({ message: 'User not found.' });//info contains the error message
            }

        })(req, res);
    },

    facebookCallback: function (req, res, next) {
        passport.authenticate('facebook',
            function (err, user) {
                
                console.log("AUTH Facebook Response error=", err, "user=", user);
                //se l'utente non esiste allora rimane uguale a false
                if (err) { return next(err); }

                if (user) {
                    // rispondo con il token generato in base all'oggetto "user"
                    // così, ogni volta che verifico il token posso risalire ai dati dell'utente
                    return res.redirect('/login?token='+jwToken.issue(user))
                    //return res.json({ token: jwToken.issue(user) });
                } else {
                    return res.status(401).json({ message: 'User not found.' });//info contains the error message
                }
                //res.redirect('/dashboard');
            })(req, res, next);
    },

    facebook: function (req, res, next) {
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: false
        })(req, res, next);
    }

};