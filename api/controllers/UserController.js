/**
 * UserController
 *
 * @description :: Server-side logic for managing user registration.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * @api {post} /user Register a new User
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
     * @apiError message Breve descrizione dell'errore che ha riscontrato il server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "message": "Please fill out all fields"
     *     }
     */
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
    },

    /**
     * @api {put} /user/:user/follow Follow a User
     * @apiName FollowUser
     * @apiGroup User
     *
     * @apiDescription Serve seguire un utente.
     * Richiede l'autenticazione della richiesta. Attenzione: non è possibile seguire se
     * stessi.
     *
     * @apiHeader {String} token  Authentication token.
     *
     * @apiHeaderExample Request-Header-Example:
     *     Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImNhdmFsbG8iLCJjcmVhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJ1cGRhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJpZCI6IjU1YjI3NWFhM2U0OTM1YmMwMjhkMDJjMCIsImlhdCI6MTQzOTA1ODQ2MSwiZXhwIjoxNDM5MDY5MjYxfQ.EBvGiq4fuRwKXjgrX5kKmUJZVQOgkjCBRe-j--g8NbU
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoUserError
     */
    follow: function (req, res, next) {
        var user = req.payload;
        var userToFollow = req.user;

        // seguire se stessi non è permesso
        if(user.id == userToFollow.id) { return res.badRequest(); }

        // ricarico l'utente corrente (con l'array dei following) (necessario...)
        User.findOne(user.id).populate('following').exec( function (err, foundUser) {
            // seguire più volte non è permesso
            if(foundUser.isFollowingUser(userToFollow.id) == true) { return res.badRequest(); }

            foundUser.following.add(userToFollow.id);

            foundUser.save(function (err, saved) {
                if(err){ return next(err); }
                return res.send(204, null);// OK - No Content
            });
        });   
    },

    /**
     * @api {delete} /user/:user/follow Unfollow a User
     * @apiName UnfollowUser
     * @apiGroup User
     *
     * @apiDescription Serve non seguire più un utente.
     * Richiede l'autenticazione della richiesta.
     *
     * @apiHeader {String} token  Authentication token.
     *
     * @apiHeaderExample Request-Header-Example:
     *     Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImNhdmFsbG8iLCJjcmVhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJ1cGRhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJpZCI6IjU1YjI3NWFhM2U0OTM1YmMwMjhkMDJjMCIsImlhdCI6MTQzOTA1ODQ2MSwiZXhwIjoxNDM5MDY5MjYxfQ.EBvGiq4fuRwKXjgrX5kKmUJZVQOgkjCBRe-j--g8NbU
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoUserError
     */
    unfollow: function (req, res, next) {
        var user = req.payload;
        var userToFollow = req.user;

        // ricarico l'utente corrente (necessario...)
        User.findOne(user.id).exec( function (err, foundUser) {
            user.following.remove(userToFollow.id);

            user.save(function (err, saved) {
                if(err){ return next(err); }
                return res.send(204, null);// OK - No Content
            });
        });
    },

    /**
     * @api {get} /user/:user/follower List followers of a User
     * @apiName FollowerUser
     * @apiGroup User
     *
     * @apiDescription Serve per ricavare la lista degli utenti che seguono un utente.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     *
     * @apiUse NoUserError
     */
    getFollowers: function (req, res, next) {
        var requestedUser = req.user;

        User.findOne(requestedUser.id).populate('followers').exec( function(err, foundUser) {
            if(err){ return next(err); }
            return res.json(foundUser.followers);
        });
    },

    /**
     * @api {get} /user/:user/following List users followed by a User
     * @apiName FollowingUser
     * @apiGroup User
     *
     * @apiDescription Serve ricavare la lista degli utenti seguiti da un utente.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     *
     * @apiUse NoUserError
     */
    getFollowing: function (req, res, next) {
        var requestedUser = req.user;

        User.findOne(requestedUser.id).populate('following').exec( function(err, foundUser) {
            if(err){ return next(err); }
            return res.json(foundUser.following);
        });
    },

    /**
     * @api {get} /user/following/:user Check if you are following a User
     * @apiName AreYouFollowing
     * @apiGroup User
     *
     * @apiDescription Serve per verificare se l'utente chiamante sta segundo un altro.
     * Richiede l'autenticazione della richiesta.
     *
     * @apiHeader {String} token  Authentication token.
     *
     * @apiHeaderExample Request-Header-Example:
     *     Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImNhdmFsbG8iLCJjcmVhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJ1cGRhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJpZCI6IjU1YjI3NWFhM2U0OTM1YmMwMjhkMDJjMCIsImlhdCI6MTQzOTA1ODQ2MSwiZXhwIjoxNDM5MDY5MjYxfQ.EBvGiq4fuRwKXjgrX5kKmUJZVQOgkjCBRe-j--g8NbU
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 404 Not Found
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoUserError
     */
    areYouFollowing: function (req, res, next) {
        var user = req.payload;
        var targetUser = req.user;

        // ricarico l'utente corrente (necessario...)
        User.findOne(user.id).populate('following').exec( function (err, foundUser) {
            if(err){ return next(err); }

            // seguire più volte non è permesso
            if(foundUser.isFollowingUser(targetUser.id) == false) { return res.notFound(); }

            return res.send(204, null);// OK - No Content
        });
    },

    /**
     * @api {get} /user/:user/following/:target_user Check if one User is following another
     * @apiName IsFollowing
     * @apiGroup User
     *
     * @apiDescription Serve per verificare se un utente sta segundo un altro.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 404 Not Found
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoUserError
     */
    isFollowing: function (req, res, next) {
        var targetUser = req.param('target_user');
        if(!targetUser) { return res.badRequest(); }
        var user = req.user;

        // ricarico l'utente corrente (necessario...)
        User.findOne(user.id).populate('following').exec( function (err, foundUser) {
            if(err){ return next(err); }
            // seguire più volte non è permesso
            if(foundUser.isFollowingUser(targetUser) == false) { return res.notFound(); }

            return res.send(204, null);// OK - No Content
        });
    },
	
};

