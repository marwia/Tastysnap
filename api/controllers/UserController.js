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


var md5 = require('md5');
var fs = require('fs');

// setting allowed file types
var allowedTypes = ['image/jpeg', 'image/png'];
// skipper default upload directory .tmp/uploads/
var localImagesDir = sails.config.appPath + "/assets/images";

var server_name = "https://tastysnap.com";
var cdn_url = "https://tastysnapcdn.s3.amazonaws.com/";

/**
 * Funzioni comuni nell'upload di immagini
 */
var localUploadConfiguration = {
    // don't allow the total upload size to exceed ~5MB
    maxBytes: 5000000,
    saveAs: function (file, cb) {
        var d = new Date();
        var extension = file.filename.split('.').pop();

        if (extension == 'blob') { extension = 'jpg'; }
        // generating unique filename with extension
        var uuid = md5(d.getMilliseconds()) + "." + extension;

        console.log(file.headers['content-type']);
        // seperate allowed and disallowed file types
        if (allowedTypes.indexOf(file.headers['content-type']) === -1) {
            // don't accept not allowed file types
            return res.badRequest('Not supported file type');
        } else {
            // save as allowed files
            cb(null, localImagesDir + "/" + uuid);
        }
    }
};

var s3Upload = function (err, filesUploaded, whenDone) {
    if (err) {
        return res.badRequest();
    }
    // If no files were uploaded, respond with an error.
    if (filesUploaded.length === 0) {
        return res.badRequest('No file was uploaded');
    }

    // eseguo l'upload dell'immagine sul bucket S3
    S3FileService.uploadS3Object(filesUploaded[0], function (err, uploadedFiles) {

        if (err || !uploadedFiles) {
            return res.badRequest("Errore nell'upload del file sul bucket S3");
        }

        var filename = filesUploaded[0].fd.replace(/^.*[\\\/]/, '');
        var fileUrl = cdn_url + filename;

        // elimino il file temporaneo
        fs.unlink(filesUploaded[0].fd, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("File deleted successfully!");
        });

        whenDone(fileUrl);
    });
};


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
                delete obj.recipes;
                delete obj.collections;
                delete obj.followers;
                delete obj.following;
                delete obj.followingCollections;

                return res.json(obj);
            });
    },

    /**
     * @api {get} /user/last_seen Get 
     * @apiName GetUser
     * @apiGroup UserLastSeen
     *
     * @apiDescription Serve per conoscere l'ultima volta che un utente
     * è stato visto dal server (utile per determinare la query per le notifiche).
     *
     * @apiSuccess {Date} lastSeen Date when user was last seen.
     * 
     * @apiUse TokenHeader
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
            "lastSeen": "2015-09-15T13:59:50.559Z"
            }
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoUserError
     */
    getLastSeen: function (req, res, next) {
        var user = req.payload;

        User.findOne(user.id)
            .exec(function (err, foundUser) {
                if (err) { return next(err); }

                if (!foundUser) { return res.notFound({ error: 'No user found' }); }

                return res.json({ lastSeen: foundUser.lastSeen });
            });
    },

    /**
     * @api {get} /user/:id/upvoted_recipe Get a User favorite recipe list
     * @apiName getUserUpvotedRecipes
     * @apiGroup User
     *
     * @apiDescription Serve per richiedere la lista delle ricette
     * preferite di un utente.
     *
     * @apiParam {String} id User id.
     *
     * @apiSuccess {[RecipeObject]} recipeList JSON that represents the list of recipes.
     *
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

                // find recipes
                RecipeService.find(req, res, next, positiveVotes);

            });
    },

    /**
     * @api {get} /user/:id/viewed_recipe Get a User viewed recipe list
     * @apiName getUserViewedRecipes
     * @apiGroup User
     *
     * @apiDescription Serve per richiedere la lista delle ricette
     * viste (consultate) da un utente.
     *
     * @apiParam {String} id User id.
     *
     * @apiSuccess {[RecipeObject]} recipeList JSON that represents the list of recipes.
     *
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     */
    findUserViewedRecipes: function (req, res, next) {
        var userId = req.param('id');
        if (!userId) { return next(); }

        User.findOne(userId)
            .populate('viewedRecipes')
            .exec(function (err, foundUser) {
                if (err) { return next(err); }

                if (!foundUser) { return res.notFound({ error: 'No user found' }); }

                // Array con id di ricette viste
                var viewedRecipes = new Array();

                for (var i in foundUser.viewedRecipes) {
                    viewedRecipes.push(foundUser.viewedRecipes[i].recipe)
                }

                // find recipes
                RecipeService.find(req, res, next, viewedRecipes);
            });
    },

    /**
     * @api {get} /user/:id/tried_recipe Get a User tried recipe list
     * @apiName getUserTriedRecipes
     * @apiGroup User
     *
     * @apiDescription Serve per richiedere la lista delle ricette
     * provate (assaggiate) da un utente.
     *
     * @apiParam {String} id User id.
     *
     * @apiSuccess {[RecipeObject]} recipeList JSON that represents the list of recipes.
     *
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     */
    findUserTriedRecipes: function (req, res, next) {
        var userId = req.param('id');
        if (!userId) { return next(); }

        User.findOne(userId)
            .populate('triedRecipes')
            .exec(function (err, foundUser) {
                if (err) { return next(err); }

                if (!foundUser) { return res.notFound({ error: 'No user found' }); }

                // Array con id di ricette provate
                var triedRecipes = new Array();

                for (var i in foundUser.triedRecipes) {
                    triedRecipes.push(foundUser.triedRecipes[i].recipe)
                }

                // find recipes
                RecipeService.find(req, res, next, triedRecipes);
            });
    },

    uploadCoverImage: function (req, res) {
        var user = req.payload;

        var coverImage = req.file('image');
        if (!coverImage) { return res.badRequest('No file was found'); }

        if (process.env.NODE_ENV === 'production') {
            coverImage.upload({
                maxBytes: 5000000,
                dirname: localImagesDir

            }, function (err, filesUploaded) {
                // eseguo l'upload sul bucket s3
                s3Upload(err, filesUploaded, function (fileUrl) {
                    // se l'utente ha già una immagine di copertina
                    // elimino l'immagine di copertina vecchia
                    if (user.coverImageUrl) {
                        var filename = recipe.coverImageUrl.replace(/^.*[\\\/]/, '');
                        S3FileService.deleteS3Object(filename);
                    }

                    // aggiorno il profilo utente
                    User.update(user.id, {
                        // aggiungo url dell'immagine appena caricata
                        coverImageUrl: fileUrl,

                    }).exec(function (err, updatedUsers) {
                        if (err) return res.negotiate(err);
                        return res.json(updatedUsers[0]);
                    });
                });
            });
        }
        else {
            coverImage.upload(
                localUploadConfiguration,
                function whenDone(err, uploadedFiles) {
                    if (err) { return res.negotiate(err); }

                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) { return res.badRequest('No file was uploaded'); }

                    // get the file name from a path
                    var filename = uploadedFiles[0].fd.replace(/^.*[\\\/]/, '');
                    var fileUrl = require('util').format('%s%s', sails.getBaseUrl(), '/images/' + filename);

                    User.update(user.id, {
                        // aggiungo url dell'immagine appena caricata
                        coverImageUrl: fileUrl,

                    }).exec(function (err, updatedUsers) {
                        if (err) return res.negotiate(err);
                        return res.json(updatedUsers[0]);
                    });
                });
        }
    },

    /**
     * @api {post} /user/notification/register Register a User to receive notifications
     * @apiName registerUserToNotification
     * @apiGroup User
     *
     * @apiDescription Serve per registare un utente ad una socket e ricevere notifiche
     * in tempo reale. Questa chiamata deve essere fatta tramite web socket e non
     * tramite chiamata HTTP. Per potersi registare è richiesto il token di autorizzazione
     * spedito nel header.
     *
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad request
     * 
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */
    registerToNotifications: function (req, res, next) {
        if (!req.isSocket) {
            return res.badRequest('Only a client socket can subscribe to notification service.');
        }

        // Get the socket ID from the reauest
        var socketId = sails.sockets.getId(req);

        // Get the session from the request
        var session = req.session;

        // Create the session.users hash if it doesn't exist already
        session.users = session.users || {};

        // Save this user in the session, indexed by their socket ID.
        // This way we can look the user up by socket ID later.
        session.users[socketId] = req.payload;

        var user = req.payload;
        /**
         * Registro l'utente attualmente loggato tramite una socket
         * a ricevere messaggi a lui rivolti.
         */
        User.subscribe(req, user.id);

        res.json("200")

    },


};

