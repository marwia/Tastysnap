/**
 * UserController
 *
 * @description :: Server-side logic for managing user registration.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    // rappresenta la funzione "register"
  	create: function (req, res) {
      if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Please fill out all fields'});
      }

      //delete req.body.password;

      User.create(req.body).exec(function (err, user) {
        if (err) {
          return res.json(err.status, {err: err});
        }
        // If user created successfuly we return user and token as response
        if (user) {
          // NOTE: payload is { id: user.id}
          console.log(user);
          res.json(200, {user: user, token: jwToken.issue({id: user.id})});
        }
      });
    }
	
};

