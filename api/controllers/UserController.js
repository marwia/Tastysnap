/**
 * UserController
 *
 * @description :: Server-side logic for managing user registration.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

/**
 * Module dependencies
 * 
 * Prese da https://github.com/balderdashy/sails/blob/master/lib/hooks/blueprints/actions/find.js
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

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
            return res.status(400).json({ message: 'Please fill out all fields' });
        }

        //delete req.body.password;

        User.create(req.body).exec(function (err, user) {
            if (err) {
                return res.json(err.status, { err: err });
            }
            // If user created successfuly we return user and token as response
            if (user) {
                // NOTE: payload is { id: user.id}
                console.log(user);
                res.json(200, { user: user, token: jwToken.issue({ id: user.id }) });
            }
        });
    },
    
    /**
     * @api {get} /user List Users
     * @apiName ListUsers
     * @apiGroup User
     *
     * @apiDescription Serve per richiedere un lista di ricette.
     * Attenzione che i risultati sono limitati ad un numero preciso di ricette, massimo 30 per richiesta.<br>
     * Questo end point accetta prametri.
     *
     * @apiParam {Integer} skip The number of records to skip (useful for pagination).
     * @apiParam {Integer} limit The maximum number of records to send back (useful for pagination). Defaults to 30. 
     * @apiParam {String} where Instead of filtering based on a specific attribute, you may instead choose to provide a where parameter with a Waterline WHERE criteria object, encoded as a JSON string.
     * @apiParam {String} sort The sort order. By default, returned records are sorted by primary key value in ascending order. 
     *
     * @apiParamExample Request-Param-Example:
     *     ?skip=6&limit=3
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */
    find: function (req, res, next) {
        User.find()
            .where(actionUtil.parseCriteria(req))
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('recipes')
            .populate('collections')
            .populate('followers')
            .populate('following')
            .populate('followingCollections')
            .exec(function (err, foundUsers) {
                if (err) { return next(err); }
            
                // array di appoggio
                var users = new Array();
            
                // conto gli elementi delle collection
                for (var i in foundUsers) {
                    foundUsers[i].recipesCount = foundUsers[i].recipes.length;
                    foundUsers[i].collectionsCount = foundUsers[i].collections.length;
                    foundUsers[i].followersCount = foundUsers[i].followers.length;
                    foundUsers[i].followingCount = foundUsers[i].following.length;
                    foundUsers[i].followingCollectionsCount = foundUsers[i].followingCollections.length;
                
                    /**
                     * Tolgo gli elementi popolati, per qualche ragione gli elementi che sono
                     * delle associazioni vengono automaticamente tolte quando si esegue
                     * il seguente metodo.
                     */
                    var obj = foundUsers[i].toObject();
                    users.push(obj);
                }

                return res.json(users);
            });
    },
    
    /**
     * @api {get} /user/:id Get a User
     * @apiName GetUser
     * @apiGroup User
     *
     * @apiDescription Serve per caricare tutti i dettagli di un 
     * particolare utente.
     *
     * @apiParam {String} id User id.
     *
     * @apiSuccess {json} user JSON that represents the user object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
            "username": "cavallo",
            "createdAt": "2015-09-15T13:59:50.559Z",
            "updatedAt": "2015-09-15T13:59:50.559Z",
            "id": "55f8245674cb8184028877b9",
            "recipesCount": 22,
            "collectionsCount": 1,
            "followersCount": 1,
            "followingCount": 0,
            "followingCollectionsCount": 0
            }
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     */
    findOne: function (req, res, next) {
        var userId = req.param('id');
        if (!userId) { return next(); }

        User.findOne(userId)
            .populate('recipes')
            .populate('collections')
            .populate('followers')
            .populate('following')
            .populate('followingCollections')
            .exec(function (err, foundUser) {
                if (err) { return next(err); }

                if (!foundUser) { return res.notFound({ error: 'No user found' }); }
            
                // conto gli elementi delle collection
                foundUser.recipesCount = foundUser.recipes.length;
                foundUser.collectionsCount = foundUser.collections.length;
                foundUser.followersCount = foundUser.followers.length;
                foundUser.followingCount = foundUser.following.length;
                foundUser.followingCollectionsCount = foundUser.followingCollections.length;
            
                /**
                 * Tolgo gli elementi popolati, per qualche ragione gli elementi che sono
                 * delle associazioni vengono automaticamente tolte quando si esegue
                 * il seguente metodo.
                 */
                var obj = foundUser.toObject();

                return res.json(obj);
            });
    },
    
    /**
     * @api {get} /user/:id/upvoted_recipe Get a User
     * @apiName getUserUpvotedRecipes
     * @apiGroup User
     *
     * @apiDescription Serve per caricare tutti i dettagli di un 
     * particolare utente.
     *
     * @apiParam {String} id User id.
     *
     * @apiSuccess {json} user JSON that represents the user object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
            "username": "cavallo",
            "createdAt": "2015-09-15T13:59:50.559Z",
            "updatedAt": "2015-09-15T13:59:50.559Z",
            "id": "55f8245674cb8184028877b9",
            "recipesCount": 22,
            "collectionsCount": 1,
            "followersCount": 1,
            "followingCount": 0,
            "followingCollectionsCount": 0
            }
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     */
    findUserUpvotedRecipes: function (req, res, next) {
        var userId = req.param('id');
        if (!userId) { return next(); }

        User.findOne(userId)
            .populate('votes')
            .exec(function (err, foundUser) {
                if (err) { return next(err); }

                if (!foundUser) { return res.notFound({ error: 'No user found' }); }
            
                // Array con voti positivi, cioè con le ricette preferite
                var positiveVotes = new Array();

                for (var i in foundUser.votes) {
                    if (foundUser.votes[i].value > 0) {
                        positiveVotes.push(foundUser.votes[i].recipe)
                    }
                }

                // Copiato dal RecipeController.js
                Recipe.find()
                    .where({id: positiveVotes})// varia solo questa
                    .limit(actionUtil.parseLimit(req))
                    .skip(actionUtil.parseSkip(req))
                    .sort(actionUtil.parseSort(req))
                    .populate('author')
                    .populate('views')
                    .populate('votes')
                    .populate('comments')
                    .populate('trials')
                    .exec(function (err, foundRecipes) {
                        if (err) { return next(err); }
            
                        // array di appoggio
                        var recipes = new Array();
            
                        // conto gli elementi delle collection
                        for (var i in foundRecipes) {
                            foundRecipes[i].viewsCount = foundRecipes[i].views.length;
                            foundRecipes[i].votesCount = foundRecipes[i].votes.length;// aggiungere verifica sul value positivo
                            foundRecipes[i].commentsCount = foundRecipes[i].comments.length;
                            foundRecipes[i].trialsCount = foundRecipes[i].trials.length;

                            /**
                             * Tolgo gli elementi popolati, per qualche ragione gli elementi che sono
                             * delle associazioni vengono automaticamente tolte quando si esegue
                             * il seguente metodo.
                             */
                            var obj = foundRecipes[i].toObject();
                            delete obj.description;// tolgo la descrizione della ricetta
                            recipes.push(obj);
                        }
                        return res.json(recipes);
                    });
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
     * @apiUse TokenHeader
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
        if (user.id == userToFollow.id) { return res.badRequest(); }

        // ricarico l'utente corrente (con l'array dei following) (necessario...)
        User.findOne(user.id).populate('following').exec(function (err, foundUser) {
            // seguire più volte non è permesso
            if (foundUser.isFollowingUser(userToFollow.id) == true) { return res.badRequest(); }

            foundUser.following.add(userToFollow.id);

            foundUser.save(function (err, saved) {
                if (err) { return next(err); }
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
     * @apiUse TokenHeader
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
        User.findOne(user.id).exec(function (err, foundUser) {
            user.following.remove(userToFollow.id);

            user.save(function (err, saved) {
                if (err) { return next(err); }
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

        User.findOne(requestedUser.id).populate('followers').exec(function (err, foundUser) {
            if (err) { return next(err); }
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

        User.findOne(requestedUser.id).populate('following').exec(function (err, foundUser) {
            if (err) { return next(err); }
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
     * @apiUse TokenHeader
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
        User.findOne(user.id).populate('following').exec(function (err, foundUser) {
            if (err) { return next(err); }

            // seguire più volte non è permesso
            if (foundUser.isFollowingUser(targetUser.id) == false) { return res.notFound(); }

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
        if (!targetUser) { return res.badRequest(); }
        var user = req.user;

        // ricarico l'utente corrente (necessario...)
        User.findOne(user.id).populate('following').exec(function (err, foundUser) {
            if (err) { return next(err); }
            // seguire più volte non è permesso
            if (foundUser.isFollowingUser(targetUser) == false) { return res.notFound(); }

            return res.send(204, null);// OK - No Content
        });
    },

};

