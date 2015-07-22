/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');
 
module.exports = {
  // l'azione di login
  index: function (req, res, next) {
    var username = req.param('username');
    var password = req.param('password');
    console.log("login action");
    if (!username || !password) {
      return res.status(401).json({message: 'User and password required.'});
    }

    passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/',
                failureFlash: false
            }, function (err, user) {

                console.log("AUTH Local Response error=", err, "user=", user);
                //se l'utente non esiste allora rimane uguale a false
                if(err){ return next(err); }

                if(user){
                  // rispondo con il token generato in base all'oggetto "user"
                  // così, ogni volta che verifico il token posso risalire ai dati dell'utente
                  return res.json({token: jwToken.issue(user) });
                } else {
                  return res.status(401).json({message: 'User not found.'});//info contains the error message
                }

            })(req, res);
  }

};