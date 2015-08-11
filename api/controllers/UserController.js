/**
 * UserController
 *
 * @description :: Server-side logic for managing user registration.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * @api {post} /user
     * @apiName CreateUser
     * @apiGroup User
     *
     * @apiDescription Serve eseguire la registrazione di un nuovo utente.
     *
     * @apiParam {String} username Username of the User.
     * @apiParam {String} password  Password of the User.
     *
     * @apiSuccess {Object} user User object.
     * @apiSuccess {String} token  Token for identification.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *     "user": 
     *       {
     *         "username": "abc",
     *         "createdAt": "2015-08-11T18:58:46.329Z",
     *         "updatedAt": "2015-08-11T18:58:46.329Z",
     *         "id": "55ca45e69b4246110b319cb1"
     *       },
     *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU1Y2E0NWU2OWI0MjQ2MTEwYjMxOWNiMSIsImlhdCI6MTQzOTMxOTUyNiwiZXhwIjoxNDM5MzMwMzI2fQ.GUOOFlWwiNPeZjmN3-HPHG4cMJsWnP7rgQbux6FNqGI"
     *     }
     *
     * @apiError BadRequest Mancano dei parametri all'oggetto inviato al server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "message": "Please fill out all fields"
     *     }
     */
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

